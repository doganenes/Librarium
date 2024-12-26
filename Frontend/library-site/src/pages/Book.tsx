import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getBookByISBN,
  makeReview,
  addFavoriteBook,
  removeFavoriteBook,
  getFavoriteBookList,
  borrowBook,
  getBorrowsByUserId,
  returnBook,
  getReviewsByISBN,
  deleteReview,
  Review,
} from "../api/bookApi";
import {
  Typography,
  CircularProgress,
  Box,
  Card,
  CardMedia,
  CardContent,
  Rating,
  TextField,
  Button,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  Person as AuthorIcon,
  Business as PublisherIcon,
  CalendarToday as YearIcon,
  Book as ISBNIcon,
  CheckCircle as AvailabilityIcon,
  LibraryBooks as BookshelfIcon,
  Star as RatingIcon,
  RateReview as ReviewIcon,
  Favorite,
  FavoriteBorder,
  LibraryBooks,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UserContext } from "../context/UserContext";

const Book: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isbn = searchParams.get("isbn");
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = React.useContext(UserContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [openBorrowDialog, setOpenBorrowDialog] = useState(false);
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [deleteReviewDialog, setDeleteReviewDialog] = useState<{
    open: boolean;
    reviewId: string | null;
  }>({ open: false, reviewId: null });

  const refreshBookData = React.useCallback(async () => {
    if (!isbn) return;
    try {
      const [bookData, reviewsData] = await Promise.all([
        getBookByISBN(isbn),
        getReviewsByISBN(isbn),
      ]);
      setBook(bookData);
      setReviews(reviewsData);
      if (user) {
        const [favoriteBooks, borrows] = await Promise.all([
          getFavoriteBookList(user.id),
          getBorrowsByUserId(user.id),
        ]);
        setIsFavorite(favoriteBooks.some((b: any) => b.bookISBN === isbn));
        const borrowed = borrows.find(
          (borrow: any) =>
            borrow.isbn === isbn && new Date(borrow.returnDate) > new Date()
        );
        setIsBorrowed(!!borrowed);
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [isbn, user]);

  useEffect(() => {
    refreshBookData();
  }, [refreshBookData]);

  const validationSchema = Yup.object({
    newReview: Yup.string()
      .required("Review is required")
      .min(10, "Review must be at least 10 characters"),
    newReviewRating: Yup.number()
      .required("Rating is required")
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5"),
  });

  const formik = useFormik({
    initialValues: {
      newReview: "",
      newReviewRating: 0,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await makeReview(
          user!.id,
          isbn!,
          values.newReviewRating,
          values.newReview
        );
        setMessage({ text: "Review submitted successfully", type: "success" });
        resetForm();
        await refreshBookData();
      } catch (error) {
        setMessage({ text: "Error submitting review", type: "error" });
      }
    },
  });

  const handleFavoriteToggle = async () => {
    if (!user) return;
    try {
      if (isFavorite) {
        await removeFavoriteBook(user.id, isbn!);
        setMessage({ text: "Removed from favorites", type: "success" });
      } else {
        await addFavoriteBook(user.id, isbn!);
        setMessage({ text: "Added to favorites", type: "success" });
      }
      setIsFavorite(!isFavorite);
      await refreshBookData();
    } catch (error) {
      setMessage({ text: "Error updating favorites", type: "error" });
    }
  };

  const handleBorrowClick = () => {
    setOpenBorrowDialog(true);
  };

  const handleBorrowConfirm = async () => {
    setOpenBorrowDialog(false);
    if (!user) return;
    try {
      await borrowBook(user.id, isbn!);
      setMessage({ text: "Book borrowed successfully", type: "success" });
      setIsBorrowed(true);
      await refreshBookData();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Error borrowing the book";
      setMessage({ text: errorMessage, type: "error" });
    }
  };

  const handleBorrowCancel = () => {
    setOpenBorrowDialog(false);
  };

  const handleReturnClick = () => {
    setOpenReturnDialog(true);
  };

  const handleReturnConfirm = async () => {
    setOpenReturnDialog(false);
    if (!user) return;
    try {
      await returnBook(user.id, isbn!);
      setMessage({ text: "Book returned successfully", type: "success" });
      setIsBorrowed(false);
      await refreshBookData();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Error returning the book";
      setMessage({ text: errorMessage, type: "error" });
    }
  };

  const handleReturnCancel = () => {
    setOpenReturnDialog(false);
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      await refreshBookData();
      setMessage({ text: "Review deleted successfully", type: "success" });
    } catch (error) {
      setMessage({ text: "Error deleting review", type: "error" });
    }
  };

  const handleDeleteReviewClick = (reviewId: string) => {
    setDeleteReviewDialog({ open: true, reviewId });
  };

  const handleDeleteReviewConfirm = async () => {
    if (deleteReviewDialog.reviewId) {
      await handleDeleteReview(deleteReviewDialog.reviewId);
    }
    setDeleteReviewDialog({ open: false, reviewId: null });
  };

  const handleDeleteReviewCancel = () => {
    setDeleteReviewDialog({ open: false, reviewId: null });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100vh" }}
        gap={2}
      >
        Loading...
        <CircularProgress />
      </Box>
    );
  }

  if (!book) {
    return (
      <Card>
        <CardContent>
          <ReviewIcon />
          <Typography>No book found for ISBN: {isbn}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, px: 10, py: 5 }}>
      <Grid container spacing={2} pb={5}>
        <Grid
          container
          size={{ xs: 12, md: 4 }}
          justifyContent="center"
          alignItems="center"
          px={8}
        >
          <Card className="h-fit w-full">
            <CardMedia
              component="img"
              image={book.imageURL}
              alt={book.bookTitle}
              onLoad={(e) => {
                if (e.currentTarget.naturalWidth < 10) {
                  e.currentTarget.src = "book-placeholder.png";
                }
              }}
            />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 !p-10 !pb-2">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                className="col-span-2"
              >
                <Typography variant="h4" align="center">
                  {book.bookTitle}
                </Typography>
              </Box>
              <Divider className="col-span-2" />
              <Box display="flex" alignItems="center" gap={1}>
                <AuthorIcon />
                <Typography variant="body1">
                  Author: {book.bookAuthor}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <PublisherIcon />
                <Typography variant="body1">
                  Publisher: {book.publisher}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <YearIcon />
                <Typography variant="body1">
                  Year: {book.yearOfPublication}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <ISBNIcon />
                <Typography variant="body1">ISBN: {book.isbn}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <AvailabilityIcon />
                <Typography variant="body1">
                  Availability:{" "}
                  {book.availability ? "Available" : "Not available"}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <BookshelfIcon />
                <Typography variant="body1">
                  Bookshelf: {book.bookShelf}
                </Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                className="col-span-2"
              >
                <RatingIcon />
                <Typography
                  variant="body1"
                  alignContent="center"
                  display="flex"
                  gap={1}
                >
                  Average Rating: <Rating value={book.avgRating} readOnly />{" "}
                  {book.avgRating} / 5
                </Typography>
              </Box>
            </CardContent>
            <CardContent className="flex justify-center">
              {user && (
                <div className="flex gap-4">
                  {isBorrowed ? (
                    <Button
                      variant="contained"
                      color="error"
                      endIcon={<LibraryBooks />}
                      onClick={handleReturnClick}
                    >
                      Return Book
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      disabled={!book.availability}
                      endIcon={<LibraryBooks />}
                      onClick={handleBorrowClick}
                    >
                      Borrow
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleFavoriteToggle}
                    color={isFavorite ? "error" : "primary"}
                    endIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                  >
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {user && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ mt: 4 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" align="center">
                      Add a Review
                    </Typography>
                    <form
                      onSubmit={formik.handleSubmit}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <TextField
                        label="Your Review"
                        name="newReview"
                        value={formik.values.newReview}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ mt: 2 }}
                        error={
                          formik.touched.newReview &&
                          Boolean(formik.errors.newReview)
                        }
                        helperText={
                          formik.touched.newReview && formik.errors.newReview
                        }
                      />
                      <Rating
                        name="newReviewRating"
                        value={formik.values.newReviewRating}
                        onChange={(_e, value) =>
                          formik.setFieldValue("newReviewRating", value)
                        }
                        onBlur={formik.handleBlur}
                        sx={{ mt: 2 }}
                      />
                      {formik.touched.newReviewRating &&
                        formik.errors.newReviewRating && (
                          <Typography color="error" variant="body2">
                            {formik.errors.newReviewRating}
                          </Typography>
                        )}
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Submit
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          )}
        </Grid>
      </Grid>
      {reviews && reviews.length > 0 ? (
        <Box sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <ReviewIcon />
                <Typography variant="h5">Reviews:</Typography>
              </Box>
            </CardContent>
            <Grid container spacing={2} sx={{ mt: 1 }} px={2} pb={3}>
              {reviews.map((review: Review, index: number) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <Card sx={{ height: "100%" }}>
                    <CardContent>
                      <Box
                        display="flex"
                        flexDirection="column"
                        gap={2}
                        height="100%"
                      >
                        <Box display="flex" alignItems="center" gap={1}>
                          <Rating
                            value={review.reviewRate}
                            readOnly
                            precision={0.5}
                          />
                          <Typography variant="body2" color="text.secondary">
                            ({review.reviewRate}/5)
                          </Typography>
                        </Box>
                        <Typography
                          variant="body1"
                          sx={{
                            flexGrow: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {review.description}
                        </Typography>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ mt: "auto" }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {new Date(review.createdDate).toLocaleDateString()}
                          </Typography>
                          {user && user.id === review.userId && (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() =>
                                handleDeleteReviewClick(
                                  review.reviewId.toString()
                                )
                              }
                            >
                              Delete Review
                            </Button>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Box>
      ) : (
        <Card>
          <CardContent>
            <ReviewIcon />
            <Typography variant="body1" sx={{ mt: 2 }}>
              No reviews available.
            </Typography>
          </CardContent>
        </Card>
      )}
      <Snackbar
        open={message !== null}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
      >
        <Alert severity={message?.type} onClose={() => setMessage(null)}>
          {message?.text}
        </Alert>
      </Snackbar>
      {/* Borrow Confirmation Dialog */}
      <Dialog open={openBorrowDialog} onClose={handleBorrowCancel}>
        <DialogTitle>Borrow Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to borrow "{book.bookTitle}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBorrowCancel}>Cancel</Button>
          <Button onClick={handleBorrowConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Return Confirmation Dialog */}
      <Dialog open={openReturnDialog} onClose={handleReturnCancel}>
        <DialogTitle>Return Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to return "{book.bookTitle}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReturnCancel}>Cancel</Button>
          <Button onClick={handleReturnConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Review Confirmation Dialog */}
      <Dialog open={deleteReviewDialog.open} onClose={handleDeleteReviewCancel}>
        <DialogTitle>Delete Review</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this review? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteReviewCancel}>Cancel</Button>
          <Button onClick={handleDeleteReviewConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Book;

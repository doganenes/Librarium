import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getBookByISBN } from "../api/bookApi";
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
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

const Book: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isbn = searchParams.get("isbn");
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isbn) {
      getBookByISBN(isbn)
        .then((response) => {
          setBook(response);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error getting book by ISBN:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isbn]);

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
    onSubmit: (values, { resetForm }) => {
      console.log("Submitting review:", values);
      // TODO: submit values to API
      resetForm();
    },
  });

  if (loading) {
    return <CircularProgress />;
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
          justifyContent={"center"}
          px={10}
        >
          <Card>
            <CardMedia
              component="img"
              image={book.imageURL}
              alt={book.bookTitle}
            />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent className="grid grid-cols-2 gap-4">
              <Typography variant="h4" align="center" className="col-span-2">
                {book.bookTitle}
              </Typography>
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
          </Card>
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
                      onChange={(e, value) =>
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
        </Grid>
      </Grid>
      {book.reviews && book.reviews.length > 0 ? (
        <Box sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <ReviewIcon />
              <Typography variant="h5">Reviews:</Typography>
            </CardContent>
          </Card>
          {book.reviews.map((review: any, index: number) => (
            <Card key={index} sx={{ mt: 2 }}>
              <CardContent>
                <ReviewIcon />
                <Typography variant="body1">{review}</Typography>
              </CardContent>
            </Card>
          ))}
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
    </Box>
  );
};

export default Book;

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {
  getFavoriteBookList,
  getBorrowsByUserId,
  returnBook,
} from "../api/bookApi";
import {
  Card,
  Typography,
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Email, Person } from "@mui/icons-material";

interface Book {
  bookISBN: string;
  title: string;
  author: string;
}

interface BorrowedBook {
  bookTitle: string;
  bookAuthor: string;
  isbn: string;
  borrowDate: string;
  returnDate: string;
}

const Profile = () => {
  const { user } = useContext(UserContext);
  const [favoriteBooks, setFavoriteBooks] = useState<Book[] | null>(null);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[] | null>(
    null
  );
  const [openReturnDialog, setOpenReturnDialog] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState<BorrowedBook | null>(
    null
  );
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      if (!localStorage.getItem("token")) {
        navigate("/login");
      }
      return;
    }

    const fetchFavoriteBooks = async () => {
      try {
        const books = await getFavoriteBookList(user.id);
        if (!books) setFavoriteBooks([]);
        else setFavoriteBooks(books);
      } catch (error) {
        console.error("Error fetching favorite books:", error);
      }
    };

    const fetchBorrowedBooks = async () => {
      try {
        const borrows = await getBorrowsByUserId(user.id);
        const now = new Date();
        const filteredBorrows = borrows.filter(
          (borrow: BorrowedBook) => new Date(borrow.returnDate) > now
        );
        const sortedBorrows = filteredBorrows.sort(
          (a: BorrowedBook, b: BorrowedBook) =>
            new Date(a.returnDate).getTime() - new Date(b.returnDate).getTime()
        );
        setBorrowedBooks(sortedBorrows);
      } catch (error) {
        console.error("Error fetching borrowed books:", error);
      }
    };

    fetchFavoriteBooks();
    fetchBorrowedBooks();
  }, [user, navigate]);

  const handleReturnClick = (borrow: BorrowedBook) => {
    setSelectedBorrow(borrow);
    setOpenReturnDialog(true);
  };

  const handleReturnConfirm = async () => {
    if (selectedBorrow && user) {
      try {
        await returnBook(user.id, selectedBorrow.isbn);
        setBorrowedBooks(
          borrowedBooks?.filter(
            (borrow) => borrow.isbn !== selectedBorrow.isbn
          ) || null
        );
        setOpenReturnDialog(false);
        setSelectedBorrow(null);
        setMessage({ text: "Book returned successfully", type: "success" });
      } catch (error) {
        console.error("Error returning book:", error);
        setMessage({ text: "Error returning book", type: "error" });
      }
    }
  };

  const handleReturnCancel = () => {
    setOpenReturnDialog(false);
    setSelectedBorrow(null);
  };

  return (
    <Box sx={{ flexGrow: 1, px: 10, py: 5 }} height="100%">
      <Grid container spacing={2} height="100%">
        {/* User Information */}
        <Grid
          container
          size={{ xs: 12, md: 4 }}
          alignItems="center"
          justifyContent="center"
        >
          <Card className="p-10 gap-2 flex flex-col w-full h-full ">
            <Typography variant="h4" className="mb-4">
              Profile Information
            </Typography>
            <Divider flexItem className="!my-2" />
            <Box display="flex" alignItems="center" gap={1}>
              <Person />
              <Typography variant="body1">
                Name: {user?.firstName} {user?.lastName}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Email />
              <Typography variant="body1">Email: {user?.email}</Typography>
            </Box>
          </Card>
        </Grid>

        {/* Favorite Books Grid */}
        {favoriteBooks !== null ? (
          favoriteBooks.length > 0 ? (
            <Grid
              container
              size={{ xs: 12, md: 8 }}
              flexDirection="column"
              spacing={2}
            >
              <Typography variant="h4" textAlign="center">
                Favorite Books
              </Typography>
              <div style={{ width: "100%", display: "flex", flexGrow: 1 }}>
                <DataGrid
                  rows={favoriteBooks}
                  getRowId={(row) => row.bookISBN}
                  columns={[
                    { field: "bookISBN", headerName: "ISBN", width: 150 },
                    { field: "title", headerName: "Title", width: 200 },
                    { field: "author", headerName: "Author", width: 200 },
                    {
                      field: "actions",
                      headerName: "Actions",
                      width: 150,
                      sortable: false,
                      filterable: false,
                      renderCell: (params) => (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            navigate(`/book?isbn=${params.row.bookISBN}`)
                          }
                        >
                          View Details
                        </Button>
                      ),
                    },
                  ]}
                />
              </div>
            </Grid>
          ) : (
            <Typography variant="body1">No favorite books found.</Typography>
          )
        ) : (
          <Typography variant="body1">Loading favorite books...</Typography>
        )}
        <Grid size={{ xs: 12, md: 4 }}></Grid>
        {/* Borrowed Books Section */}
        {borrowedBooks ? (
          borrowedBooks.length > 0 ? (
            <Grid
              container
              spacing={2}
              flexDirection="column"
              size={{ xs: 12, md: 8 }}
            >
              <Typography variant="h4" textAlign="center">
                Borrowed Books
              </Typography>
              <div style={{ width: "100%", display: "flex", flexGrow: 1 }}>
                <DataGrid
                  rows={borrowedBooks}
                  getRowId={(row) => row.isbn}
                  columns={[
                    { field: "isbn", headerName: "ISBN", width: 150 },
                    { field: "bookTitle", headerName: "Title", width: 200 },
                    { field: "bookAuthor", headerName: "Author", width: 200 },
                    {
                      field: "returnDate",
                      headerName: "Return Date",
                      width: 200,
                    },
                    {
                      field: "actions",
                      headerName: "Actions",
                      width: 300,
                      sortable: false,
                      filterable: false,
                      renderCell: (params) => (
                        <>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              navigate(`/book?isbn=${params.row.isbn}`)
                            }
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            color="secondary"
                            onClick={() => handleReturnClick(params.row)}
                            style={{ marginLeft: 8 }}
                          >
                            Return Book
                          </Button>
                        </>
                      ),
                    },
                  ]}
                />
              </div>
            </Grid>
          ) : (
            <Typography variant="body1">No borrowed books found.</Typography>
          )
        ) : (
          <Typography variant="body1">Loading borrowed books...</Typography>
        )}
      </Grid>
      {/* Return Confirmation Dialog */}
      <Dialog open={openReturnDialog} onClose={handleReturnCancel}>
        <DialogTitle>Return Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to return "{selectedBorrow?.bookTitle}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReturnCancel}>Cancel</Button>
          <Button onClick={handleReturnConfirm} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Snackbar Notification */}
      <Snackbar
        open={message !== null}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
      >
        <Alert severity={message?.type} onClose={() => setMessage(null)}>
          {message?.text}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;

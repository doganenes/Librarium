import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { getFavoriteBookList } from "../api/bookApi";
import {
  Card,
  Typography,
  Container,
  Box,
  CardContent,
  CardMedia,
  Button,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { useTimeout } from "@mui/x-data-grid/internals";
import { Email, Person } from "@mui/icons-material";

interface Book {
  bookISBN: string;
  title: string;
  author: string;
}

const Profile = () => {
  const { user } = useContext(UserContext);
  const [favoriteBooks, setFavoriteBooks] = useState<Book[] | null>(null);
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
        setFavoriteBooks(books);
      } catch (error) {
        console.error("Error fetching favorite books:", error);
      }
    };

    fetchFavoriteBooks();
  }, [user, navigate]);

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
        {favoriteBooks ? (
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
      </Grid>
    </Box>
  );
};

export default Profile;

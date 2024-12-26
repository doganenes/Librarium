import { useContext, useEffect, useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { OverdueBook, overdueBooks, addBook } from "../api/bookApi";
import { DataGrid } from "@mui/x-data-grid";
import {
  Grid2 as Grid,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const Admin = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [overdueData, setOverdueData] = useState<OverdueBook[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }
    if (user.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }

    const fetchOverdueData = async () => {
      try {
        const data = await overdueBooks();
        data.forEach(async (overdueBook) => {
          overdueBook.userDetails = `${overdueBook.user.firstName} ${overdueBook.user.lastName} (${overdueBook.user.phoneNumber})`;
        });
        setOverdueData(data);
      } catch (error) {
        console.error("Error fetching overdue data:", error);
      }
    };
    fetchOverdueData();
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: {
      isbn: "",
      bookTitle: "",
      bookAuthor: "",
      yearOfPublication: "",
      publisher: "",
      imageURL: "",
      bookShelf: "",
    },
    validationSchema: Yup.object({
      isbn: Yup.string().required("ISBN is required"),
      bookTitle: Yup.string().required("Title is required"),
      bookAuthor: Yup.string().required("Author is required"),
      yearOfPublication: Yup.number()
        .typeError("Year must be a number")
        .required("Year is required"),
      publisher: Yup.string().required("Publisher is required"),
      imageURL: Yup.string()
        .url("Invalid URL")
        .required("Image URL is required"),
      bookShelf: Yup.string().required("Bookshelf is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await addBook({
          isbn: values.isbn,
          bookTitle: values.bookTitle,
          bookAuthor: values.bookAuthor,
          yearOfPublication: Number(values.yearOfPublication),
          publisher: values.publisher,
          imageURL: values.imageURL,
          bookShelf: values.bookShelf,
        });
        setMessage("Book added successfully.");
        resetForm();
      } catch {
        setMessage("Error adding book.");
      }
    },
  });

  return (
    <Grid container alignItems="center" justifyContent="center" mt={5} gap={5}>
      <Grid size={{ xs: 12, lg: 7 }} style={{ height: 400 }}>
        <Typography variant="h4" gutterBottom>
          Overdue Books
        </Typography>
        <DataGrid
          rows={overdueData}
          getRowId={(row) => row.borrowId}
          columns={[
            {
              field: "bookTitle",
              headerName: "Book Title",
              width: 200,
              valueGetter: (_, row) => row.book.bookTitle,
            },
            {
              field: "bookShelf",
              headerName: "Shelf",
              width: 150,
              valueGetter: (_, row) => row.book.bookShelf,
            },
            { field: "bookISBN", headerName: "ISBN", width: 150 },
            { field: "userDetails", headerName: "User Details", width: 150 },
            { field: "borrowDate", headerName: "Borrow Date", width: 150 },
            { field: "returnDate", headerName: "Return Date", width: 150 },
          ]}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 4 }} style={{ height: "100%" }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" gutterBottom mt={2}>
            Add Book
          </Typography>
          <CardContent>
            {message && <Alert severity="info">{message}</Alert>}
            <form
              onSubmit={formik.handleSubmit}
              className="grid grid-cols-2 gap-4"
            >
              <TextField
                label="ISBN"
                {...formik.getFieldProps("isbn")}
                error={formik.touched.isbn && Boolean(formik.errors.isbn)}
                helperText={formik.touched.isbn && formik.errors.isbn}
              />
              <TextField
                label="Title"
                {...formik.getFieldProps("bookTitle")}
                error={
                  formik.touched.bookTitle && Boolean(formik.errors.bookTitle)
                }
                helperText={formik.touched.bookTitle && formik.errors.bookTitle}
              />
              <TextField
                label="Author"
                {...formik.getFieldProps("bookAuthor")}
                error={
                  formik.touched.bookAuthor && Boolean(formik.errors.bookAuthor)
                }
                helperText={
                  formik.touched.bookAuthor && formik.errors.bookAuthor
                }
              />
              <TextField
                label="Year"
                {...formik.getFieldProps("yearOfPublication")}
                error={
                  formik.touched.yearOfPublication &&
                  Boolean(formik.errors.yearOfPublication)
                }
                helperText={
                  formik.touched.yearOfPublication &&
                  formik.errors.yearOfPublication
                }
              />
              <TextField
                label="Publisher"
                {...formik.getFieldProps("publisher")}
                error={
                  formik.touched.publisher && Boolean(formik.errors.publisher)
                }
                helperText={formik.touched.publisher && formik.errors.publisher}
              />
              <TextField
                label="Image URL"
                {...formik.getFieldProps("imageURL")}
                error={
                  formik.touched.imageURL && Boolean(formik.errors.imageURL)
                }
                helperText={formik.touched.imageURL && formik.errors.imageURL}
              />
              <TextField
                label="Bookshelf"
                {...formik.getFieldProps("bookShelf")}
                error={
                  formik.touched.bookShelf && Boolean(formik.errors.bookShelf)
                }
                helperText={formik.touched.bookShelf && formik.errors.bookShelf}
              />
              <Button type="submit" variant="contained" className="col-span-2">
                Add Book
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Admin;

import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbar,
} from "@mui/x-data-grid";
import { Modal, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { getAllBooks } from "../api/bookApi";

/*
const filteredRowsEmptyState = [{ emptyState: true, isbn: "0" }];
*/

export default function BrowseBooks() {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  /*
  const [filteredRows, setFilteredRows] = useState<GridRowsProp>(
    filteredRowsEmptyState
  );

  const filterRows = (searchText: string) => {
    console.log(searchText);
    if (searchText === "") {
      setFilteredRows(filteredRowsEmptyState);
      return;
    }
    const filteredRows = rows.filter((row) => {
      return (
        row.bookTitle.toLowerCase().includes(searchText.toLowerCase()) ||
        row.bookAuthor.toLowerCase().includes(searchText.toLowerCase()) ||
        row.isbn.toLowerCase().includes(searchText.toLowerCase())
      );
    });
    setFilteredRows(filteredRows);
  };
  */

  const columns: GridColDef[] = useMemo<GridColDef[]>(
    () => [
      {
        field: "yearOfPublication",
        headerName: "Year of Publication",
        width: 150,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "imageURL",
        headerName: "Book Cover",
        width: 150,
        renderCell: (params) => (
          <img
            src={params.value}
            alt="Book Cover"
            className="h-20 content-center cursor-pointer"
            onClick={() => {
              setSelectedBook(params.row);
              setModalOpen(true);
            }}
          />
        ),
        display: "flex",
        align: "center",
      },
      { field: "bookTitle", headerName: "Title", minWidth: 200 },

      { field: "bookAuthor", headerName: "Author", width: 150 },

      { field: "publisher", headerName: "Publisher", width: 150 },
      {
        field: "availability",
        headerName: "Availability",
        width: 150,
        display: "flex",
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Typography
            variant="body1"
            className={`${
              params.value === "1" ? "text-green-500" : "text-red-500"
            }`}
          >
            {params.value === "1" ? "Available" : "Not Available"}
          </Typography>
        ),
        filterOperators: [
          {
            label: "Available",
            value: "available",
            getApplyFilterFn: () => {
              return (value) => {
                return value === "1";
              };
            },
          },
          {
            label: "Not Available",
            value: "notAvailable",
            getApplyFilterFn: () => {
              return (value) => {
                return value === "0";
              };
            },
          },
        ],
      },
      { field: "isbn", headerName: "ISBN", width: 150 },
      { field: "reviews", headerName: "Reviews", width: 150 },
    ],
    []
  );

  useEffect(() => {
    getAllBooks().then(async (response) => {
      setRows(response.data);
    });
  }, []);

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="flex justify-center items-center h-full w-full"
      >
        <img
          src={selectedBook?.imageURL}
          alt="Book Cover"
          className="min-h-50%"
        />
      </Modal>
      <div className="flex gap-10 flex-col mt-20">
        <Typography variant="h4" className="text-center mt-8">
          Browse Books
        </Typography>
        {/*}
        <Autocomplete
          options={["123", "asdas"]}
          freeSolo
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Books"
              variant="outlined"
              className="!w-1/2"
            />
          )}
          onInputChange={(e, value) => filterRows(value)}
          className="w-1/2 mx-auto flex justify-center"
        />
        */}
        <div className="w-full h-[610px] lg:px-24">
          <DataGrid
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
              },
            }}
            rows={rows}
            rowHeight={100}
            columns={columns}
            getRowId={(row) => row.isbn}
            loading={rows.length === 0}
          />
        </div>
      </div>
    </>
  );
}

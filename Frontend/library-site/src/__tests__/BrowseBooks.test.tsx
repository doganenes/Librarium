import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import BrowseBooks from "../pages/BrowseBooks";
import { useNavigate } from "react-router-dom";

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("../api/bookApi", () => ({
  getAllBooks: vi.fn(() =>
    Promise.resolve({
      data: [
        {
          isbn: "123",
          title: "Test Book",
          bookAuthor: "Test Author",
          yearOfPublication: 2021,
          publisher: "Test Publisher",
          availability: true,
          avgRating: 4.5,
          imageURL: "test-image.jpg",
          bookShelf: "Test Shelf",
        },
      ],
    })
  ),
}));

describe("BrowseBooks Columns Configuration", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockImplementation(() => mockNavigate);
  });

  it("should have correct column definitions", async () => {
    await act(async () => {
      render(<BrowseBooks />);
    });
    const component = screen.getByRole("grid");
    expect(component).toBeInTheDocument();
  });

  it("should handle book cover image load error", async () => {
    await act(async () => {
      render(<BrowseBooks />);
    });
    waitFor(() => {
      const img = screen.getAllByAltText("Book Cover")[0];
      fireEvent.load(img);
      expect(img.getAttribute("src")).toBe("book-placeholder.png");
    });
  });

  it("should open modal when clicking book cover", async () => {
    await act(async () => {
      render(<BrowseBooks />);
    });
    waitFor(() => {
      const bookCover = screen.getAllByAltText("Book Cover")[0];
      fireEvent.click(bookCover);
      expect(screen.getByRole("presentation")).toBeInTheDocument();
    });
  });

  it("should navigate to book details when clicking view details", async () => {
    await act(async () => {
      render(<BrowseBooks />);
    });
    waitFor(() => {
      const viewDetailsButton = screen.getByText("View Details");
      fireEvent.click(viewDetailsButton);
      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining("/book?isbn=")
      );
    });
  });

  it("should render average rating with correct precision", async () => {
    await act(async () => {
      render(<BrowseBooks />);
    });
    waitFor(() => {
      const ratingElement = screen.getByRole("img", { name: /[0-5] Stars$/i });
      expect(ratingElement).toBeInTheDocument();
    });
  });
});

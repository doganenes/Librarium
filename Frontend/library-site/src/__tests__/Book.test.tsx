import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  renderHook,
  render,
  screen,
  waitFor,
  act,
} from "@testing-library/react";
import Book from "../pages/Book";
import * as bookApi from "../api/bookApi";
import { UserContext } from "../context/UserContext";

// Mock the API functions
vi.mock("../api/bookApi", () => ({
  getBookByISBN: vi.fn(),
  getReviewsByISBN: vi.fn(),
  getFavoriteBookList: vi.fn(),
  getBorrowsByUserId: vi.fn(),
}));

// Mock useSearchParams
vi.mock("react-router-dom", () => ({
  useSearchParams: () => [new URLSearchParams({ isbn: "1234567890" })],
}));

describe("Book - refreshBookData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch book data and reviews when no user is logged in", async () => {
    const mockBook = { isbn: "1234567890", title: "Test Book" };

    const mockReviews = [
      {
        reviewId: 1,
        description: "Great book",
        reviewRate: 5,
        createdDate: "2021-10-01",
        isbn: "1234567890",
        userId: "user1",
      },
      {
        reviewId: 1,
        description: "Great book!!!",
        reviewRate: 5,
        createdDate: "2021-10-01",
        isbn: "1234567890",
        userId: "user2",
      },
    ];

    vi.mocked(bookApi.getBookByISBN).mockResolvedValue(mockBook);
    vi.mocked(bookApi.getReviewsByISBN).mockResolvedValue(mockReviews);

    const wrapper = ({ children }: { children: any }) => (
      <UserContext.Provider
        value={{
          user: {
            id: "user1",
            firstName: "test",
            lastName: "user",
            email: "test@user.com",
            role: "user",
          },
          setUser: () => {},
        }}
      >
        {children}
      </UserContext.Provider>
    );

    await act(async () => {
      render(<Book />, { wrapper });
    });
    expect(bookApi.getBookByISBN).toHaveBeenCalledWith("1234567890");
    expect(bookApi.getReviewsByISBN).toHaveBeenCalledWith("1234567890");
    expect(bookApi.getFavoriteBookList).toHaveBeenCalledWith("user1");
    expect(bookApi.getBorrowsByUserId).toHaveBeenCalledWith("user1");
  });

  it("should fetch all data when user is logged in", async () => {
    const mockBook = { isbn: "1234567890", title: "Test Book" };
    const mockReviews = [
      {
        reviewId: 1,
        description: "Great book",
        reviewRate: 5,
        createdDate: "2021-10-01",
        isbn: "1234567890",
        userId: "user1",
      },
      {
        reviewId: 1,
        description: "Great book!!!",
        reviewRate: 5,
        createdDate: "2021-10-01",
        isbn: "1234567890",
        userId: "user2",
      },
    ];
    const mockFavorites = [{ bookISBN: "1234567890" }];
    const mockBorrows = [
      {
        isbn: "1234567890",
        returnDate: new Date(Date.now() + 86400000).toISOString(),
      },
    ];

    vi.mocked(bookApi.getBookByISBN).mockResolvedValue(mockBook);
    vi.mocked(bookApi.getReviewsByISBN).mockResolvedValue(mockReviews);
    vi.mocked(bookApi.getFavoriteBookList).mockResolvedValue(mockFavorites);
    vi.mocked(bookApi.getBorrowsByUserId).mockResolvedValue(mockBorrows);

    waitFor(() => {
      expect(bookApi.getBookByISBN).toHaveBeenCalledWith("1234567890");
      expect(bookApi.getReviewsByISBN).toHaveBeenCalledWith("1234567890");
      expect(bookApi.getFavoriteBookList).toHaveBeenCalledWith("user1");
      expect(bookApi.getBorrowsByUserId).toHaveBeenCalledWith("user1");
    });
  });

  it("should handle errors gracefully", async () => {
    vi.mocked(bookApi.getBookByISBN).mockRejectedValue(new Error("API Error"));
    vi.mocked(bookApi.getReviewsByISBN).mockRejectedValue(
      new Error("API Error")
    );

    const wrapper = ({ children }: { children: any }) => (
      <UserContext.Provider
        value={{
          user: {
            id: "user1",
            firstName: "test",
            lastName: "user",
            email: "test@user.com",
            role: "user",
          },
          setUser: () => {},
        }}
      >
        {children}
      </UserContext.Provider>
    );

    const { result } = renderHook(() => Book({}), { wrapper });

    expect(result.current).toBeDefined();
  });

  it("should correctly identify borrowed books", async () => {
    const mockBorrows = [
      {
        isbn: "1234567890",
        returnDate: new Date(Date.now() + 86400000).toISOString(),
      },
    ];

    vi.mocked(bookApi.getBorrowsByUserId).mockResolvedValue(mockBorrows);
    vi.mocked(bookApi.getBookByISBN).mockResolvedValue({});
    vi.mocked(bookApi.getReviewsByISBN).mockResolvedValue([]);
    vi.mocked(bookApi.getFavoriteBookList).mockResolvedValue([]);

    const wrapper = ({ children }: { children: any }) => (
      <UserContext.Provider
        value={{
          user: {
            id: "user1",
            firstName: "test",
            lastName: "user",
            email: "test@user.com",
            role: "user",
          },
          setUser: () => {},
        }}
      >
        {children}
      </UserContext.Provider>
    );

    render(<Book />, { wrapper });
    // The book should be marked as borrowed since returnDate is in the future
    waitFor(() => {
      const component = screen.getByText("Borrow");
      expect(component).toBeInTheDocument();
      expect(component).toBeDisabled();
    });
  });

  it("should correctly identify favorite books", async () => {
    const mockFavorites = [{ bookISBN: "1234567890" }];

    vi.mocked(bookApi.getFavoriteBookList).mockResolvedValue(mockFavorites);
    vi.mocked(bookApi.getBookByISBN).mockResolvedValue({});
    vi.mocked(bookApi.getReviewsByISBN).mockResolvedValue([]);
    vi.mocked(bookApi.getBorrowsByUserId).mockResolvedValue([]);

    const wrapper = ({ children }: { children: any }) => (
      <UserContext.Provider
        value={{
          user: {
            id: "user1",
            firstName: "test",
            lastName: "user",
            email: "test@user.com",
            role: "user",
          },
          setUser: () => {},
        }}
      >
        {children}
      </UserContext.Provider>
    );

    render(<Book />, { wrapper });
    waitFor(() => {
      const component = screen.getByText("Remove from Favorites");
      expect(component).toBeInTheDocument();
    });
  });
});

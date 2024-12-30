import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Admin from "../pages/Admin";
import { UserContext } from "../context/UserContext";
import { addBook, overdueBooks } from "../api/bookApi";
import { useNavigate } from "react-router-dom";

// Mock dependencies
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("../api/bookApi", () => ({
  addBook: vi.fn(),
  overdueBooks: vi.fn(),
}));

const mockUser = {
  id: "1",
  firstName: "Test",
  lastName: "User",
  email: "t@u.com",
  role: "admin" as const,
};

const mockOverdueBooks = [
  {
    borrowId: 1,
    book: {
      bookTitle: "Test Book",
      bookShelf: "A1",
    },
    bookISBN: "1234567890",
    user: {
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "1234567890",
    },
    borrowDate: "2023-01-01",
    returnDate: "2023-02-01",
    userDetails: "John Doe (1234567890)",
  },
];

const renderWithContext = (component: React.ReactElement) => {
  return render(
    <UserContext.Provider value={{ user: mockUser, setUser: vi.fn() }}>
      {component}
    </UserContext.Provider>
  );
};

describe("Admin Component", () => {
  const mockNavigate = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as any).mockImplementation(() => mockNavigate);
    (overdueBooks as any).mockImplementation(() => mockOverdueBooks);
    localStorage.setItem("token", "mock-token");
  });

  it("renders overdue books table", async () => {
    renderWithContext(<Admin />);

    await waitFor(() => {
      expect(screen.getByText("Overdue Books")).toBeInTheDocument();
    });

    const grid = screen.getByRole("grid");
    expect(grid).toBeInTheDocument();

    await waitFor(() => {
      expect(within(grid).getByText("Test Book")).toBeInTheDocument();
      expect(within(grid).getByText("A1")).toBeInTheDocument();
      expect(within(grid).getByText("1234567890")).toBeInTheDocument();
      expect(
        within(grid).getByText("John Doe (1234567890)")
      ).toBeInTheDocument();
      expect(within(grid).getByText("2023-01-01")).toBeInTheDocument();
      expect(within(grid).getByText("2023-02-01")).toBeInTheDocument();
    });
  });

  it("handles overdue books fetch error", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (overdueBooks as any).mockRejectedValueOnce(new Error("Failed to fetch"));

    renderWithContext(<Admin />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error fetching overdue data:",
        expect.any(Error)
      );
    });

    consoleError.mockRestore();
  });

  it("redirects to login if no token", () => {
    localStorage.removeItem("token");

    renderWithContext(<Admin />);

    expect(mockNavigate).toHaveBeenCalledWith("/login", { replace: true });
  });

  it("redirects to home if user is not admin", () => {
    render(
      <UserContext.Provider
        value={{
          user: { ...mockUser, role: "user" as const },
          setUser: vi.fn(),
        }}
      >
        <Admin />
      </UserContext.Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("clears form after successful submission", async () => {
    (addBook as any).mockResolvedValueOnce({});
    renderWithContext(<Admin />);

    const isbnField = screen.getByLabelText(/ISBN/i, { selector: "input" });
    await userEvent.type(isbnField, "1234567890");

    const titleField = screen.getByLabelText(/Title/i, { selector: "input" });
    await userEvent.type(titleField, "Test Book");

    const authorField = screen.getByLabelText(/Author/i, { selector: "input" });
    await userEvent.type(authorField, "Test Author");

    const yearField = screen.getByLabelText(/Year/i, { selector: "input" });
    await userEvent.type(yearField, "2023");

    const publisherField = screen.getByLabelText(/Publisher/i, {
      selector: "input",
    });
    await userEvent.type(publisherField, "Test Publisher");

    const urlField = screen.getByLabelText(/Image URL/i, { selector: "input" });
    await userEvent.type(urlField, "https://test.com/image.jpg");

    const shelfField = screen.getByLabelText(/Bookshelf/i, {
      selector: "input",
    });
    await userEvent.type(shelfField, "A1");

    await waitFor(() => {
      expect(isbnField).toHaveValue("1234567890");
    });

    await act(async () => {
      fireEvent.click(screen.getByText(/Add Book/i, { selector: "button" }));
    });

    await waitFor(() => {
      expect(isbnField).toHaveValue("");
    });
  }, 20000);

  it("renders the add book form", async () => {
    await act(async () => {
      renderWithContext(<Admin />);
    });
    await waitFor(() => {
      expect(
        screen.getByLabelText(/ISBN/i, {
          selector: "input",
        })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Title/i, {
          selector: "input",
        })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Author/i, {
          selector: "input",
        })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Year/i, {
          selector: "input",
        })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Publisher/i, {
          selector: "input",
        })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Image URL/i, {
          selector: "input",
        })
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(/Bookshelf/i, {
          selector: "input",
        })
      ).toBeInTheDocument();
    });
  });

  it("validates required fields", async () => {
    renderWithContext(<Admin />);
    const submitButton = screen.getByText(/Add Book/i, { selector: "button" });

    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/ISBN is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Author is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Year is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Publisher is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Image URL is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Bookshelf is required/i)).toBeInTheDocument();
    });
  });

  it("validates year of publication format", async () => {
    renderWithContext(<Admin />);
    const yearField = screen.getByLabelText(/Year/i);
    await userEvent.type(yearField, "abc");

    await act(async () => {
      fireEvent.blur(yearField);
    });
    await waitFor(() => {
      expect(screen.getByText(/Year must be a number/i)).toBeInTheDocument();
    });
  });

  it("validates image URL format", async () => {
    renderWithContext(<Admin />);
    const urlField = screen.getByLabelText(/Image URL/i);

    await userEvent.type(urlField, "invalid-url");

    await act(async () => {
      fireEvent.blur(urlField);
    });

    await waitFor(() => {
      expect(screen.getByText(/Invalid URL/i)).toBeInTheDocument();
    });
  });

  it("submits form successfully", async () => {
    (addBook as any).mockResolvedValueOnce({});
    renderWithContext(<Admin />);

    await userEvent.type(
      screen.getByLabelText(/ISBN/i, { selector: "input" }),
      "1234567890"
    );
    await userEvent.type(
      screen.getByLabelText(/Title/i, { selector: "input" }),
      "Test Book"
    );
    await userEvent.type(
      screen.getByLabelText(/Author/i, { selector: "input" }),
      "Test Author"
    );
    await userEvent.type(
      screen.getByLabelText(/Year/i, { selector: "input" }),
      "2023"
    );
    await userEvent.type(
      screen.getByLabelText(/Publisher/i, { selector: "input" }),
      "Test Publisher"
    );
    await userEvent.type(
      screen.getByLabelText(/Image URL/i, { selector: "input" }),
      "https://test.com/image.jpg"
    );
    await userEvent.type(
      screen.getByLabelText(/Bookshelf/i, { selector: "input" }),
      "A1"
    );

    await act(async () => {
      fireEvent.click(screen.getByText(/Add Book/i, { selector: "button" }));
    });

    await waitFor(() => {
      expect(screen.getByText(/Book added successfully/i)).toBeInTheDocument();
      expect(addBook).toHaveBeenCalledWith({
        isbn: "1234567890",
        bookTitle: "Test Book",
        bookAuthor: "Test Author",
        yearOfPublication: 2023,
        publisher: "Test Publisher",
        imageURL: "https://test.com/image.jpg",
        bookShelf: "A1",
      });
    });
  }, 25000);

  it("handles submission error", async () => {
    (addBook as any).mockRejectedValueOnce(new Error("API Error"));
    renderWithContext(<Admin />);

    await userEvent.type(
      screen.getByLabelText(/ISBN/i, { selector: "input" }),
      "1234567890"
    );
    await userEvent.type(
      screen.getByLabelText(/Title/i, { selector: "input" }),
      "Test Book"
    );
    await userEvent.type(
      screen.getByLabelText(/Author/i, { selector: "input" }),
      "Test Author"
    );
    await userEvent.type(
      screen.getByLabelText(/Year/i, { selector: "input" }),
      "2023"
    );
    await userEvent.type(
      screen.getByLabelText(/Publisher/i, { selector: "input" }),
      "Test Publisher"
    );
    await userEvent.type(
      screen.getByLabelText(/Image URL/i, { selector: "input" }),
      "https://test.com/image.jpg"
    );
    await userEvent.type(
      screen.getByLabelText(/Bookshelf/i, { selector: "input" }),
      "A1"
    );

    await act(async () => {
      fireEvent.click(screen.getByText(/Add Book/i, { selector: "button" }));
    });
    await waitFor(() => {
      expect(screen.getByText(/Error adding book/i)).toBeInTheDocument();
    });
  }, 20000);
});

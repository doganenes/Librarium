import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as bookApi from "../api/bookApi";
import { UserContext } from "../context/UserContext";
import Login from "../pages/Login";

// Mock dependencies
vi.mock("../api/bookApi", () => ({
  login: vi.fn(),
  getUserFromToken: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null }),
  NavLink: ({ children }: { children: React.ReactNode }) => children,
}));

describe("Login Component", () => {
  const mockSetUser = vi.fn();

  // Setup component wrapper with required providers
  const renderLogin = () => {
    return render(
      <UserContext.Provider value={{ user: null, setUser: mockSetUser }}>
        <Login />
      </UserContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders login form", () => {
    renderLogin();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("validates empty form submission", async () => {
    renderLogin();
    const submitButton = screen.getByRole("button", { name: /log in/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    renderLogin();
    const emailInput = screen.getByLabelText(/email address/i);

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it("validates password length", async () => {
    renderLogin();
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("handles successful login", async () => {
    const mockUserData = {
      userId: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: "USER",
    };

    (bookApi.login as any).mockResolvedValueOnce({
      data: {
        token: {
          accessToken: "fake-access-token",
          refreshToken: "fake-refresh-token",
        },
      },
    });

    (bookApi.getUserFromToken as any).mockResolvedValueOnce({
      data: mockUserData,
    });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("fake-access-token");
      expect(localStorage.getItem("refreshToken")).toBe("fake-refresh-token");
      expect(mockSetUser).toHaveBeenCalledWith({
        ...mockUserData,
        id: mockUserData.userId,
        userId: undefined,
      });
      expect(mockNavigate).toHaveBeenCalledWith("/browsebooks", {
        state: { message: "Login successful" },
      });
    });
  });

  it("handles login error", async () => {
    const errorMessage = "Invalid credentials";
    (bookApi.login as any).mockRejectedValueOnce({
      response: { data: { message: errorMessage } },
    });

    renderLogin();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it("redirects authenticated users", () => {
    render(
      <UserContext.Provider
        value={{
          user: {
            id: "1",
            firstName: "test",
            lastName: "user",
            email: "t@u.com",
            role: "user" as const,
          },
          setUser: mockSetUser,
        }}
      >
        <Login />
      </UserContext.Provider>
    );

    expect(mockNavigate).toHaveBeenCalledWith("/browsebooks");
  });
});

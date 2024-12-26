import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(""); // Clear error on typing
  };

  const validateEmail = (email: string): boolean => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    // Simulate API request
    console.log("Request password reset for:", email);
    setSuccess("If the email is registered, a reset link will be sent.");
    setEmail(""); // Clear email input
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-md p-4 shadow-lg">
        <CardContent>
          <Typography variant="h4" component="h1" className="text-center pb-6">
            Forgot Password
          </Typography>
          <Typography
            variant="body2"
            className="text-center pb-4 text-gray-600"
          >
            Enter your email address below to receive a password reset link.
          </Typography>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={handleChange}
              error={!!error}
              helperText={error}
            />
            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="bg-blue-500 hover:bg-blue-600"
            >
              Send Reset Link
            </Button>
          </form>
          {/* Login Link */}
          <Typography
            variant="body2"
            className="text-center pt-4 text-gray-600"
          >
            Remembered your password?{" "}
            <NavLink to="/login" className="text-blue-500 hover:underline">
              Log in
            </NavLink>
          </Typography>
          {/* Success Message */}
          {success && (
            <Typography
              variant="body2"
              className="text-center mt-4 text-green-500"
            >
              {success}
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;

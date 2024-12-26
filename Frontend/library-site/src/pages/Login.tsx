import React, { useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getUserFromToken, login } from "../api/bookApi";
import { UserContext } from "../context/UserContext";

const Login: React.FC = () => {
  const [error, setError] = React.useState<string | null>(null);
  const { user, setUser } = React.useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { message: string } | undefined;

  useEffect(() => {
    if (user) {
      navigate("/browsebooks");
    }
  }, [user, navigate]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      login(values)
        .then((response) => {
          const { token } = response.data;
          const { accessToken, refreshToken } = token;

          // Save tokens in localStorage
          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          console.log("Login successful, tokens stored.");

          getUserFromToken().then((response) => {
            const user = response.data;
            console.log("User data stored.");
            setUser({
              id: user.userId,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
            });
          });
          // Redirect to /browsebooks
          navigate("/browsebooks", {
            state: { message: "Login successful" },
          });
        })
        .catch((error) => {
          const msg = error.response?.data?.message || "An error occurred.";
          setError(msg);
        });
    },
  });

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-md p-4 shadow-lg">
        <CardContent>
          <Typography variant="h4" component="h1" className="text-center pb-6">
            Log In
          </Typography>
          <form className="space-y-4" onSubmit={formik.handleSubmit}>
            {/* Email Field */}
            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("email")}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            {/* Password Field */}
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("password")}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            {/* Display server error */}
            {error && (
              <Typography variant="body2" color="error" className="text-center">
                {error}
              </Typography>
            )}
            {/* Display success message */}
            {state && !error && (
              <Typography
                variant="body2"
                color="success"
                className="text-center"
              >
                {state.message}
              </Typography>
            )}
            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="bg-blue-500 hover:bg-blue-600"
            >
              Log In
            </Button>
          </form>
          <Typography
            variant="body2"
            className="text-center pt-4 text-gray-600"
          >
            <NavLink
              to="/forgotpassword"
              className="text-blue-500 hover:underline"
            >
              Forgot password?
            </NavLink>
          </Typography>
          <Typography
            variant="body2"
            className="text-center pt-2 text-gray-600"
          >
            Don't have an account?{" "}
            <NavLink to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </NavLink>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;

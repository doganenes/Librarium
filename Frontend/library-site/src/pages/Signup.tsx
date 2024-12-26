import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { register } from "../api/bookApi";
import { UserContext } from "../context/UserContext";

const Signup: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phoneNumber: Yup.string()
      .matches(
        /^[0-9]{10,15}$/,
        "Phone Number must be 10-15 digits long and numeric"
      )
      .required("Phone Number is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
      register(values)
        .then((response) => {
          console.log("Registration successful", response);
          navigate("/login", {
            state: { message: "Registration successful, please log in" },
          });
        })
        .catch((error) => {
          console.error(error.response);
          const msg = error.response?.data?.message || "An error occurred.";
          setError(msg);
        });
    },
  });

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-lg p-4 shadow-lg">
        <CardContent>
          <Typography variant="h4" component="h1" className="text-center pb-6">
            Sign Up
          </Typography>
          <form
            className=" grid grid-cols-2 gap-4"
            onSubmit={formik.handleSubmit}
          >
            {/* firstName Name Field */}
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("firstName")}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
            />
            {/* lastName Name Field */}
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("lastName")}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
            />
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
            {/* Phone Number Field */}
            <TextField
              label="Phone Number"
              type="tel"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("phoneNumber")}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
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
            {/* Confirm Password Field */}
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps("confirmPassword")}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            />
            {/* Display server error */}
            {error && (
              <Typography
                variant="body2"
                color="error"
                className="text-center col-span-2"
              >
                {error}
              </Typography>
            )}
            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="bg-blue-500 hover:bg-blue-600 col-span-2"
            >
              Sign Up
            </Button>
          </form>
          <Typography
            variant="body2"
            className="text-center pt-4 text-gray-600"
          >
            Already have an account?{" "}
            <NavLink to="/login" className="text-blue-500 hover:underline">
              Log in
            </NavLink>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;

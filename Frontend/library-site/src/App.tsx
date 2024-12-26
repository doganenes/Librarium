import React from "react";
import Header from "./layout/Header";
import { Route, Routes, useLocation } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { AnimatePresence, motion } from "framer-motion";
import ThemeProvider from "./context/ThemeContext";

import Homepage from "./pages/Homepage";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import BrowseBooks from "./pages/BrowseBooks";
import Book from "./pages/Book";
import Logout from "./pages/Logout";
import Profile from "./pages/Profile";
import Error404 from "./pages/Error404";
import Admin from "./pages/Admin";

const App: React.FC = () => {
  const location = useLocation();
  return (
    <>
      <UserProvider>
        <ThemeProvider>
          <Header />
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.key}>
              <Route index path="/" element={pageWrapper(Homepage)} />
              <Route path="/signup" element={pageWrapper(Signup)} />
              <Route path="/login" element={pageWrapper(Login)} />
              <Route
                path="/forgotpassword"
                element={pageWrapper(ForgotPassword)}
              />
              <Route path="/browsebooks" element={pageWrapper(BrowseBooks)} />
              <Route path="/book" element={pageWrapper(Book)} />
              <Route path="/logout" element={pageWrapper(Logout)} />
              <Route path="/profile" element={pageWrapper(Profile)} />
              <Route path="/admin" element={pageWrapper(Admin)} />
              <Route path="*" element={pageWrapper(Error404)} />
            </Routes>
          </AnimatePresence>
        </ThemeProvider>
      </UserProvider>
    </>
  );
};

const pageWrapper = (Component: React.FC) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Component />
    </motion.div>
  );
};

export default App;

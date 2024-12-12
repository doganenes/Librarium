import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Button, IconButton, Drawer } from "@mui/material";
import { NavLink } from "react-router-dom";
import DynamicIcon from "../components/DynamicIcon";
import { useDarkMode } from "../context/ThemeContext";
import NavButton from "../components/NavButton";
import MenuIcon from "@mui/icons-material/Menu";
import { UserContext } from "../context/UserContext";

const Header: React.FC = () => {
  const [darkMode, setDarkMode] = useDarkMode();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = React.useContext(UserContext);

  // Toggle Drawer
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar position="static" className="bg-blue-500 shadow-md z-50">
        <Toolbar className="flex justify-between">
          {/* Left Section */}
          <div className="flex gap-5">
            <NavLink to="/" className="flex items-center space-x-2">
              <MenuBookIcon className="mr-1" />
              <Typography variant="h5" className="ml-2 !font-bold text-white">
                Librarium
              </Typography>
            </NavLink>
            {/* dark mode toggle */}
            <Button
              variant="outlined"
              color="inherit"
              className="border-white text-white hover:bg-white hover:text-blue-500"
              onClick={() => setDarkMode(!darkMode)}
              endIcon={
                darkMode ? (
                  <DynamicIcon icon="DarkMode" />
                ) : (
                  <DynamicIcon icon="LightMode" />
                )
              }
            >
              {darkMode ? "Dark Mode" : "Light Mode"}
            </Button>
          </div>

          {/* Right Section (Desktop View) */}
          <div className="items-center space-x-4 hidden md:flex">
            {user ? (
              <>
                <Typography variant="h6" className="text-white">
                  Hello, {user.firstName} {user.lastName}
                </Typography>
                <NavButton
                  id="logout"
                  color="inherit"
                  variant="outlined"
                  className="border-white text-white hover:bg-white hover:text-blue-500"
                />
              </>
            ) : (
              <>
                <NavButton id="login" color="inherit" variant="text" />
                <NavButton
                  id="signup"
                  color="inherit"
                  variant="outlined"
                  className="border-white text-white hover:bg-white hover:text-blue-500"
                />
              </>
            )}
            <NavButton id="browseBooks" />
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center">
            <IconButton onClick={toggleDrawer(true)} color="inherit">
              <MenuIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile Navigation */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div className="flex flex-col p-4 space-y-4">
          {user ? (
            <>
              <Typography variant="h6">
                Hello, {user.firstName} {user.lastName}
              </Typography>
              <NavButton
                id="logout"
                color="inherit"
                variant="outlined"
                className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
              />
            </>
          ) : (
            <>
              <NavButton id="login" color="inherit" variant="text" />
              <NavButton
                id="signup"
                color="inherit"
                variant="outlined"
                className="border-white text-white hover:bg-white hover:text-blue-500"
              />
            </>
          )}
          <NavButton id="browseBooks" />
          <Button
            variant="outlined"
            color="inherit"
            className="border-white text-white hover:bg-white hover:text-blue-500"
            onClick={() => setDarkMode(!darkMode)}
            endIcon={
              darkMode ? (
                <DynamicIcon icon="DarkMode" />
              ) : (
                <DynamicIcon icon="LightMode" />
              )
            }
          >
            {darkMode ? "Dark Mode" : "Light Mode"}
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default Header;

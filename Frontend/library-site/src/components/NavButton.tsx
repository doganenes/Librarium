import { Button, ButtonProps } from "@mui/material";
import { NavLink } from "react-router-dom";
import DynamicIcon from "./DynamicIcon";

const navConfig = [
  {
    id: "browseBooks",
    label: "Browse Books",
    icon: "BrowseBooks",
    to: "/browsebooks",
  },
  {
    id: "profile",
    label: "Profile",
    icon: "Profile",
    to: "/profile",
  },
  {
    id: "login",
    label: "Log In",
    icon: "Login",
    to: "/login",
  },
  {
    id: "signup",
    label: "Sign Up",
    icon: "Signup",
    to: "/signup",
  },
  {
    id: "logout",
    label: "Log Out",
    icon: "Logout",
    to: "/logout",
  },
  {
    id: "admin",
    label: "Admin Panel",
    icon: "AdminPanel",
    to: "/admin",
  },
];

type NavButtonProps = {
  className?: string;
  variant?: "text" | "outlined" | "contained";
  id: string;
  size?: "small" | "medium" | "large";
} & ButtonProps;

const NavButton = ({
  className,
  id,
  size,
  variant = "contained",
  ...props
}: NavButtonProps) => {
  const item = navConfig.find((item) => item.id === id);
  if (!item) {
    return null;
  }
  const { label, icon, to } = item;
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      component={NavLink}
      to={to}
      replace={true}
      endIcon={<DynamicIcon icon={icon} />}
      {...props}
    >
      {label}
    </Button>
  );
};

export default NavButton;

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
    return null; // or handle the error as needed
  }
  const { label, icon, to } = item;
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      component={NavLink}
      to={to}
      endIcon={<DynamicIcon icon={icon} />}
      {...props}
    >
      {label}
    </Button>
  );
};

export default NavButton;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

const Logout = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/");
  }, [setUser, navigate]);

  return null;
};

export default Logout;

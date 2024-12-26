import { createContext, useState, ReactNode, useEffect } from "react";
import { getUserFromToken } from "../api/bookApi";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserFromToken()
        .then((response) => {
          console.log("User data stored.");
          const user = response.data;
          setUser({
            id: user.userId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          });
        })
        .catch((error) => {
          console.error("Error getting user from token:", error);
          setUser(null);
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {loading ? null : children}
    </UserContext.Provider>
  );
};

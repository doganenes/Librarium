import React, { createContext, useState, ReactNode, useEffect } from "react";
import axiosInstance from "../utils/axios";
import { getUserFromToken } from "../api/bookApi";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserFromToken().then((response) => {
        const user = response.data;
        setUser({
          id: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
      });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

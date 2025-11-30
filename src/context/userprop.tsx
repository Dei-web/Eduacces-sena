"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type User = {
  id_user: number;
  correo: string;
  id_persona: number;
  rol: "instructor" | "directora";
  nombre?: string;
  apellido?: string;
};

export type UserContextType = {
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token?: string | null) => void;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) setUserState(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  const setUser = (user: User | null, tokenValue: string | null = null) => {
    setUserState(user);
    setToken(tokenValue);

    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");

    if (tokenValue) localStorage.setItem("token", tokenValue);
    else localStorage.removeItem("token");
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch("http://localhost:3000/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 👈 obligatorio
          },
        });
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }

    // limpiar estado local pase lo que pase
    setUserState(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, token, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser debe usarse dentro de UserProvider");
  return context;
};

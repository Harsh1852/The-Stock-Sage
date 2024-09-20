import React, { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    accessToken: "",
  });

  function isTokenExpired(token) {
    try {
      const decodedToken = jwtDecode(token);

      if (!decodedToken.exp) {
        return false; // No expiration time in the token
      }

      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error("Invalid token:", error);
      return true; // Consider invalid token as expired
    }
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (
      accessToken !== "undefined" &&
      accessToken !== null &&
      !isTokenExpired(accessToken)
    ) {
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: true,
        accessToken: accessToken,
      }));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const useAuth = () => {
  const { authState, setAuthState } = useContext(AuthContext);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("lastVisitedPage");
    setAuthState((prev) => ({
      ...prev,
      accessToken: "",
      isAuthenticated: false,
    }));
  };

  return { authState, setAuthState, logout };
};

export default useAuth;

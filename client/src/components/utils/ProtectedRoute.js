import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layout";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const accessToken = JSON.parse(localStorage.getItem("logged"))?.accessToken;
    const refreshToken = JSON.parse(
      localStorage.getItem("logged")
    )?.refreshToken;
    if (accessToken && refreshToken) setIsAuthenticated(true);
    else {
      console.log("empty localStorage, redirecting to login");
      navigate("/entry");
    }
  }, []);

  if (isAuthenticated)
    return <Layout loggedIn={isAuthenticated}>{children}</Layout>;
  else return <div>loading...</div>;
};

export default ProtectedRoute;

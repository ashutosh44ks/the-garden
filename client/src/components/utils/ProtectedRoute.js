import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import Layout from "../layout";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const verifyUser = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/users/login?username=${
          JSON.parse(localStorage.getItem("logged")).username
        }&password=${JSON.parse(localStorage.getItem("logged")).password}`
      );
      console.log(data);
      setIsAuthenticated(true);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    //if nothing in localStorage, redirect to login
    if (localStorage.getItem("logged") === null) {
      console.log("false localStorage, redirecting to login");
      navigate("/entry");
    } else {
      verifyUser();
    }
  }, []);

  if (isLoading) return <div>Loading...</div>;
  else if (isAuthenticated) return <Layout>{children}</Layout>;
  else return <Navigate to="/entry" />;
};

export default ProtectedRoute;

import { useNavigate } from "react-router-dom";
import "./Error404.css";

const Error404 = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="error-404 p-8 text-dark">
        <div className="flex flex-col justify-center items-center py-8">
          <h1>404</h1>
          <img src="/assets/maintainance.svg" alt="404" />
          <p>Sorry, we couldn't find that page.</p>
        </div>
        <div className="flex justify-end">
          <button className="btn-primary" onClick={() => navigate("/")}>
            Navigate to Home
          </button>
        </div>
      </div>
      <div className="bg-404"></div>
    </>
  );
};

export default Error404;

import { useNavigate } from "react-router-dom";
import "./Error404.css";

const Error404 = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="p-8 error-404 card">
        <div className="card-body flex flex-col gap-4 ">
          <div>
            <h2 className="font-bold">Under Construction</h2>
            <p> or something like that...</p>
          </div>
          <img src="/assets/404.png" alt="Under Construction" />
        </div>
        <div className="flex justify-end mt-2">
          <button
            className="btn-primary"
            onClick={() => navigate("/")}
          >
            Navigate to Home
          </button>
        </div>
      </div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"></div>
    </>
  );
};

export default Error404;

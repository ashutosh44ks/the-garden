import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import api from "../../components/utils/api";
import PdfViewer from "../SubjectFileHandling/components/PdfViewer";

const ViewCalendar = () => {
  const { calendarType } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  function _arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  const getFile = async () => {
    try {
      const { data } = await api.get(
        `/api/calendars/get_calendar?calendar_type=${calendarType}`,
        {
          responseType: "arraybuffer",
        }
      );
      setFile(_arrayBufferToBase64(data));
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  const [user, setUser] = useState({});
  const getUserDetails = async () => {
    const username = jwt_decode(
      JSON.parse(localStorage.getItem("logged")).accessToken
    ).username;
    try {
      const { data } = await api.get(
        `/api/users/get_user?username=${username}`
      );
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserDetails();
    getFile();
  }, []);

  if (file === null)
    return (
      <div className="p-8">
        <div>No Calendar</div>
        {(user.role === "admin" || "moderator") && (
          <div
            onClick={() => navigate("./upload")}
            className="text-blue cursor-pointer"
          >
            Click here to upload current calendar
          </div>
        )}
      </div>
    );
  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-dark">
          {calendarType === "semester"
            ? "Semester Calendar"
            : "Holiday Calendar"}
        </h1>
        <a
          className="btn-primary"
          href={`data:application/pdf;base64,${file}`}
          download={
            calendarType === "semester"
              ? "semester_calendar"
              : "holiday_calendar"
          }
        >
          Download
        </a>
      </div>
      {isLoading ? (
        <div className="my-8">Loading...</div>
      ) : (
        <PdfViewer file={file} />
      )}
    </div>
  );
};

export default ViewCalendar;

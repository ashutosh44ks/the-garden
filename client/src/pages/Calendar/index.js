import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import api from "../../components/utils/api";
import PdfViewer from "../SubjectFileHandling/components/PdfViewer";

const ViewCalendar = () => {
  const { calendarType } = useParams();

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

  const userRole = jwt_decode(
    JSON.parse(localStorage.getItem("logged")).accessToken
  )?.role;

  useEffect(() => {
    getFile();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="font-medium text-dark">
          {calendarType === "semester"
            ? "Semester Calendar"
            : "Holiday Calendar"}
        </h1>
        {!isLoading && (
          <>
            <div className="flex gap-4">
              {userRole && userRole !== "user" && (
                <Link to="/upload" className="btn-secondary">
                  Upload
                </Link>
              )}
              {file !== null && (
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
              )}
            </div>
          </>
        )}
      </div>
      {isLoading ? (
        <div className="my-8">Loading...</div>
      ) : file !== null ? (
        <PdfViewer file={file} />
      ) : (
        <div className="text-dark-2">Requested resource not found</div>
      )}
    </div>
  );
};

export default ViewCalendar;

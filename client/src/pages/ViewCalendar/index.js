import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../components/utils/api";

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
      const { data } = await api.get(`/api/other_files/${calendarType}`, {
        responseType: "arraybuffer",
      });
      setFile(_arrayBufferToBase64(data));
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getFile();
  }, []);

  if (file === null) return <div className="p-8">No Calendar</div>;
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
          href={`data:image/png;base64,${file}`}
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
        <div>Loading...</div>
      ) : (
        <div className="syllabus-container">
          <img
            src={`
          data:image/png;base64,${file}
        `}
            alt="file"
          />
        </div>
      )}
    </div>
  );
};

export default ViewCalendar;

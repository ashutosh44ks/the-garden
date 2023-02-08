import { useState, useEffect } from "react";
import axios from "axios";

const SubjectView = () => {
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
    let subjectCode = window.location.pathname.split("/")[2];
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/subjects/view_syllabus/${subjectCode}`,
        {
          responseType: "arraybuffer",
        }
      );
      setFile(_arrayBufferToBase64(data));
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getFile();
  }, []);
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-dark">Syllabus</h1>
        <a
          className="btn-primary"
          href={`data:image/png;base64,${file}`}
          download="syllabus.png"
        >
          Download
        </a>
      </div>
      <div>
        <img
          src={`
          data:image/png;base64,${file}
        `}
          alt="file"
        />
      </div>
    </div>
  );
};

export default SubjectView;

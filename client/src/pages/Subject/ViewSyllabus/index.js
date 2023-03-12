import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../components/utils/api";

const SubjectView = () => {
  const { subjectId } = useParams();
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
        `/api/subjects/view_syllabus/${subjectId}`,
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
  useEffect(() => {
    getFile();
  }, []);
  if (isLoading) return <div>Loading...</div>;
  if (file === null) return <div>No Syllabus</div>;
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

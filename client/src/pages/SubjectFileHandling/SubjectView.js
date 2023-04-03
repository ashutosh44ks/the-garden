import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../components/utils/api";
import toLabel from "../../components/utils/toLabel";
import ImageViewer from "./components/ImageViewer";
import PdfViewer from "./components/PdfViewer";

const SubjectView = () => {
  const navigate = useNavigate();
  const { subjectId, category } = useParams();

  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [fileList, setFileList] = useState([]);
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
  const getFile = async (fileName) => {
    setFileType(fileName.split(".")[fileName.split(".").length - 1]);
    try {
      const { data } = await api.get(
        `/api/subjects/get_file?subject_code=${subjectId}&file_name=${fileName}`,
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
  const getListOfFiles = async () => {
    try {
      const { data } = await api.get(
        `/api/subjects/get_dir_files?subject_code=${subjectId}&prefix=${category}`
      );
      // if only 1 file, we show it else we show the list of files and user clicks on one to view it
      if (data.list.length === 1) getFile(data.list[0]);
      else setFileList(data.list);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getListOfFiles();
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-dark">{toLabel(category)}</h1>
          <a
            className="btn-primary"
            href={
              fileType === "pdf"
                ? `data:application/pdf;base64,${file}`
                : `data:image/png;base64,${file}`
            }
            download={category + "." + fileType}
          >
            Download
          </a>
        </div>
        <div className="text-sm text-dark-2">
          Go back to{" "}
          <u
            className="text-blue cursor-pointer"
            onClick={() => {
              navigate(`/subject/${subjectId}`);
            }}
          >
            {subjectId} page
          </u>
        </div>
      </div>
      {/* Need to create the directory part here */}
      {isLoading ? (
        <div>Loading...</div>
      ) : fileType === "pdf" ? (
        <PdfViewer file={file} category={category} />
      ) : (
        <ImageViewer file={file} category={category} />
      )}
    </div>
  );
};

export default SubjectView;

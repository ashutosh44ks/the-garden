import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../components/utils/api";
import toLabel from "../../components/utils/toLabel";
import dateFormatter from "../../components/utils/dateFormatter";
import ImageViewer from "./components/ImageViewer";
import PdfViewer from "./components/PdfViewer";
import FileManager from "./components/FileManager";
import "./style.css";

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
  const getFile = async (file) => {
    const { val, name, uploader, created_at } = file;
    setFileType(val.split(".")[val.split(".").length - 1]);
    try {
      const { data } = await api.get(
        `/api/subjects/get_file?subject_code=${subjectId}&file_name=${val}`,
        {
          responseType: "arraybuffer",
        }
      );
      setFile({
        data: _arrayBufferToBase64(data),
        name,
        type: val.split(".")[val.split(".").length - 1],
        uploader,
        created_at,
      });
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
      setFileList(
        data.list.map((file) => {
          return {
            name: file.userFileName || file.dbFileName.split(".")[0],
            type: file.dbFileName.split(".")[1],
            created_at: dateFormatter(
              file.dbFileName.split(".")[0].split("_")[2].substring(0, 10)
            ),
            val: file.dbFileName,
            uploader: file.uploader,
          };
        })
      );
      if (data.list.length === 1) getFile(data.list[0]);
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
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/subject/${subjectId}/${category}/upload`)}
          >
            Upload
          </button>
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
      {fileList.length > 1 && (
        <FileManager fileList={fileList} getFile={getFile} />
      )}
      {fileList.length === 0 && (
        <div className="text-sm text-dark-2 my-8">No files uploaded yet</div>
      )}
      {file === null ? (
        <div className="text-sm text-dark-2 my-8">
          Please select a file to view it
        </div>
      ) : isLoading ? (
        <div className="my-8">Loading...</div>
      ) : (
        <div className="view-container my-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <div>{file.name}</div>
              <div className="text-sm text-dark-2">
                Uploaded by {file.uploader} on {file.created_at}
              </div>
            </div>
            <a
              className="btn btn-secondary"
              href={
                file.type === "pdf"
                  ? `data:application/pdf;base64,${file.data}`
                  : `data:image/png;base64,${file.data}`
              }
              download={category + "." + file.type}
            >
              Download
            </a>
          </div>
          {fileType === "pdf" ? (
            <PdfViewer file={file.data} />
          ) : (
            <ImageViewer file={file.data} />
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectView;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
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

  const [activeItem, setActiveItem] = useState(null);
  const [listFiles, setListFiles] = useState([]);
  const [listTexts, setListTexts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getListOfFiles = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(
        `/api/subjects/get_dir_files?subject_code=${subjectId}&prefix=${category}`
      );
      // if only 1 file, we show it else we show the list of files and user clicks on one to view it
      setListFiles(
        data.list.map((file) => {
          return {
            name: file.name,
            dbFullPath: file.dbFullPath,
            type: file.type,
            created_at: dateFormatter(file.created_at?.substring(0, 10)),
            val: file.downloadUrl,
            uploader: file.uploader,
          };
        })
      );
      // if (data.list.length === 1) getFile(data.list[0]);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };
  const getListOfTexts = async () => {
    try {
      const { data } = await api.get(
        `/api/subjects/get_qp_texts?subject_code=${subjectId}`
      );
      setListTexts(
        data.map((item) => {
          return {
            name: `${toLabel(item.category)} - ${item.year}`,
            type: "text",
            created_at: dateFormatter(item.created_at?.substring(0, 10)),
            val: item.content,
            uploader: item.uploader,
            key: item._id,
          };
        })
      );
      // if (data.length === 1) setActiveItem(data.list[0]);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getListOfFiles();
    if (category === "qp") getListOfTexts();
  }, []);

  const userRole = jwt_decode(
    JSON.parse(localStorage.getItem("logged")).accessToken
  )?.role;

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-dark">
            {category === "qp" ? "Question Papers" : toLabel(category)}
          </h1>
          <div className="flex gap-4">
            <button className="btn btn-secondary" onClick={getListOfFiles}>
              Refresh
            </button>
            {(category !== "syllabus" ||
              (category === "syllabus" && userRole && userRole !== "user")) && (
              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate(`/subject/${subjectId}/${category}/upload`)
                }
              >
                Upload
              </button>
            )}
          </div>
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
      {(listTexts.length > 0 || listFiles.length > 0) && (
        <FileManager
          list={[...listTexts, ...listFiles]}
          // getFile={getFile}
          setActiveItem={setActiveItem}
          subjectId={subjectId}
          setListFiles={setListFiles}
          setListTexts={setListTexts}
          isLoading={isLoading}
        />
      )}
      {isLoading ? (
        <div className="text-sm text-dark-2 my-8">Loading...</div>
      ) : listTexts.length === 0 && listFiles.length === 0 ? (
        <div className="text-sm text-dark-2 my-8">No items uploaded yet</div>
      ) : activeItem === null ? (
        <div className="text-sm text-dark-2 my-8">
          Please select an item to view it
        </div>
      ) : (
        <div className="view-container my-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <div>{activeItem.name}</div>
              <div className="text-sm text-dark-2">
                Uploaded by {activeItem.uploader} on {activeItem.created_at}
              </div>
            </div>
            {activeItem.type !== "text" && (
              <a
                className="btn btn-secondary"
                href={activeItem.val}
                target="_blank"
                rel="noreferrer"
                download={category + "." + activeItem.type}
              >
                Download
              </a>
            )}
          </div>
          {activeItem.type === "text" ? (
            <div className="whitespace-pre-line break-words">
              {activeItem.val}
            </div>
          ) : activeItem.type === "pdf" ? (
            <PdfViewer file={activeItem.val} />
          ) : activeItem.type === "docx" ? (
            <div className="text-dark">
              Not supported yet. You can still download the file to your device.
            </div>
          ) : (
            <ImageViewer file={activeItem.val} />
          )}
        </div>
      )}
    </div>
  );
};

export default SubjectView;

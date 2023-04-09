import { useState, useEffect } from "react";
import dateFormatter from "../../../components/utils/dateFormatter";

const FileManager = ({ fileList, getFile }) => {
  const [fileListExpanded, setFileListExpanded] = useState([]);
  useEffect(() => {
    setFileListExpanded(
      fileList.map((file) => {
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
  }, [fileList]);
  return (
    <div className="file-manager mb-6">
      <div className="text-sm text-dark-2 mb-2">
        Please select a file below to view it
      </div>
      <ul>
        {fileListExpanded.map((file) => (
          <li
            onClick={() => getFile(file.val)}
            className="flex items-center justify-between gap-2 mb-1 cursor-pointer"
            key={file.val}
          >
            <div className="flex items-center gap-2">
              <span className="min-w-[4rem] file-tag text-center text-sm">
                {file.type}
              </span>
              <span>{file.name}</span>
            </div>
            <span className="text-dark-2 text-sm">
              uploaded on {file.created_at} by {file.uploader}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileManager;

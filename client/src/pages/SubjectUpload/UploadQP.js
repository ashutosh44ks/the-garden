import FilesDragAndDrop from "./FilesDragAndDrop";
import { useState } from "react";
import axios from "axios";

const UploadQP = () => {
  // for file upload task
  const [selectedFile, setSelectedFile] = useState(null);
  const onUpload = (files) => {
    console.log(files);
    setSelectedFile(files[0]);
  };
  const uploadFile = async () => {
    let formData = new FormData();
    formData.append("hi", "selectedFile");
    formData.append("file", selectedFile);
    try {
      const { data } = axios.post("http://localhost:3001/api/upload", formData);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div>
      <h1>Upload Question Papers here</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          uploadFile();
        }}
      >
        <FilesDragAndDrop onUpload={onUpload} count={1} formats={["pdf"]} />
        <div className="mt-2">
          <button className="bg-black text-white px-4 py-2" type="submit">
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadQP;

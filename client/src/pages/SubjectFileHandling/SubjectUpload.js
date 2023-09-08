import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import api from "../../components/utils/api";
import {
  uploadFileToStorage,
  createFilePath,
  removeFileFromStorage,
} from "../../components/utils/fileHandling";
import FilesDragAndDrop from "./components/FilesDragAndDrop";
import Select from "../../components/common/MUI-themed/Select";
import Input from "../../components/common/MUI-themed/Input";

const SubjectUpload = () => {
  const { subjectId, category } = useParams();
  const navigate = useNavigate();

  const categories = [
    {
      label: "Syllabus (Mods and Admins only)",
      value: "syllabus",
    },
    {
      label: "Notes",
      value: "notes",
    },
    {
      label: "Other",
      value: "other",
    },
  ];
  const [uploadCategory, setUploadCategory] = useState("");
  useEffect(() => {
    if (category) setUploadCategory(category);
  }, [category]);

  const [filename, setFilename] = useState("");
  const [title, setTitle] = useState("");
  // for file upload task
  const [selectedFile, setSelectedFile] = useState(null);
  const onUpload = (files) => {
    console.log(files);
    setSelectedFile(files[0]);
    setTitle(files[0].name.split(".")[0]);
    setFilename(files[0].name.split(".")[0]);
  };
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const uploadFileRefData = async (dbFullPath, downloadUrl) => {
    try {
      const { data } = await api.post(`/api/subjects/upload_file_ref`, {
        name: title,
        dbFullPath,
        downloadUrl,
        size: selectedFile.size,
        type: dbFullPath.split(".")[dbFullPath.split(".").length - 1],
        uploader: jwt_decode(
          JSON.parse(localStorage.getItem("logged")).accessToken
        )?.username,
      });
      console.log(data);
      setTitle("");
      setFilename("");
      setSelectedFile(null);
      setMsg(data.msg);
    } catch (e) {
      console.log(e);
      setMsg(e.response.data.msg);
      // Delete file from storage
      removeFileFromStorage(dbFullPath);
    }
    setLoading(false);
  };

  const uploadFile = async () => {
    const userRole = jwt_decode(
      JSON.parse(localStorage.getItem("logged")).accessToken
    )?.role;
    if (uploadCategory === "syllabus" && userRole && userRole === "user") {
      alert("Sorry, this feature is only available for mods and admins");
      return;
    }
    setLoading(true);
    let dbFullPath = createFilePath(
      `${subjectId}/${uploadCategory}_${Date.now()}`,
      selectedFile.type
    );
    let { status, downloadUrl, msg, constraint } = await uploadFileToStorage(
      selectedFile,
      dbFullPath
    );
    if (!status) {
      setMsg(msg + " " + constraint.toString());
      setLoading(false);
      return;
    }
    uploadFileRefData(dbFullPath, downloadUrl);
  };

  return (
    <div className="p-8 bg-white">
      <div className="xs:px-4 sm:py-8 xs:px-4 sm:px-12">
        <h1 className="text-dark font-medium">Add Resources</h1>
        <div className="text-sm text-dark-2 mb-2">
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
        <p className="text-dark-2">
          Thank you for your interest in contributing to the community. You may
          choose to upload a file of the following formats: png, jpg, jpeg, pdf,
          docx
        </p>
        <form
          className="my-10"
          onSubmit={(e) => {
            e.preventDefault();
            uploadFile();
          }}
        >
          <Select
            label="Category"
            options={
              <>
                <option value="" disabled>
                  Select Category
                </option>
                {categories.map((category) => {
                  return (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  );
                })}
              </>
            }
            val={uploadCategory}
            setVal={setUploadCategory}
            required
            className="mb-4"
          />
          <Input
            label="Title / Short description"
            type="text"
            val={title}
            setVal={setTitle}
            required
            className="mb-4"
          />
          <FilesDragAndDrop
            onUpload={onUpload}
            count={1}
            formats={["png", "jpg", "jpeg", "pdf", "docx"]}
            filename={filename}
            setFilename={setFilename}
          />
          <div className="text-green-500 relative">
            <div className="absolute right-0">{msg}</div>
          </div>
          <div className="mt-4">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={!title || !selectedFile || loading}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectUpload;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import FilesDragAndDrop from "./components/FilesDragAndDrop";
import Select from "../../components/common/MUI-themed/Select";
import Input from "../../components/common/MUI-themed/Input";
import api from "../../components/utils/api";

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
  const uploadFile = async () => {
    const userRole = jwt_decode(
      JSON.parse(localStorage.getItem("logged")).accessToken
    )?.role;
    if (uploadCategory === "syllabus" && userRole && userRole !== "user") {
      alert("Sorry, this feature is only available for mods and admins");
      return;
    }

    let formData = new FormData();
    formData.append("subject_code", subjectId);
    formData.append("category", uploadCategory);
    formData.append("year", new Date().getFullYear());
    formData.append("filename", title);
    formData.append("file", selectedFile);
    try {
      const { data } = await api.post(`/api/subjects/upload_file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(data);
      setFilename("");
      setSelectedFile(null);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="p-8">
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
        <div className="card px-2 py-4">
          <div className="card-body">
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
            <div className="mt-4">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={!title || !selectedFile}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubjectUpload;

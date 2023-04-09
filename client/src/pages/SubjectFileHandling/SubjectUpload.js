import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FilesDragAndDrop from "./components/FilesDragAndDrop";
import Select from "../../components/common/MUI-themed/Select";
import Input from "../../components/common/MUI-themed/Input";
import api from "../../components/utils/api";

const SubjectUpload = () => {
  const { subjectId, category } = useParams();

  const categories = [
    {
      label: "Syllabus",
      value: "syllabus",
    },
    {
      label: "Notes",
      value: "notes",
    },
  ];
  const [uploadCategory, setUploadCategory] = useState("");
  useEffect(() => {
    if (category) setUploadCategory(category);
  }, [category]);

  const [filename, setFilename] = useState("");
  // for file upload task
  const [selectedFile, setSelectedFile] = useState(null);
  const onUpload = (files) => {
    console.log(files);
    setSelectedFile(files[0]);
    setFilename(files[0].name.split(".")[0]);
  };
  const uploadFile = async () => {
    let formData = new FormData();
    formData.append("subject_code", subjectId);
    formData.append("category", uploadCategory);
    formData.append("year", new Date().getFullYear());
    formData.append("filename", filename);
    formData.append("file", selectedFile);
    try {
      const { data } = await api.post(`/api/subjects/upload_file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="p-8">
      <h1 className="mb-2 text-dark font-medium">Add Resources</h1>
      <p className="text-dark-2">
        Thank you for your interest in contributing to the community. You may
        choose to upload a pdf or image file.
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
              val={filename}
              setVal={setFilename}
              required
              className="mb-4"
            />
            <FilesDragAndDrop
              onUpload={onUpload}
              count={1}
              formats={["png", "jpg", "jpeg", "pdf", "docx"]}
            />
            <div className="mt-4">
              <button className="btn btn-primary" type="submit">
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

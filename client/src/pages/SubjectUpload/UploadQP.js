import { useState } from "react";
import FilesDragAndDrop from "./components/FilesDragAndDrop";
import Select from "../../components/common/MUI-themed/Select";
import api from "../../components/utils/api";

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
      const { data } = api.post(`/api/subjects/upload_qp`, formData);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  const [examCategories, setExamCategories] = useState([
    {
      label: "First Hourly",
      value: "first_hourly",
    },
    {
      label: "Second Hourly",
      value: "second_hourly",
    },
    {
      label: "Makeup",
      value: "makeup",
    },
    {
      label: "Finals",
      value: "finals",
    },
  ]);
  const [examCategory, setExamCategory] = useState("");
  return (
    <div className="p-8">
      <h1 className="mb-2 text-dark font-medium">Add Question Paper</h1>
      <p className="text-dark-2">
        Thank you for your interest in contributing to the community. You may
        choose to upload a file, or directly input questions below.
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
              label="Exam Category"
              options={
                <>
                  <option value="" disabled>
                    Select Exam
                  </option>
                  {examCategories.map((category) => {
                    return (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    );
                  })}
                </>
              }
              val={examCategory}
              setVal={setExamCategory}
              required
              className="mb-4"
            />
            {
              // find a way to switch between FilesDragAndDrop and multiple TextAreas
              // maybe tabs
            }
            <FilesDragAndDrop onUpload={onUpload} count={1} formats={["pdf"]} />
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

export default UploadQP;

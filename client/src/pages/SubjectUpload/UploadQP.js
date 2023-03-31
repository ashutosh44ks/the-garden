import { useState } from "react";
import { useParams } from "react-router-dom";
import FilesDragAndDrop from "./components/FilesDragAndDrop";
import Select from "../../components/common/MUI-themed/Select";
import api from "../../components/utils/api";
import axios from "axios";
import TextArea from "../../components/common/MUI-themed/TextArea";

const UploadQP = () => {
  const { subjectId } = useParams();

  const examCategories = [
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
  ];
  const [examCategory, setExamCategory] = useState("");

  const [inputType, setInputType] = useState("text");

  // for file upload task
  const [selectedFile, setSelectedFile] = useState(null);
  const onUpload = (files) => {
    console.log(files);
    setSelectedFile(files[0]);
  };
  const uploadFile = async () => {
    let formData = new FormData();
    formData.append("subject_code", subjectId);
    formData.append("exam_category", examCategory);
    formData.append("files", selectedFile);
    try {
      const { data } = axios.post(
        `${process.env.REACT_APP_BASE_API_URL}/api/subjects/upload_qp`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  const [numOfGrpElements, setNumOfGrpElements] = useState([]);
  const [questions, setQuestions] = useState([]);
  const uploadQuestions = async () => {
    try {
      const { data } = api.post(`/subjects/${subjectId}/upload_qp`, {
        exam_category: examCategory,
        questions,
      });
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

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
          inputType === "text" ? uploadQuestions() : uploadFile();
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
            <div className="flex gap-2 flex-wrap mb-4">
              <span
                className={`simple-tab ${
                  inputType === "text" ? "tab-theme-blue" : "tab-theme-default"
                } cursor-pointer`}
                onClick={() => {
                  setInputType("text");
                }}
              >
                Text Input
              </span>
              <span
                className={`simple-tab ${
                  inputType === "file" ? "tab-theme-blue" : "tab-theme-default"
                } cursor-pointer`}
                onClick={() => {
                  setInputType("file");
                }}
              >
                File Input
              </span>
            </div>
            {inputType === "text" ? (
              <>
                <div className="flex flex-col gap-3 mt-8">
                  {numOfGrpElements.map((num, index) => (
                    <TextArea
                      label={`Question ${index + 1}`}
                      type="text"
                      val={questions[num] || ""}
                      setVal={(val) => {
                        let temp = [...questions];
                        if (questions[num] === undefined) temp.push(val);
                        else temp[num] = val;
                        setQuestions(temp);
                      }}
                      rows={2}
                      required
                      className="w-full mb-2"
                    />
                  ))}
                  <button
                    className="btn btn-secondary w-full"
                    type="button"
                    onClick={() => {
                      setNumOfGrpElements([
                        ...numOfGrpElements,
                        numOfGrpElements.length,
                      ]);
                    }}
                  >
                    Add Question
                  </button>
                </div>
              </>
            ) : (
              <FilesDragAndDrop
                onUpload={onUpload}
                count={1}
                formats={["pdf"]}
              />
            )}
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

import { useState } from "react";
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
import TextArea from "../../components/common/MUI-themed/TextArea";

const UploadQP = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();

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
  const [examYear, setExamYear] = useState(new Date().getFullYear());

  const [inputType, setInputType] = useState("text");

  // for file upload task
  const [selectedFile, setSelectedFile] = useState(null);
  const [filename, setFilename] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const onUpload = (files) => {
    console.log(files);
    setSelectedFile(files[0]);
    setFilename(files[0].name);
  };

  const uploadFileRefData = async (dbFullPath, downloadUrl) => {
    try {
      const { data } = await api.post(`/api/subjects/upload_file_ref`, {
        name: filename,
        dbFullPath,
        downloadUrl,
        size: selectedFile.size,
        type: dbFullPath.split(".")[dbFullPath.split(".").length - 1],
        uploader: jwt_decode(
          JSON.parse(localStorage.getItem("logged")).accessToken
        )?.username,
      });
      console.log(data);
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
    setLoading(true);
    let dbFullPath = createFilePath(
      `${subjectId}/qp_${examCategory}_${Date.now()}`,
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

  // const [numOfGrpElements, setNumOfGrpElements] = useState([]);
  // const [questions, setQuestions] = useState([]);
  const [content, setContent] = useState("");
  const uploadQuestions = async () => {
    setLoading(true);
    try {
      const { data } = await api.post(`/api/subjects/upload_qp_texts`, {
        subject_code: subjectId,
        category: examCategory,
        year: examYear,
        // questions,
        content,
      });
      console.log(data);
      setContent("");
      setMsg(data.msg);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 bg-white">
      <div className="xs:px-4 sm:py-8 xs:px-4 sm:px-12">
        <h1 className="text-dark font-medium">Add Question Paper</h1>
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
          choose to upload a file, or directly input questions below.
        </p>
        <form
          className="my-10"
          onSubmit={(e) => {
            e.preventDefault();
            inputType === "text" ? uploadQuestions() : uploadFile();
          }}
        >
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
          <Input
            label="Exam Year"
            type="number"
            val={examYear}
            setVal={setExamYear}
            className="mb-4"
            required
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
            // <>
            //   <div className="flex flex-col gap-3 mt-8">
            //     {numOfGrpElements.map((num, index) => (
            //       <TextArea
            //         label={`Question ${index + 1}`}
            //         type="text"
            //         val={questions[num] || ""}
            //         setVal={(val) => {
            //           let temp = [...questions];
            //           if (questions[num] === undefined) temp.push(val);
            //           else temp[num] = val;
            //           setQuestions(temp);
            //         }}
            //         rows={2}
            //         required
            //         className="w-full mb-2"
            //       />
            //     ))}
            //     <button
            //       className="btn btn-secondary w-full"
            //       type="button"
            //       onClick={() => {
            //         setNumOfGrpElements([
            //           ...numOfGrpElements,
            //           numOfGrpElements.length,
            //         ]);
            //       }}
            //     >
            //       Add Question
            //     </button>
            //   </div>
            // </>
            <TextArea
              label="Questions"
              rows="8"
              val={content}
              setVal={setContent}
              required
            />
          ) : (
            <FilesDragAndDrop
              onUpload={onUpload}
              count={1}
              formats={["pdf", "jpg", "jpeg", "png"]}
              filename={filename}
            />
          )}
          <div className="text-green-500 relative">
            <div className="absolute right-0">{msg}</div>
          </div>
          <div className="mt-4">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={
                loading ||
                (inputType === "text"
                  ? content.length === 0
                  : filename.length === 0)
              }
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadQP;

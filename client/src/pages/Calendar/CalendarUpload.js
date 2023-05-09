import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FilesDragAndDrop from "../SubjectFileHandling/components/FilesDragAndDrop";
import Select from "../../components/common/MUI-themed/Select";
import api from "../../components/utils/api";

const CalendarUpload = () => {
  const { calendarType } = useParams();
  const navigate = useNavigate();

  const categories = [
    {
      label: "Semester",
      value: "semester",
    },
    {
      label: "Holiday",
      value: "holiday",
    },
  ];
  const [uploadCategory, setUploadCategory] = useState("");
  useEffect(() => {
    setUploadCategory(calendarType);
  }, [calendarType]);

  const [filename, setFilename] = useState("");
  // for file upload task
  const [selectedFile, setSelectedFile] = useState(null);
  const onUpload = (files) => {
    console.log(files);
    setSelectedFile(files[0]);
    setFilename(files[0].name.split(".")[0]);
  };
  const [loading, setloading] = useState(false);
  const uploadFile = async () => {
    setloading(true);
    let formData = new FormData();
    formData.append("calendar_type", uploadCategory);
    formData.append("file", selectedFile);
    try {
      const { data } = await api.post(
        `/api/calendars/upload_calendar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(data);
      navigate(`/calendars/${calendarType}`);
    } catch (e) {
      console.log(e);
    }
    setloading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-dark font-medium">Add Calendar</h1>
      <p className="text-dark-2">
        Thank you for your interest in contributing to the community. You may
        choose to upload a file of the following formats: pdf
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
            <FilesDragAndDrop
              onUpload={onUpload}
              count={1}
              formats={["pdf"]}
              filename={filename}
              setFilename={setFilename}
            />
            <div className="mt-4">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
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

export default CalendarUpload;

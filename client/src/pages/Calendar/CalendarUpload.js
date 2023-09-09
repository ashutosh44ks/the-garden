import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../components/utils/api";
import { uploadFileToStorage, removeFileFromStorage } from "../../components/utils/fileHandling";
import FilesDragAndDrop from "../SubjectFileHandling/components/FilesDragAndDrop";
import Select from "../../components/common/MUI-themed/Select";

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
  const [loading, setLoading] = useState(false);
  const uploadFileRef = async (downloadUrl) => {
    setLoading(true);
    try {
      const { data } = await api.post(`/api/calendars/upload_calendar`, {
        type: uploadCategory,
        downloadUrl,
      });
      console.log(data);
      navigate(`/calendars/${calendarType}`);
    } catch (e) {
      console.log(e);
      removeFileFromStorage(`calendars/${uploadCategory}`);
    }
    setLoading(false);
  };

  const uploadFile = async () => {
    try {
      let { status, downloadUrl, msg, constraint } = await uploadFileToStorage(
        selectedFile,
        `calendars/${uploadCategory}`
      );
      if (!status) {
        // setMsg(msg + " " + constraint.toString());
        console.log(msg + " " + constraint.toString());
        setLoading(false);
        return;
      }
      uploadFileRef(downloadUrl);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-8 bg-white">
      <div className="xs:px-4 sm:py-8 xs:px-4 sm:px-12">
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
        </form>
      </div>
    </div>
  );
};

export default CalendarUpload;

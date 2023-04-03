import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./FilesDragAndDrop.css";

export default function FilesDragAndDrop({ onUpload, count, formats }) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const drop = useRef(null);
  const drag = useRef(null);
  const input = useRef(null);

  // add drag and drop event listeners
  useEffect(() => {
    drop.current.addEventListener("dragover", handleDragOver);
    drop.current.addEventListener("drop", handleDrop);
    // When files are dragged over the drag-and-drop area, we need to to show some feedback of it
    drop.current.addEventListener("dragenter", handleDragEnter);
    drop.current.addEventListener("dragleave", handleDragLeave);

    return () => {
      // giving errors sometimes so i've put it in try catch
      try {
        drop.current.removeEventListener("dragover", handleDragOver);
        drop.current.removeEventListener("drop", handleDrop);
        drop.current.removeEventListener("dragenter", handleDragEnter);
        drop.current.removeEventListener("dragleave", handleDragLeave);
      } catch (e) {
        console.log(e);
      }
    };
  }, []);
  const handleDragOver = (e) => {
    // prevent the default behavior (opening the dropped file)
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    // prevent the default behavior (opening the dropped file)
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    // this is required to convert FileList object to array
    const files = [...e.dataTransfer.files];
    handleUpload(files);
  };
  const handleUpload = (files) => {
    // Validate File Formats and Count
    // check if the provided count prop is less than uploaded count of files
    if (count && count < files.length) {
      alert(
        `Only ${count} file${count !== 1 ? "s" : ""} can be uploaded at a time`
      );
      return;
    }
    // check if some uploaded file is not in one of the allowed formats
    if (
      formats &&
      files.some(
        (file) =>
          !formats.some((format) =>
            file.name.toLowerCase().endsWith(format.toLowerCase())
          )
      )
    ) {
      alert(
        `Only following file formats are acceptable: ${formats.join(", ")}`
      );
      return;
    }
    // then if files are valid, call the onUpload prop function and setFileName
    if (files && files.length) {
      onUpload(files);
      setFileName(files[0].name);
    }
  };

  // setDragging true or false when dragenter or dragleave event is called
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target !== drag.current) {
      setDragging(true);
    }
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target === drag.current) {
      setDragging(false);
    }
  };

  return (
    <div
      ref={drop}
      className="FilesDragAndDrop mt-2"
      onClick={() => {
        input && input.current.click();
      }}
    >
      <input
        ref={input}
        className="hidden"
        type="file"
        accept={
          formats ? formats.map((format) => `.${format}`).join(", ") : undefined
        }
        multiple={!count || count > 1}
        onChange={(e) => {
          const files = [...e.target.files];
          handleUpload(files);
        }}
      />
      {fileName && (
        <div className="FilesDragAndDrop__area">
          {fileName} (Uploaded Successfully!)
        </div>
      )}
      {!fileName && (
        <>
          {dragging ? (
            <div className="FilesDragAndDrop__area" ref={drag}>
              Drop that file here
            </div>
          ) : (
            <div className="FilesDragAndDrop__area">Drag & drop or browse</div>
          )}
        </>
      )}
    </div>
  );
}

FilesDragAndDrop.propTypes = {
  onUpload: PropTypes.func.isRequired,
};

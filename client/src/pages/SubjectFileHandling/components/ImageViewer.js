const ImageViewer = ({ file }) => {
  return (
    <div className="syllabus-container">
      <img
        src={`
          data:image/png;base64,${file}
        `}
        alt="file"
      />
    </div>
  );
};

export default ImageViewer;

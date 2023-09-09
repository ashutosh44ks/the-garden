const ImageViewer = ({ file }) => {
  return (
    <div className="syllabus-container">
      <img src={file} alt="file" />
    </div>
  );
};

export default ImageViewer;

import toLabel from "../../../components/utils/toLabel";

const ImageViewer = ({ category, file }) => {
  
  if (file === null) return <div>No {toLabel(category)} File Found</div>;
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

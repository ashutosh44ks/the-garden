import "./MUI-themed.css";

const TextArea = ({ label, rows, val, setVal, required, className }) => {
  return (
    <div class={"input-group " + className}>
      <textarea
        rows={rows}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="."
        required={required}
      />
      <label>{label}</label>
    </div>
  );
};

TextArea.defaultProps = {
  rows: 4,
  required: false,
  className: "",
};

export default TextArea;

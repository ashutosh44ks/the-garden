import React from "react";

const Checkbox = ({ val, setVal, text }) => {
  return (
    <>
      <input
        type="checkbox"
        id={val}
        name={val}
        value={val}
        onChange={(e) => setVal(e.target.checked)}
        className="material-checkbox"
      />
      <label htmlFor={val}>{text}</label>
    </>
  );
};

export default Checkbox;

import { useState, useEffect } from "react";
import axios from "axios";

const ViewQp = () => {
  const [file, setFile] = useState(null);
  const downloadFile = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/api/view");
      setFile(data.file);
      console.log(data.file);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    downloadFile();
  }, []);
  return (
    <div>
      <button onClick={downloadFile}>yo</button>
    </div>
  );
};

export default ViewQp;

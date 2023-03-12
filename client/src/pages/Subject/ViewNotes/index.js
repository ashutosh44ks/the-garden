import { useState, useEffect } from "react";
import { pdfjs, Document, Page } from "react-pdf";
import { useParams } from "react-router-dom";
import api from "../../../components/utils/api";

const ViewNotes = () => {
  // setup for react-pdf package
  const [file, setFile] = useState(null);
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [numPages, setNumPages] = useState(null);
  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }
  function _arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
  const [isLoading, setIsLoading] = useState(true);
  const { subjectId } = useParams();
  const getFile = async () => {
    try {
      const { data } = await api.get(
        `/api/subjects/view_notes/${subjectId}`,
        {
          responseType: "arraybuffer",
        }
      );
      console.log(data);
      setFile(_arrayBufferToBase64(data));
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getFile();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (file === null) return <div>No Notes</div>;
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-dark">Notes</h1>
        <a
          className="btn-primary"
          href={`data:application/pdf;base64,${file}`}
          download="notes.pdf"
        >
          Download
        </a>
      </div>
      <div className="pdf-container">
        <Document
          file={`data:application/pdf;base64,${file}`}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="py-2 px-2"
            />
          ))}
        </Document>
      </div>
    </div>
  );
};

export default ViewNotes;

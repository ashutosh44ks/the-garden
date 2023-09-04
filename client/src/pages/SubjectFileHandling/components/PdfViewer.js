import { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";

const PdfViewer = ({ file }) => {
  // setup for react-pdf package
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  const [numPages, setNumPages] = useState(null);
  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }
  return (
    <div className="pdf-container">
      <Document
        file={file}
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
  );
};

export default PdfViewer;

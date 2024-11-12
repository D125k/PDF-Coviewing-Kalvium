// client/src/components/presenter/PDFViewerPresenter.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { io } from 'socket.io-client';

// Set the worker source path
pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs';

const PDFViewerPresenter = ({ sessionCode }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const socketRef = useRef(null);

  // Initialize socket connection once when sessionCode is available
  useEffect(() => {
    if (sessionCode) {
      const socket = io('http://localhost:3001');
      socketRef.current = socket;

      socket.emit('join_session', { sessionCode, isPresenter: true });

      // Handle request_pdf from viewers and send the current PDF data if available
      socket.on('request_pdf', () => {
        if (pdfDataUrl) {
          socket.emit('pdf_data', { sessionCode, pdfData: pdfDataUrl });
        }
      });

      // Listen for any errors from the server
      socket.on('error', (message) => {
        alert(message);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [sessionCode]);

  // Emit pdf_data whenever pdfDataUrl changes
  useEffect(() => {
    if (socketRef.current && pdfDataUrl) {
      socketRef.current.emit('pdf_data', { sessionCode, pdfData: pdfDataUrl });
    }
  }, [pdfDataUrl, sessionCode]);

  useEffect(() => {
    if (socketRef.current && pdfDataUrl) {
      socketRef.current.emit('change_page', { sessionCode, page: pageNumber });
    }
  }, [pageNumber, sessionCode, pdfDataUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPageNumber(1);

      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result;
        setPdfDataUrl(base64Data);

        // Emit pdf_data is handled by the separate useEffect
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid PDF file');
    }
  };

  const goToPreviousPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageNumber((prev) => (prev < numPages ? prev + 1 : prev));

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">Presenting Session Code: {sessionCode}</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="mb-4"
      />

      <div className="pdf-viewer mt-4" style={{ width: '100%', height: '500px', overflow: 'auto' }}>
        {pdfDataUrl ? (
          <Document
            file={pdfDataUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page pageNumber={pageNumber} width={600} />
          </Document>
        ) : (
          <p>Waiting for PDF to load...</p>
        )}
      </div>

      {pdfDataUrl && (
        <div className="flex items-center justify-between w-full max-w-xs mt-4">
          <button
            onClick={goToPreviousPage}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="mx-2">Page {pageNumber} of {numPages}</span>
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="px-4 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PDFViewerPresenter;

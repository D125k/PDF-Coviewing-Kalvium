import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs';

const PDFViewerViewer = ({ socket, initialPage }) => {
	const [pdfData, setPdfData] = useState(null);
	const [pageNumber, setPageNumber] = useState(initialPage);
	const [numPages, setNumPages] = useState(null);

	useEffect(() => {
		socket.on('pdf_data', ({ pdfData }) => {
			console.log('Received PDF data from presenter:', pdfData);
			setPdfData(pdfData);
		});

		socket.on('page_update', (page) => {
			setPageNumber(page);
		});

		return () => {
			socket.off('pdf_data');
			socket.off('page_update');
		};
	}, [socket]);

	return (
		<div className="flex flex-col items-center">
			{pdfData ? (
				<div style={{ width: '100%', height: '500px', overflow: 'auto' }}>
					<Document
						file={pdfData}
						onLoadSuccess={({ numPages }) => setNumPages(numPages)}
					>
						<Page pageNumber={pageNumber} width={600} />
					</Document>
				</div>
			) : (
				<p>Waiting for PDF to load...</p>
			)}
			<p className="mt-4">Page {pageNumber} of {numPages}</p>
		</div>
	);
};

export default PDFViewerViewer;

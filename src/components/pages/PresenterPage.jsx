import React, { useState } from 'react';
import PDFViewerPresenter from '../presenter/PDFViewerPresenter';

const PresenterPage = () => {
	const [sessionCode, setSessionCode] = useState(null);

	const generateSession = async () => {
		try {
			const response = await fetch('generate-session', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
			});
			const data = await response.json();
			setSessionCode(data.sessionCode);
		} catch (error) {
			console.error('Error generating session:', error);
			alert('Failed to generate session code. Please check the server connection.');
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<h2 className="text-2xl font-bold mb-4">Presenter Mode</h2>

			{!sessionCode ? (
				<div className="flex flex-col items-center">
					<p className="text-lg font-semibold mb-2">Generate Session Code</p>
					<button
						onClick={generateSession}
						className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
					>
						Generate Session
					</button>
				</div>
			) : (
				<div className="mt-4 p-2 border rounded bg-gray-100">
					<p className="text-center font-semibold">Session Code:</p>
					<p className="text-center text-lg font-bold">{sessionCode}</p>
				</div>
			)}

			{sessionCode && <PDFViewerPresenter sessionCode={sessionCode} />}
		</div>
	);
};

export default PresenterPage;

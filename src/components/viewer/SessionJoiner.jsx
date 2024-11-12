import React, { useState } from 'react';
import { io } from 'socket.io-client';

const SessionJoiner = ({ onJoin }) => {
	const [sessionCode, setSessionCode] = useState('');
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleJoinSession = () => {
		setLoading(true);
		setError(null);

		const socket = io('https://pdf-coviewing-kalvium.onrender.com');

		socket.emit('join_session', { sessionCode, isPresenter: false });

		socket.on('error', (message) => {
			setError(message);
			socket.disconnect();
			setLoading(false);
		});

		socket.emit('request_pdf');

		socket.on('page_update', (page) => {
			onJoin(socket, page);
			setLoading(false);
		});

		socket.on('pdf_data', ({ pdfData }) => {
			console.log('Received PDF data after joining:', pdfData);
		});
	};

	return (
		<div className="flex flex-col items-center justify-center p-4">
			<h2 className="text-xl font-bold mb-4">Join a Session</h2>
			<input
				type="text"
				placeholder="Enter session code"
				value={sessionCode}
				onChange={(e) => setSessionCode(e.target.value)}
				className="mb-2 p-2 border rounded w-full"
			/>
			<button
				onClick={handleJoinSession}
				disabled={loading || !sessionCode}
				className="px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 disabled:bg-gray-400"
			>
				{loading ? 'Joining...' : 'Join Session'}
			</button>

			{error && (
				<div className="mt-4 text-red-600 font-semibold">
					{error}
				</div>
			)}
		</div>
	);
};

export default SessionJoiner;

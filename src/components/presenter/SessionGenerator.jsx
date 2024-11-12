// client/src/components/presenter/SessionGenerator.jsx
import axios from 'axios';
import React, { useState } from 'react';

const SessionGenerator = () => {
  const [sessionCode, setSessionCode] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to generate a session code
  const generateSession = async () => {
    setLoading(true);
    try {
      // Make sure this URL matches your backend URL exactly
      const response = await axios.post('/generate-session'); // Assuming Vite proxy setup
      console.log('Generated session code:', response.data.sessionCode); // Log session code response
      setSessionCode(response.data.sessionCode);
    } catch (error) {
      // Improved error logging
      console.error('Error generating session:', error.response || error.message || error);
      alert("Failed to generate session code. Please check the server connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-xl font-bold mb-4">Generate Session Code</h2>
      <button
        onClick={generateSession}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Generating...' : 'Generate Session'}
      </button>

      {sessionCode && (
        <div className="mt-4 p-2 border rounded bg-gray-100">
          <p className="text-center font-semibold">Session Code:</p>
          <p className="text-center text-lg font-bold">{sessionCode}</p>
        </div>
      )}
    </div>
  );
};

export default SessionGenerator;

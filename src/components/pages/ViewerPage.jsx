// client/src/pages/ViewerPage.jsx
import React, { useState } from 'react';
import PDFViewerViewer from '../viewer/PDFViewerViewer';
import SessionJoiner from '../viewer/SessionJoiner';

const ViewerPage = () => {
  const [socket, setSocket] = useState(null);
  const [page, setPage] = useState(1);

  // Function called when successfully joined
  const handleJoin = (socketInstance, initialPage) => {
    setSocket(socketInstance);
    setPage(initialPage);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Viewer Mode</h2>
      {!socket ? (
        <SessionJoiner onJoin={handleJoin} />
      ) : (
        <PDFViewerViewer socket={socket} initialPage={page} />
      )}
    </div>
  );
};

export default ViewerPage;

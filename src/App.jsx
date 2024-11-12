// client/src/App.jsx
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import PresenterPage from './components/pages/PresenterPage';
import ViewerPage from './components/pages/ViewerPage';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">PDF Co-Viewer</h1>
        {/* Landing Page with Presenter and Viewer Buttons */}
        <Routes>
          <Route
            path="/"
            element={
              <div className="flex flex-col items-center space-y-4">
                <a href="/presenter" target="_blank" rel="noopener noreferrer">
                  <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700">
                    Presenter
                  </button>
                </a>
                <a href="/viewer" target="_blank" rel="noopener noreferrer">
                  <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700">
                    Viewer
                  </button>
                </a>
              </div>
            }
          />
          {/* Presenter and Viewer Routes */}
          <Route path="/presenter" element={<PresenterPage />} />
          <Route path="/viewer" element={<ViewerPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

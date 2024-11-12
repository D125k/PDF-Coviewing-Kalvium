// server/index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

// Initialize the app and server
const app = express();
const server = http.createServer(app);
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST']
};

const io = new Server(server, {
  cors: corsOptions
});

// Store PDF sessions { sessionCode: { page: Number, presenterId: String, pdfData: String|null } }
const sessions = {};

// Middleware to parse JSON
app.use(express.json());

// Endpoint to generate a new session code
app.post('/generate-session', (req, res) => {
  const sessionCode = uuidv4();
  sessions[sessionCode] = { page: 1, presenterId: null, pdfData: null };
  console.log(`Generated session code: ${sessionCode}`);
  res.json({ sessionCode });
});

// WebSocket connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a session
  socket.on('join_session', ({ sessionCode, isPresenter }) => {
    const session = sessions[sessionCode];
    if (!session) {
      socket.emit('error', 'Session not found');
      return;
    }

    if (isPresenter) {
      session.presenterId = socket.id; // Assign presenter ID
    }

    socket.join(sessionCode); // Join the room for the session

    // If the session already has PDF data, send it to the newly joined socket
    if (session.pdfData) {
      socket.emit('pdf_data', { pdfData: session.pdfData });
    }

    // Notify the user of the current page
    socket.emit('page_update', session.page);
    console.log(`Socket ${socket.id} joined session ${sessionCode} as ${isPresenter ? 'Presenter' : 'Viewer'}`);
  });

  // Handle PDF data from presenter
  socket.on('pdf_data', ({ sessionCode, pdfData }) => {
    const session = sessions[sessionCode];
    if (session && session.presenterId === socket.id) {
      session.pdfData = pdfData; // Store the PDF data in the session
      // Broadcast the PDF data to all other clients in the session
      socket.to(sessionCode).emit('pdf_data', { pdfData });
      console.log(`PDF data updated for session ${sessionCode}`);
    } else {
      console.warn(`Unauthorized PDF data attempt by socket ${socket.id}`);
    }
  });

  // Presenter changes the page
  socket.on('change_page', ({ sessionCode, page }) => {
    const session = sessions[sessionCode];
    if (session && session.presenterId === socket.id) {
      session.page = page;
      io.to(sessionCode).emit('page_update', page); // Broadcast new page to all clients
      console.log(`Page updated to ${page} for session ${sessionCode}`);
    }
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Optional: Handle session cleanup if the presenter disconnects
    for (const [sessionCode, session] of Object.entries(sessions)) {
      if (session.presenterId === socket.id) {
        delete sessions[sessionCode];
        io.to(sessionCode).emit('error', 'Presenter has disconnected. Session ended.');
        console.log(`Session ${sessionCode} ended because presenter disconnected.`);
      }
    }
  });
});

// Server listener
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

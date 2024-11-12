
# Kalvium SWE Internship+PPO Task - PDF Co-Viewer

**Position:** Software Engineer (Internship + PPO)  
**Organization:** Kalvium, India's leader in computer science higher education  \

## Project Description

This repository contains the solution for the **PDF Co-Viewer** task as part of the Kalvium Software Engineering Internship application. The application enables a presenter to share and synchronize PDF slides with multiple viewers. When the presenter navigates between pages, all connected viewers automatically follow along, creating an engaging and interactive learning environment. This use case is designed for remote classrooms or collaborative presentations.

### Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, Socket.IO for real-time synchronization
- **Deployment:** 
  - Backend on [Render](https://render.com)
  - Frontend on [Vercel](https://vercel.com)

### Features
- **Real-time Page Sync:** The presenter controls the slide page, and all viewers' screens synchronize automatically.
- **PDF Uploading and Viewing:** The presenter can upload a PDF file, which is then displayed and synchronized across viewers.
- **Role-Based Control:** Distinction between Presenter (admin) and Viewers to manage session control effectively.

### Hosted Demo Links
- **Frontend**: [https://pdf-coviewing-kalvium.vercel.app/](https://pdf-coviewing-kalvium.vercel.app/)
- **Backend**: [https://pdf-coviewing-kalvium.onrender.com](https://pdf-coviewing-kalvium.onrender.com)

### How to Run Locally

1. **Clone the Repository**:
   ```bash
   git clone <repository-link>
   cd repository-name
   ```

2. **Backend Setup**:
   ```bash
   cd server
   npm install
   npm start
   ```

3. **Frontend Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Access Locally**:
   - **Frontend**: `http://localhost:5173`
   - **Backend**: `http://localhost:10000`

### Usage Instructions
1. Open the **Frontend** link.
2. Choose "Presenter" to start a new session and upload a PDF.
3. Share the session code with viewers.
4. Open "Viewer" mode with the session code to join and follow along.

Thank you for the opportunity to contribute to Kalvium!

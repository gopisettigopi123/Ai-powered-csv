# AI-Powered CSV Data Import (CRM)

This is a full-stack application that magically imports unstructured CSV data and normalizes it into a standardized CRM format using Google's Gemini AI.

## Bonus Features Implemented
- ✅ **Drag & Drop Upload**: Modern UI for dragging CSV files.
- ✅ **Progress Indicators**: Real-time progress bar during upload.
- ✅ **Incremental Parsing**: Client-side parsing and chunked streaming to backend.
- ✅ **Retry Mechanism**: Backend retries AI requests 3 times before failing.
- ✅ **Virtualized Table**: `@tanstack/react-virtual` used to render thousands of rows smoothly.
- ✅ **Dark Mode**: Integrated using `next-themes` and Tailwind CSS.
- ✅ **Unit Tests**: Setup using Jest (Backend) and Vitest (Frontend).
- ✅ **Docker Setup**: Full `docker-compose` environment included.
- ✅ **Deployment Config**: `render.yaml` provided for easy deployment.

---

## 🛠️ Tech Stack
**Frontend:** Next.js 15, React 19, Tailwind CSS v4, PapaParse, React Dropzone, Tanstack Table/Virtual, Vitest.
**Backend:** Node.js, Express, TypeScript, Mongoose, Google GenAI SDK, Jest.

---

## 🚀 Local Setup

### Option 1: Docker (Recommended)
1. Ensure Docker Desktop is running.
2. In the root directory, create a `.env` file for the backend (or pass it directly):
   ```bash
   export GEMINI_API_KEY=AIzaSy...
   ```
3. Run the complete stack (MongoDB, Backend, Frontend):
   ```bash
   docker-compose up --build
   ```
4. Access the frontend at `http://localhost:3000`.

### Option 2: Manual Setup
#### 1. Start MongoDB
Make sure you have MongoDB running locally on `mongodb://localhost:27017` or use MongoDB Atlas.

#### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file and add: GEMINI_API_KEY=AIzaSy...
npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Running Tests
**Backend:**
```bash
cd backend
npm test
```

**Frontend:**
```bash
cd frontend
npm test
```

---

## 🌍 Deployment

### Deploying Frontend (Vercel)
1. Push this code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import your repository. The Root Directory is `frontend`.
4. Click Deploy.

### Deploying Backend (Render)
1. Push this code to GitHub.
2. Go to [Render](https://render.com/) and create a new **Blueprint Instance**.
3. Connect your repository. Render will automatically read the `render.yaml` file in the root.
4. Go to your new Web Service settings and add the Environment Variables:
   - `MONGO_URI` (Use MongoDB Atlas)
   - `GEMINI_API_KEY` (Your Gemini Key)

---

## ⚠️ Important Notes
- **API Key Format**: The Gemini API Key MUST start with `AIzaSy...`. OAuth tokens (`AQ...`) will fail.

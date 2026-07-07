# GrowEasy CSV Importer

An AI-powered CSV Importer that automatically maps arbitrary CSV columns to GrowEasy's specific CRM format using Google Gemini.

## Features
- **Modern UI**: Premium design with glassmorphism, responsive data tables, and micro-animations.
- **Drag & Drop**: Seamless upload experience.
- **Client-Side Preview**: Instantly preview CSV rows before processing.
- **AI Mapping**: Uses Gemini API to intelligently extract CRM fields regardless of the original CSV structure.
- **Batch Processing**: Backend splits rows into manageable batches to prevent LLM context limit issues.

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS v4, Lucide React, PapaParse.
- **Backend**: Node.js, Express, Multer, CSV-Parse, Google GenAI SDK.

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the \`backend\` folder.
2. Install dependencies:
   \`\`\`bash
   cd backend
   npm install
   \`\`\`
3. Open the \`backend/.env\` file and replace \`your_gemini_api_key_here\` with your actual Google Gemini API key.
4. Start the backend server:
   \`\`\`bash
   npm run dev
   \`\`\`
   The server will start on http://localhost:5000.

### 2. Frontend Setup
1. Open a new terminal and navigate to the \`frontend\` folder.
2. Install dependencies:
   \`\`\`bash
   cd frontend
   npm install
   \`\`\`
3. Start the Next.js development server:
   \`\`\`bash
   npm run dev
   \`\`\`
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Using the App
1. Drag and drop any CSV file onto the upload zone.
2. Review the preview data to ensure it parsed correctly on the client side.
3. Click "Confirm & Import".
4. The backend will batch the records, send them to Gemini for processing, and return the structured mapped data.
5. Review the final success and skipped counts along with the mapped CRM data table.

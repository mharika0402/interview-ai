# InterviewAI 🤖

AI-Powered Interview Preparation Platform — Practice interviews, coding rounds, and HR rounds with real-time AI feedback.

## Features

- 🎯 **AI Interview Questions** — Groq AI generates personalized questions based on your role
- 💻 **Coding Round** — AI-generated coding problems with code editor
- 🤝 **HR Round** — Behavioral questions with AI-powered feedback
- 📊 **Analytics** — Track your progress and identify weak areas
- 🔐 **Authentication** — Secure JWT-based login/signup

## Tech Stack

- **Frontend:** React + Vite, React Router, Axios, React Icons
- **Backend:** Node.js, Express.js
- **AI:** Groq API (Llama models — free!)
- **Database:** MongoDB Atlas (optional — works with in-memory storage)

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/interview-ai.git
cd interview-ai
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

## Environment Variables

Create a `backend/.env` file:
```
PORT=5000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
GROQ_API_KEY=your-groq-api-key
```

Get a free Groq API key at: https://console.groq.com

## Project Structure
```
interview-ai/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── pages/     # 8 pages (Home, Login, Signup, Dashboard, Interview, Coding, HR, Analytics)
│   │   ├── components/# Reusable components
│   │   ├── context/    # Auth context
│   │   └── services/   # API service
│   └── ...
├── backend/           # Express backend
│   ├── config/        # DB config
│   ├── controllers/   # API controllers
│   ├── middleware/    # Auth middleware
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── services/      # AI service (Groq)
│   └── server.js      # Entry point
└── README.md
```

## License

MIT

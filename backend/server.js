const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes (we'll create these step by step)
app.get('/', (req, res) => {
  res.json({ message: 'InterviewAI API is running! 🚀' });
});

// API Routes (will add these later)
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/resume', require('./routes/resume'));
app.use('/api/interview', require('./routes/interview'));
app.use('/api/coding', require('./routes/coding'));
app.use('/api/hr', require('./routes/hr'));
app.use('/api/analytics', require('./routes/analytics'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});

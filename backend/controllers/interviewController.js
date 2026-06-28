const { generateQuestions, evaluateAnswer } = require('../services/aiService');

// Generate questions based on resume and role
const getQuestions = async (req, res) => {
  try {
    const { resumeText, role } = req.body;

    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    const questions = await generateQuestions(resumeText || '', role);
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Evaluate an answer
const submitAnswer = async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    const evaluation = await evaluateAnswer(question, answer);
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get interview results
const getResults = async (req, res) => {
  try {
    const { scores } = req.body;

    if (!scores || scores.length === 0) {
      return res.status(400).json({ message: 'No scores provided' });
    }

    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const overallScore = Math.round(avgScore * 10) / 10;

    res.json({
      overallScore,
      totalQuestions: scores.length,
      breakdown: scores.map((score, i) => ({
        question: i + 1,
        score,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getQuestions, submitAnswer, getResults };

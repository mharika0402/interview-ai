const { generateHRQuestions, evaluateAnswer } = require('../services/aiService');

// Get HR questions (AI-generated or mock)
const getHRQuestions = async (req, res) => {
  try {
    const { role } = req.query;
    const questions = await generateHRQuestions(role || 'Software Engineer');
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Evaluate HR answer
const evaluateHRAnswer = async (req, res) => {
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

module.exports = { getHRQuestions, evaluateHRAnswer };

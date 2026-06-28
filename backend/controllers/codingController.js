const { generateCodingProblem } = require('../services/aiService');

// Get a coding problem (AI-generated or mock)
const getProblem = async (req, res) => {
  try {
    const { role, difficulty } = req.query;
    const problem = await generateCodingProblem(role || 'Software Engineer', difficulty || 'Easy');
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit code for evaluation
const submitCode = async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code) {
      return res.status(400).json({ message: 'Code is required' });
    }

    // Mock test results (code execution would need a sandbox service)
    res.json({
      passed: 2,
      total: 3,
      tests: [
        { name: 'Test 1', passed: true, input: '[2,7,11,15], 9', expected: '[0,1]', actual: '[0,1]' },
        { name: 'Test 2', passed: true, input: '[3,2,4], 6', expected: '[1,2]', actual: '[1,2]' },
        { name: 'Test 3', passed: false, input: '[3,3], 6', expected: '[0,1]', actual: '[-1,-1]' },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProblem, submitCode };

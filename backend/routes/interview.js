const express = require('express');
const { getQuestions, submitAnswer, getResults } = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/questions', protect, getQuestions);
router.post('/evaluate', protect, submitAnswer);
router.post('/results', protect, getResults);

module.exports = router;

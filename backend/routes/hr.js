const express = require('express');
const { getHRQuestions, evaluateHRAnswer } = require('../controllers/hrController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/questions', protect, getHRQuestions);
router.post('/evaluate', protect, evaluateHRAnswer);

module.exports = router;

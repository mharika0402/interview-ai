const express = require('express');
const { getProblem, submitCode } = require('../controllers/codingController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/problem', protect, getProblem);
router.post('/submit', protect, submitCode);

module.exports = router;

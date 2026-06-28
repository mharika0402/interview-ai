// Get user analytics
const getAnalytics = async (req, res) => {
  try {
    // Mock analytics (will come from database later)
    res.json({
      totalSessions: 25,
      avgScore: 7.8,
      bestScore: 8.5,
      weakAreas: 4,
      scoreHistory: [
        { date: 'Week 1', score: 5.5 },
        { date: 'Week 2', score: 6.0 },
        { date: 'Week 3', score: 6.8 },
        { date: 'Week 4', score: 7.2 },
        { date: 'Week 5', score: 7.0 },
        { date: 'Week 6', score: 7.8 },
        { date: 'Week 7', score: 8.1 },
        { date: 'Week 8', score: 8.5 },
      ],
      weakAreasList: [
        { topic: 'System Design', score: 45 },
        { topic: 'Behavioral Questions', score: 55 },
        { topic: 'SQL & Databases', score: 58 },
        { topic: 'Cloud Architecture', score: 62 },
      ],
      strongAreasList: [
        { topic: 'JavaScript/React', score: 90 },
        { topic: 'Data Structures', score: 85 },
        { topic: 'Problem Solving', score: 82 },
        { topic: 'Communication', score: 80 },
      ],
      recentSessions: [
        { type: 'Interview', role: 'SDE-1', score: 7.5, date: 'Jun 24, 2026' },
        { type: 'Coding', role: 'SDE-1', score: 8.0, date: 'Jun 23, 2026' },
        { type: 'HR Round', role: 'SDE-1', score: 7.0, date: 'Jun 22, 2026' },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };

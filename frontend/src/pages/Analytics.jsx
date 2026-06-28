import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { FiTrendingUp, FiTarget, FiAlertTriangle, FiAward } from 'react-icons/fi';
import './Analytics.css';

const Analytics = () => {
  // Mock data (will come from backend later)
  const weakAreas = [
    { topic: 'System Design', score: 45, color: '#e17055' },
    { topic: 'Behavioral Questions', score: 55, color: '#fdcb6e' },
    { topic: 'SQL & Databases', score: 58, color: '#fdcb6e' },
    { topic: 'Cloud Architecture', score: 62, color: '#fdcb6e' },
  ];

  const strongAreas = [
    { topic: 'JavaScript/React', score: 90, color: '#00b894' },
    { topic: 'Data Structures', score: 85, color: '#00b894' },
    { topic: 'Problem Solving', score: 82, color: '#00b894' },
    { topic: 'Communication', score: 80, color: '#00b894' },
  ];

  const scoreHistory = [
    { date: 'Week 1', score: 5.5 },
    { date: 'Week 2', score: 6.0 },
    { date: 'Week 3', score: 6.8 },
    { date: 'Week 4', score: 7.2 },
    { date: 'Week 5', score: 7.0 },
    { date: 'Week 6', score: 7.8 },
    { date: 'Week 7', score: 8.1 },
    { date: 'Week 8', score: 8.5 },
  ];

  const recentSessions = [
    { type: 'Interview', role: 'SDE-1', score: 7.5, date: 'Jun 24, 2026' },
    { type: 'Coding', role: 'SDE-1', score: 8.0, date: 'Jun 23, 2026' },
    { type: 'HR Round', role: 'SDE-1', score: 7.0, date: 'Jun 22, 2026' },
    { type: 'Interview', role: 'ML Engineer', score: 6.5, date: 'Jun 21, 2026' },
    { type: 'Coding', role: 'SDE-1', score: 9.0, date: 'Jun 20, 2026' },
  ];

  const maxScore = Math.max(...scoreHistory.map((s) => s.score));

  return (
    <div className="analytics-page">
      <Navbar />
      <div className="analytics-container">
        <div className="analytics-header">
          <h1>📊 Your Analytics</h1>
          <p>Track your progress and identify areas for improvement</p>
        </div>

        {/* Overview Cards */}
        <div className="overview-cards">
          <div className="overview-card">
            <FiTarget className="overview-icon" style={{ color: '#6c5ce7' }} />
            <div>
              <span className="overview-value">25</span>
              <span className="overview-label">Total Sessions</span>
            </div>
          </div>
          <div className="overview-card">
            <FiTrendingUp className="overview-icon" style={{ color: '#00b894' }} />
            <div>
              <span className="overview-value">7.8</span>
              <span className="overview-label">Avg Score</span>
            </div>
          </div>
          <div className="overview-card">
            <FiAlertTriangle className="overview-icon" style={{ color: '#fdcb6e' }} />
            <div>
              <span className="overview-value">4</span>
              <span className="overview-label">Weak Areas</span>
            </div>
          </div>
          <div className="overview-card">
            <FiAward className="overview-icon" style={{ color: '#fd79a8' }} />
            <div>
              <span className="overview-value">8.5</span>
              <span className="overview-label">Best Score</span>
            </div>
          </div>
        </div>

        {/* Progress Chart */}
        <div className="chart-section">
          <h2>Score Progress</h2>
          <div className="bar-chart">
            {scoreHistory.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-wrapper">
                  <div
                    className="bar"
                    style={{ height: `${(item.score / 10) * 100}%` }}
                  ></div>
                  <span className="bar-score">{item.score}</span>
                </div>
                <span className="bar-label">{item.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weak & Strong Areas */}
        <div className="areas-grid">
          <div className="areas-card weak">
            <h3>⚠️ Weak Areas</h3>
            <p className="areas-subtitle">Focus on improving these topics</p>
            {weakAreas.map((area, index) => (
              <div key={index} className="area-item">
                <div className="area-info">
                  <span className="area-name">{area.topic}</span>
                  <span className="area-score" style={{ color: area.color }}>{area.score}%</span>
                </div>
                <div className="area-bar">
                  <div
                    className="area-fill"
                    style={{ width: `${area.score}%`, background: area.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="areas-card strong">
            <h3>💪 Strong Areas</h3>
            <p className="areas-subtitle">You're doing great here!</p>
            {strongAreas.map((area, index) => (
              <div key={index} className="area-item">
                <div className="area-info">
                  <span className="area-name">{area.topic}</span>
                  <span className="area-score" style={{ color: area.color }}>{area.score}%</span>
                </div>
                <div className="area-bar">
                  <div
                    className="area-fill"
                    style={{ width: `${area.score}%`, background: area.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="sessions-section">
          <h2>Recent Sessions</h2>
          <div className="sessions-table">
            <div className="table-header">
              <span>Type</span>
              <span>Role</span>
              <span>Score</span>
              <span>Date</span>
            </div>
            {recentSessions.map((session, index) => (
              <div key={index} className="table-row">
                <span className={`session-type ${session.type.toLowerCase()}`}>
                  {session.type}
                </span>
                <span>{session.role}</span>
                <span className="session-score">{session.score}/10</span>
                <span className="session-date">{session.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Analytics;

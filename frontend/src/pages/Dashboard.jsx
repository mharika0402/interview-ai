import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { FiTarget, FiCode, FiUsers, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { icon: <FiTarget />, label: 'Interviews Completed', value: '12', color: '#6c5ce7' },
    { icon: <FiCode />, label: 'Coding Problems Solved', value: '28', color: '#00cec9' },
    { icon: <FiUsers />, label: 'HR Rounds Practiced', value: '8', color: '#fd79a8' },
    { icon: <FiTrendingUp />, label: 'Avg Score', value: '7.8/10', color: '#00b894' },
  ];

  const quickActions = [
    { title: 'Start Interview', desc: 'AI-generated questions based on your resume', link: '/interview', icon: '🎯' },
    { title: 'Coding Round', desc: 'Practice coding problems', link: '/coding-round', icon: '💻' },
    { title: 'HR Round', desc: 'Practice behavioral questions', link: '/hr-round', icon: '🤝' },
    { title: 'View Analytics', desc: 'Check your progress and weak areas', link: '/analytics', icon: '📊' },
  ];

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.name || 'User'} 👋</h1>
            <p>Ready to crush your next interview?</p>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ color: stat.color, background: `${stat.color}20` }}>
                {stat.icon}
              </div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link} className="action-card">
              <span className="action-icon">{action.icon}</span>
              <h3>{action.title}</h3>
              <p>{action.desc}</p>
              <span className="action-link">
                Start <FiArrowRight />
              </span>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;

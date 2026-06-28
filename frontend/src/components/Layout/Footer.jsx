import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>🎯 Interview<span className="text-gradient">AI</span></h3>
          <p>AI-powered interview preparation platform</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Platform</h4>
            <Link to="/interview">Interview</Link>
            <Link to="/coding-round">Coding Round</Link>
            <Link to="/hr-round">HR Round</Link>
          </div>
          <div>
            <h4>Resources</h4>
            <Link to="/analytics">Analytics</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 InterviewAI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

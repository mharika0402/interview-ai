import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { FiTarget, FiCode, FiMic, FiBarChart2, FiArrowRight } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: <FiTarget />, title: 'AI Interview Questions', desc: 'Role-specific questions generated based on your resume' },
    { icon: <FiMic />, title: 'Voice Recording', desc: 'Record your answers and get AI-powered feedback' },
    { icon: <FiCode />, title: 'Coding Round', desc: 'Practice coding problems with a live code editor' },
    { icon: <FiBarChart2 />, title: 'Analytics', desc: 'Track your weak areas and improvement over time' },
  ];

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Ace Your Next Interview with <span className="text-gradient">AI</span></h1>
          <p>Upload your resume, select your target role, and practice with AI-generated questions, coding rounds, and HR interviews — all with real-time feedback.</p>
          <div className="hero-buttons">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Dashboard <FiArrowRight />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-lg">
                  Get Started Free <FiArrowRight />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-graphic">
          <div className="hero-card floating">
            <div className="hero-card-header">🎯 Interview Session</div>
            <div className="hero-card-body">
              <div className="hero-card-item">Q: Tell me about your experience with React?</div>
              <div className="hero-card-item recording">
                <span className="recording-dot"></span> Recording your answer...
              </div>
              <div className="hero-card-score">Score: 8.5/10</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Everything You Need to <span className="text-gradient">Prepare</span></h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It <span className="text-gradient">Works</span></h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload Resume</h3>
            <p>Upload your resume and our AI parses your skills and experience</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Select Role</h3>
            <p>Choose your target role and the AI generates tailored questions</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Practice & Record</h3>
            <p>Answer questions via voice recording or typing</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Get Feedback</h3>
            <p>Receive detailed feedback, scores, and weak area analysis</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;

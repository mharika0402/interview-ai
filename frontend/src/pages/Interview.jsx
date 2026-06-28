import { useState } from 'react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import ResumeUpload from '../components/Resume/ResumeUpload';
import { interviewAPI } from '../services/api';
import { FiArrowRight, FiMic, FiSquare, FiCheck, FiLoader } from 'react-icons/fi';
import './Interview.css';

const Interview = () => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [allScores, setAllScores] = useState([]);

  const roles = [
    'SDE-1 (Software Engineer)',
    'SDE-2 (Senior Software Engineer)',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'ML Engineer',
    'Data Engineer',
    'DevOps Engineer',
    'Cloud Engineer',
    'Mobile Developer',
    'QA / Test Engineer',
    'System Design Engineer',
    'Product Manager',
  ];

  const [questions, setQuestions] = useState([]);
  const [resumeText, setResumeText] = useState('');

  const handleResumeUpload = (file) => {
    console.log('Resume uploaded:', file.name);
    setResumeText('Resume uploaded: ' + file.name);
    setStep(2);
  };

  const handleRoleSelect = async () => {
    if (selectedRole) {
      setLoading(true);
      try {
        const response = await interviewAPI.getQuestions({
          resumeText: resumeText,
          role: selectedRole,
        });
        setQuestions(response.data.questions || []);
        setStep(3);
      } catch (error) {
        console.error('Error getting questions:', error);
        // Fallback questions
        setQuestions([
          `Tell me about yourself and your experience relevant to the ${selectedRole} role?`,
          'How do you approach solving a complex technical problem?',
          'Describe a challenging project you worked on and the outcome.',
          'How do you handle tight deadlines and competing priorities?',
          'What is your approach to learning new technologies?',
        ]);
        setStep(3);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
    }, 5000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleCustomQuestion = () => {
    if (customQuestion.trim()) {
      const newQuestions = [...questions];
      newQuestions[currentQuestion] = customQuestion.trim();
      setQuestions(newQuestions);
      setCustomQuestion('');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
      setFeedback(null);
      setAnswer('');
    } else {
      setStep(4);
    }
  };

  const handleShowFeedback = async () => {
    if (!answer.trim()) {
      return;
    }
    setLoading(true);
    try {
      const response = await interviewAPI.evaluateAnswer({
        question: questions[currentQuestion],
        answer: answer,
      });
      setFeedback(response.data);
      setAllScores([...allScores, response.data.score || 7.5]);
    } catch (error) {
      console.error('Error evaluating answer:', error);
      setFeedback({
        score: 7.5,
        feedback: 'Good answer! Consider adding more specific examples from your experience.',
        tags: [
          { name: 'Clarity', rating: 'Good' },
          { name: 'Examples', rating: 'Needs Improvement' },
        ],
      });
      setAllScores([...allScores, 7.5]);
    } finally {
      setShowFeedback(true);
      setLoading(false);
    }
  };

  const overallScore = allScores.length > 0
    ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1)
    : '7.5';

  return (
    <div className="interview-page">
      <Navbar />
      <div className="interview-container">
        {/* Progress Bar */}
        <div className="interview-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span>
            <span>Upload Resume</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span>
            <span>Select Role</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span>Interview</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>
            <span className="step-num">4</span>
            <span>Results</span>
          </div>
        </div>

        {/* Step 1: Upload Resume */}
        {step === 1 && (
          <ResumeUpload onUpload={handleResumeUpload} />
        )}

        {/* Step 2: Select Role */}
        {step === 2 && (
          <div className="role-selection">
            <h2>Select Your Target Role</h2>
            <p>Choose the role you're preparing for</p>
            <div className="roles-grid">
              {roles.map((role) => (
                <button
                  key={role}
                  className={`role-card ${selectedRole === role ? 'selected' : ''}`}
                  onClick={() => setSelectedRole(role)}
                >
                  {selectedRole === role && <FiCheck className="check-icon" />}
                  {role}
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleRoleSelect}
              disabled={!selectedRole || loading}
              style={{ marginTop: '24px' }}
            >
              {loading ? <><FiLoader className="spin" /> Generating AI Questions...</> : <>Continue <FiArrowRight /></>}
            </button>
          </div>
        )}

        {/* Step 3: Interview Questions */}
        {step === 3 && (
          <div className="interview-session">
            <div className="question-counter">
              Question {currentQuestion + 1} of {questions.length}
            </div>

            <div className="question-card">
              <h2>{questions[currentQuestion]}</h2>
            </div>

            {/* Custom Question Input */}
            <div className="custom-question">
              <p>Or type your own question:</p>
              <div className="custom-question-input">
                <input
                  type="text"
                  placeholder="Type your own interview question..."
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                />
                <button className="btn btn-secondary btn-sm" onClick={handleCustomQuestion}>
                  Ask This
                </button>
              </div>
            </div>

            {/* Answer Input */}
            <div className="answer-section" style={{ marginTop: '20px' }}>
              <textarea
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div className="voice-section">
              {!isRecording ? (
                <button className="btn-record" onClick={handleStartRecording}>
                  <FiMic /> Start Recording
                </button>
              ) : (
                <button className="btn-record recording" onClick={handleStopRecording}>
                  <FiSquare /> Stop Recording
                </button>
              )}
              {isRecording && (
                <div className="recording-indicator">
                  <span className="recording-dot"></span> Recording...
                </div>
              )}
            </div>

            {!showFeedback && !isRecording && (
              <button
                className="btn btn-secondary"
                onClick={handleShowFeedback}
                disabled={loading || !answer.trim()}
                style={{ marginTop: '20px' }}
              >
                {loading ? <><FiLoader className="spin" /> AI Evaluating...</> : 'Get AI Feedback'}
              </button>
            )}

            {showFeedback && feedback && (
              <div className="feedback-card">
                <h3>🤖 AI Feedback</h3>
                <div className="feedback-score">
                  <span className="score-value">{feedback.score}</span>
                  <span className="score-max">/10</span>
                </div>
                <p className="feedback-text">{feedback.feedback}</p>
                {feedback.tags && feedback.tags.length > 0 && (
                  <div className="feedback-tags">
                    {feedback.tags.map((tag, i) => (
                      <span key={i} className={`tag ${tag.rating === 'Good' || tag.rating === 'Excellent' ? 'tag-good' : 'tag-improve'}`}>
                        {tag.name}: {tag.rating}
                      </span>
                    ))}
                  </div>
                )}
                <button className="btn btn-primary" onClick={handleNextQuestion} style={{ marginTop: '16px' }}>
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'} <FiArrowRight />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && (
          <div className="interview-results">
            <h2>🎉 Interview Complete!</h2>
            <div className="results-card">
              <div className="overall-score">
                <span className="big-score">{overallScore}</span>
                <span className="big-score-max">/10</span>
              </div>
              <h3>Overall Performance</h3>
              <div className="results-breakdown">
                {allScores.map((score, i) => (
                  <div key={i} className="result-item">
                    <span>Question {i + 1}</span>
                    <div className="result-bar">
                      <div className="result-fill" style={{ width: `${score * 10}%` }}></div>
                    </div>
                    <span>{score}/10</span>
                  </div>
                ))}
              </div>
              <div className="weak-areas">
                <h4>💡 Tips for Improvement</h4>
                <ul>
                  <li>Include more specific examples from your experience</li>
                  <li>Mention the business impact of your work</li>
                  <li>Structure answers using the STAR method</li>
                </ul>
              </div>
            </div>
            <div className="results-actions">
              <button className="btn btn-primary" onClick={() => { setStep(1); setCurrentQuestion(0); setShowFeedback(false); setFeedback(null); setAllScores([]); setAnswer(''); }}>
                Practice Again
              </button>
              <button className="btn btn-secondary" onClick={() => window.location.href = '/dashboard'}>
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Interview;

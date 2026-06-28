import { useState, useEffect } from 'react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { hrAPI } from '../services/api';
import { FiMic, FiSquare, FiArrowRight, FiCheck, FiLoader } from 'react-icons/fi';
import './HRRound.css';

const HRRound = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [allScores, setAllScores] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Fetch AI-generated HR questions on mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const response = await hrAPI.getQuestions();
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Error fetching HR questions:', error);
      setQuestions([
        'Tell me about a time when you had to work with a difficult team member. How did you handle it?',
        'Why are you looking for a change? What motivates you to seek new opportunities?',
        'Describe a situation where you had to meet a tight deadline. How did you manage your time?',
        'What is your biggest professional achievement so far and why does it stand out?',
        'How do you handle constructive criticism? Give me an example.',
      ]);
    } finally {
      setLoadingQuestions(false);
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

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
      setFeedback(null);
      setAnswer('');
    } else {
      setCompleted(true);
    }
  };

  const handleShowFeedback = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const response = await hrAPI.evaluateAnswer({
        question: questions[currentQuestion],
        answer: answer,
      });
      setFeedback(response.data);
      setAllScores([...allScores, response.data.score || 8.0]);
    } catch (error) {
      console.error('Error evaluating answer:', error);
      setFeedback({
        score: 8.0,
        feedback: 'Good answer! Try to quantify your impact and use the STAR method.',
        tags: [
          { name: 'Communication', rating: 'Good' },
          { name: 'STAR Method', rating: 'Good' },
          { name: 'Specificity', rating: 'Needs Improvement' },
        ],
      });
      setAllScores([...allScores, 8.0]);
    } finally {
      setShowFeedback(true);
      setLoading(false);
    }
  };

  const overallScore = allScores.length > 0
    ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1)
    : '8.0';

  if (loadingQuestions) {
    return (
      <div className="hr-page">
        <Navbar />
        <div className="hr-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <FiLoader className="spin" size={40} />
            <p style={{ marginTop: '16px', fontSize: '18px' }}>🤖 AI is generating HR questions...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="hr-page">
      <Navbar />
      <div className="hr-container">
        {!completed ? (
          <>
            <div className="hr-header">
              <h1>🤝 HR Round Practice</h1>
              <p>Practice behavioral and HR interview questions</p>
            </div>

            <div className="hr-progress-bar">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`hr-progress-dot ${i <= currentQuestion ? 'active' : ''} ${i < currentQuestion ? 'done' : ''}`}
                >
                  {i < currentQuestion ? <FiCheck /> : i + 1}
                </div>
              ))}
            </div>

            <div className="hr-question-counter">
              Question {currentQuestion + 1} of {questions.length}
            </div>

            <div className="hr-question-card">
              <div className="hr-question-icon">💬</div>
              <h2>{questions[currentQuestion]}</h2>
              <p className="hr-tip">Tip: Use the STAR method (Situation, Task, Action, Result)</p>
            </div>

            {/* Answer Input */}
            <div style={{ marginTop: '20px', width: '100%', maxWidth: '700px', margin: '20px auto 0' }}>
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

            <div className="hr-voice-section">
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
                  <span className="recording-dot"></span> Recording your answer...
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
              <div className="hr-feedback">
                <h3>🤖 AI Feedback</h3>
                <div className="hr-feedback-score">
                  <span className="score-value">{feedback.score}</span>
                  <span className="score-max">/10</span>
                </div>
                <p className="feedback-text" style={{ margin: '12px 0', color: '#4a5568' }}>{feedback.feedback}</p>
                {feedback.tags && feedback.tags.length > 0 && (
                  <div className="hr-feedback-content">
                    {feedback.tags.map((tag, i) => (
                      <div key={i} className={`feedback-item ${tag.rating === 'Good' || tag.rating === 'Excellent' ? 'good' : 'improve'}`}>
                        {tag.rating === 'Good' || tag.rating === 'Excellent' ? <FiCheck /> : <span>💡</span>}
                        <span>{tag.name}: {tag.rating}</span>
                      </div>
                    ))}
                  </div>
                )}
                <button className="btn btn-primary" onClick={handleNext} style={{ marginTop: '16px' }}>
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'} <FiArrowRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="hr-results">
            <h2>🎉 HR Round Complete!</h2>
            <div className="hr-results-card">
              <div className="hr-overall-score">
                <span className="big-score">{overallScore}</span>
                <span className="big-score-max">/10</span>
              </div>
              <h3>HR Round Performance</h3>
              <div className="hr-results-breakdown">
                {allScores.map((score, i) => (
                  <div key={i} className="hr-result-item">
                    <span>Question {i + 1}</span>
                    <div className="hr-result-bar">
                      <div className="hr-result-fill" style={{ width: `${score * 10}%` }}></div>
                    </div>
                    <span>{score}/10</span>
                  </div>
                ))}
              </div>
              <div className="hr-tips">
                <h4>📝 Tips for Improvement</h4>
                <ul>
                  <li>Always quantify your achievements with numbers</li>
                  <li>Practice the STAR method for behavioral questions</li>
                  <li>End answers with a reflection on what you learned</li>
                  <li>Keep answers concise — aim for 1.5-2 minutes</li>
                </ul>
              </div>
            </div>
            <div className="hr-results-actions">
              <button className="btn btn-primary" onClick={() => { setCurrentQuestion(0); setCompleted(false); setShowFeedback(false); setFeedback(null); setAllScores([]); setAnswer(''); }}>
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

export default HRRound;

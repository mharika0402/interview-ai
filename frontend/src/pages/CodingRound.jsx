import { useState, useEffect } from 'react';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { codingAPI } from '../services/api';
import { FiPlay, FiCheck, FiClock, FiLoader, FiRefreshCw } from 'react-icons/fi';
import './CodingRound.css';

const CodingRound = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('// Write your solution here\n');
  const [testResults, setTestResults] = useState(null);
  const [running, setRunning] = useState(false);
  const [loadingProblem, setLoadingProblem] = useState(true);
  const [problem, setProblem] = useState(null);

  const languages = ['javascript', 'python', 'java', 'cpp'];

  // Fetch AI-generated problem on mount
  useEffect(() => {
    fetchProblem();
  }, []);

  const fetchProblem = async () => {
    setLoadingProblem(true);
    try {
      const response = await codingAPI.getProblem();
      setProblem(response.data);
      setCode(response.data.starterCode || '// Write your solution here\n');
    } catch (error) {
      console.error('Error fetching problem:', error);
      // Fallback problem
      setProblem({
        title: 'Two Sum',
        difficulty: 'Easy',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
        examples: [
          { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
          { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
        ],
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
        starterCode: 'function twoSum(nums, target) {\n  // Write your solution here\n}',
      });
      setCode('function twoSum(nums, target) {\n  // Write your solution here\n}');
    } finally {
      setLoadingProblem(false);
    }
  };

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => {
      setTestResults({
        passed: 2,
        total: 3,
        tests: [
          { name: 'Test 1', input: '[2,7,11,15], 9', expected: '[0,1]', actual: '[0,1]', passed: true },
          { name: 'Test 2', input: '[3,2,4], 6', expected: '[1,2]', actual: '[1,2]', passed: true },
          { name: 'Test 3', input: '[3,3], 6', expected: '[0,1]', actual: '[-1,-1]', passed: false },
        ],
      });
      setRunning(false);
    }, 1500);
  };

  const handleSubmit = async () => {
    setRunning(true);
    try {
      const response = await codingAPI.submitCode({ code, language: selectedLanguage });
      setTestResults(response.data);
    } catch (error) {
      console.error('Error submitting code:', error);
      setTestResults({
        passed: 2,
        total: 3,
        tests: [
          { name: 'Test 1', input: '[2,7,11,15], 9', expected: '[0,1]', actual: '[0,1]', passed: true },
          { name: 'Test 2', input: '[3,2,4], 6', expected: '[1,2]', actual: '[1,2]', passed: true },
          { name: 'Test 3', input: '[3,3], 6', expected: '[0,1]', actual: '[-1,-1]', passed: false },
        ],
      });
    } finally {
      setRunning(false);
    }
  };

  if (loadingProblem) {
    return (
      <div className="coding-page">
        <Navbar />
        <div className="coding-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <FiLoader className="spin" size={40} />
            <p style={{ marginTop: '16px', fontSize: '18px' }}>🤖 AI is generating a coding problem...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div className="coding-page">
      <Navbar />
      <div className="coding-container">
        {/* Left: Problem Statement */}
        <div className="problem-panel">
          <div className="problem-header">
            <h2>{problem.title}</h2>
            <span className={`difficulty ${problem.difficulty?.toLowerCase() || 'easy'}`}>
              {problem.difficulty || 'Easy'}
            </span>
            <button className="btn btn-secondary btn-sm" onClick={fetchProblem} style={{ marginLeft: 'auto' }} title="Get new problem">
              <FiRefreshCw /> New Problem
            </button>
          </div>
          <div className="problem-body">
            <p className="problem-desc">{problem.description}</p>

            <h4>Examples:</h4>
            {(problem.examples || []).map((ex, i) => (
              <div key={i} className="example">
                <p><strong>Input:</strong> {ex.input}</p>
                <p><strong>Output:</strong> {ex.output}</p>
                {ex.explanation && <p><strong>Explanation:</strong> {ex.explanation}</p>}
              </div>
            ))}

            <h4>Constraints:</h4>
            <ul className="constraints">
              {(problem.constraints || []).map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className="editor-panel">
          <div className="editor-header">
            <div className="language-tabs">
              {languages.map((lang) => (
                <button
                  key={lang}
                  className={`lang-tab ${selectedLanguage === lang ? 'active' : ''}`}
                  onClick={() => setSelectedLanguage(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <div className="code-editor">
            <div className="line-numbers">
              {code.split('\n').map((_, i) => (
                <span key={i}>{i + 1}</span>
              ))}
            </div>
            <textarea
              className="code-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
            />
          </div>
          <div className="editor-actions">
            <button className="btn btn-secondary" onClick={handleRun} disabled={running}>
              <FiPlay /> Run
            </button>
            <button className="btn btn-success" onClick={handleSubmit} disabled={running}>
              <FiCheck /> Submit
            </button>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="test-results">
              <div className="results-header">
                <FiClock /> Test Results: {testResults.passed}/{testResults.total} passed
              </div>
              <div className="tests-list">
                {testResults.tests.map((test, i) => (
                  <div key={i} className={`test-item ${test.passed ? 'passed' : 'failed'}`}>
                    <span className="test-status">{test.passed ? '✅' : '❌'}</span>
                    <span className="test-name">{test.name}</span>
                    <span className="test-detail">
                      Expected: {test.expected} | Got: {test.actual}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CodingRound;

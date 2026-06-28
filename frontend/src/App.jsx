import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';

// Pages (we'll create these step by step)
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import CodingRound from './pages/CodingRound';
import HRRound from './pages/HRRound';
import Analytics from './pages/Analytics';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/coding-round" element={<CodingRound />} />
          <Route path="/hr-round" element={<HRRound />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

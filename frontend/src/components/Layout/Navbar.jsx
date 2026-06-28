import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiLogOut, FiUser } from 'react-icons/fi';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🎯</span>
          <span className="logo-text">Interview<span className="text-gradient">AI</span></span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/interview" onClick={() => setMenuOpen(false)}>Interview</Link>
              <Link to="/coding-round" onClick={() => setMenuOpen(false)}>Coding</Link>
              <Link to="/hr-round" onClick={() => setMenuOpen(false)}>HR Round</Link>
              <Link to="/analytics" onClick={() => setMenuOpen(false)}>Analytics</Link>
              <div className="navbar-user">
                <FiUser /> <span>{user?.name || 'User'}</span>
              </div>
              <button className="btn-logout" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-signup">Sign Up</Link>
            </>
          )}
        </div>

        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <FiMenu />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

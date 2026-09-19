import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-logo">
          <div className="logo-group">
            <span className="logo-text">CINEPRIME</span>
            <span className="logo-tagline mono">YOUR LOCAL CINEMA</span>
          </div>
        </Link>
        <div className="nav-meta mono">
          <span>EST. 1998</span>
          <span className="dot">•</span>
          <span>3 SCREENS</span>
          <span className="dot">•</span>
          <span>240 SEATS</span>
        </div>
        <div className="nav-links mono">
          <Link to="/" className="nav-link">PROGRAM</Link>
          {isAuthenticated() && (
             <Link to="/bookings" className="nav-link">MY TICKETS</Link>
          )}
          {isAuthenticated() ? (
             <button onClick={handleLogout} className="btn nav-link" style={{border: 'none', background: 'transparent', cursor: 'pointer', padding: 0}}>LOGOUT ({user?.username})</button>
          ) : (
             <Link to="/login" className="nav-link">LOGIN</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

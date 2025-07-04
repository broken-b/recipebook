import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">🍳 RecipeBook</Link>
      </div>
      <nav className="header-nav">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </nav>
      <div className="header-user">
        <span>👤 {user.username}</span>
      </div>
    </header>
  );
};

export default Header; 
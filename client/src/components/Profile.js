import React, { useEffect, useState } from 'react';
import '../styles.css';

function Profile({ onGoHome }) {
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [error, setError] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('/api/profile', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(setProfile)
      .catch(() => setError('Failed to load profile'));
  }, []);
  return (
    <div className="profile-section">
      <h2 className="profile-title">Profile</h2>
      {error && <div className="login-error">{error}</div>}
      <div className="profile-info-list">
        <div className="profile-info-row"><span className="profile-label">Username:</span> <span className="profile-value">{profile.username}</span></div>
        <div className="profile-info-row"><span className="profile-label">Email:</span> <span className="profile-value">{profile.email}</span></div>
      </div>
      <button className="login-btn" onClick={onGoHome}>Go Home</button>
    </div>
  );
}

export default Profile; 
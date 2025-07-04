import React, { useState } from 'react';
import '../styles.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regError, setRegError] = useState(null);
  const [regSuccess, setRegSuccess] = useState(null);

  function handleLogin(e) {
    e.preventDefault();
    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (!res.ok) throw new Error('Login failed');
        return res.json();
      })
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          window.location.reload();
        } else {
          setError('Login failed');
        }
      })
      .catch(() => setError('Something broke'));
  }

  function handleRegister(e) {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: regUsername, password: regPassword, email: regEmail })
    })
      .then(res => {
        if (res.status === 409) throw new Error('Username already exists');
        if (!res.ok) throw new Error('Registration failed');
        return res.json();
      })
      .then(() => {
        setRegSuccess('Registration successful! You can now log in.');
        setShowRegister(false);
        setUsername(regUsername);
        setPassword(regPassword);
        setRegUsername('');
        setRegPassword('');
        setRegEmail('');
      })
      .catch(err => setRegError(err.message));
  }

  return (
    <div className="login-page-bg">
      <div className="login-card">
        <form onSubmit={handleLogin} className="login-form">
          <h2 className="login-title">Login</h2>
          <input className="login-input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          <input className="login-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" />
          <button className="login-btn" type="submit">Login</button>
          {error && <div className="login-error">{error}</div>}
        </form>
        <div style={{ marginTop: 10, textAlign: 'center' }}>
          <button className="login-toggle-btn" onClick={() => setShowRegister(r => !r)}>
            {showRegister ? 'Hide Registration' : 'Register New Account'}
          </button>
        </div>
        {showRegister && (
          <form onSubmit={handleRegister} className="register-form">
            <h2 className="login-title">Register</h2>
            <input className="login-input" value={regUsername} onChange={e => setRegUsername(e.target.value)} placeholder="Username" />
            <input className="login-input" value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Password" type="password" />
            <input className="login-input" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="Email" type="email" />
            <button className="login-btn" type="submit">Register</button>
            {regError && <div className="login-error">{regError}</div>}
            {regSuccess && <div className="login-success">{regSuccess}</div>}
          </form>
        )}
      </div>
    </div>
  );
}

export default Login; 
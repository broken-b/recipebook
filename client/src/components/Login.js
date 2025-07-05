import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles.css';

function Login() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  
  // Register form state
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(loginData);
    if (result.success) {
      // Login successful, redirect will be handled by the app
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (registerData.password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    const result = await register({
      username: registerData.username,
      email: registerData.email,
      password: registerData.password
    });
    
    if (result.success) {
      // Registration successful, user will be logged in automatically
    }
    setLoading(false);
  };

  const handleInputChange = (form, field, value) => {
    if (form === 'login') {
      setLoginData(prev => ({ ...prev, [field]: value }));
    } else {
      setRegisterData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="login-page-bg">
      <div className="login-card">
        <div className="login-header">
          <h1 className="app-title">RecipeBook</h1>
          <p className="app-subtitle">Share and discover amazing recipes</p>
        </div>

        {isLogin ? (
          <form onSubmit={handleLogin} className="login-form">
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Sign in to your account</p>
            
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                className="login-input"
                type="text"
                placeholder="Username or Email"
                value={loginData.username}
                onChange={(e) => handleInputChange('login', 'username', e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                className="login-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => handleInputChange('login', 'password', e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="register-form">
            <h2 className="login-title">Create Account</h2>
            <p className="login-subtitle">Join our community of food lovers</p>
            
            <div className="input-group">
              <FaUser className="input-icon" />
              <input
                className="login-input"
                type="text"
                placeholder="Username"
                value={registerData.username}
                onChange={(e) => handleInputChange('register', 'username', e.target.value)}
                required
                minLength={3}
              />
            </div>
            
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                className="login-input"
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => handleInputChange('register', 'email', e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                className="login-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={registerData.password}
                onChange={(e) => handleInputChange('register', 'password', e.target.value)}
                required
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                className="login-input"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={registerData.confirmPassword}
                onChange={(e) => handleInputChange('register', 'confirmPassword', e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="form-switch">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              className="switch-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setLoginData({ username: '', password: '' });
                setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login; 
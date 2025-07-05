import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { FaArrowLeft, FaUser, FaEnvelope, FaCalendar, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import '../styles.css';

function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await userAPI.updateProfile(profileData);
      updateUser(response.data);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button onClick={() => navigate('/')} className="btn btn-text">
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>Profile</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn btn-secondary">
            <FaEdit /> Edit Profile
          </button>
        )}
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} />
            ) : (
              <div className="avatar-placeholder">
                <FaUser />
              </div>
            )}
          </div>

          <div className="profile-info">
            {isEditing ? (
              <div className="profile-form">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={profileData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Enter username"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                <div className="profile-actions">
                  <button onClick={handleCancel} className="btn btn-outline">
                    <FaTimes /> Cancel
                  </button>
                  <button 
                    onClick={handleSave} 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    <FaSave />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-details">
                <h2>{user?.username}</h2>
                {user?.bio && <p className="profile-bio">{user.bio}</p>}
                
                <div className="profile-stats">
                  <div className="stat-item">
                    <FaEnvelope />
                    <span>{user?.email}</span>
                  </div>
                  <div className="stat-item">
                    <FaCalendar />
                    <span>Joined {formatDate(user?.createdAt)}</span>
                  </div>
                </div>

                <div className="profile-meta">
                  <div className="meta-item">
                    <span className="meta-label">Member since:</span>
                    <span className="meta-value">{formatDate(user?.createdAt)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Last updated:</span>
                    <span className="meta-value">{formatDate(user?.updatedAt)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="profile-sections">
          <div className="profile-section">
            <h3>Account Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Username</span>
                <span className="info-value">{user?.username}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Member Since</span>
                <span className="info-value">{formatDate(user?.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Preferences</h3>
            <p className="section-description">
              Manage your account preferences and settings.
            </p>
            <div className="preferences-list">
              <div className="preference-item">
                <span>Email notifications</span>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="preference-item">
                <span>Public profile</span>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recipesAPI } from '../services/api';
import { FaSearch, FaPlus, FaUser, FaSignOutAlt, FaHeart, FaClock, FaUsers } from 'react-icons/fa';
import toast from 'react-hot-toast';
import RecipeCard from './RecipeCard';
import SearchBar from './SearchBar';
import '../styles.css';

function Dashboard({ recipes, loading, onRecipesChange }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState(recipes);

  React.useEffect(() => {
    setFilteredRecipes(recipes);
  }, [recipes]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredRecipes(recipes);
      return;
    }

    try {
      const response = await recipesAPI.search(query);
      setFilteredRecipes(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLike = async (recipeId) => {
    try {
      await recipesAPI.like(recipeId);
      onRecipesChange(); // Refresh recipes to update like status
      toast.success('Recipe updated!');
    } catch (error) {
      toast.error('Failed to update recipe');
    }
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">
              <span className="title-icon">🍳</span>
              RecipeBook
            </h1>
            <p className="dashboard-subtitle">Discover and share amazing recipes</p>
          </div>
          
          <div className="header-right">
            <SearchBar onSearch={handleSearch} />
            
            <div className="user-menu">
              <div className="user-info">
                <FaUser className="user-icon" />
                <span className="username">{user?.username}</span>
              </div>
              
              <div className="user-actions">
                <Link to="/create" className="btn btn-primary">
                  <FaPlus /> Create Recipe
                </Link>
                <Link to="/profile" className="btn btn-secondary">
                  <FaUser /> Profile
                </Link>
                <button onClick={handleLogout} className="btn btn-outline">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Stats Section */}
          <div className="stats-section">
            <div className="stat-card">
              <FaHeart className="stat-icon" />
              <div className="stat-info">
                <h3>{recipes.length}</h3>
                <p>Total Recipes</p>
              </div>
            </div>
            <div className="stat-card">
              <FaClock className="stat-icon" />
              <div className="stat-info">
                <h3>{recipes.filter(r => r.cookingTime <= 30).length}</h3>
                <p>Quick Recipes</p>
              </div>
            </div>
            <div className="stat-card">
              <FaUsers className="stat-icon" />
              <div className="stat-info">
                <h3>{new Set(recipes.map(r => r.author?.username)).size}</h3>
                <p>Active Chefs</p>
              </div>
            </div>
          </div>

          {/* Recipes Section */}
          <section className="recipes-section">
            <div className="section-header">
              <h2>
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Latest Recipes'}
              </h2>
              {searchQuery && (
                <button 
                  onClick={() => handleSearch('')} 
                  className="btn btn-text"
                >
                  Clear Search
                </button>
              )}
            </div>

            {loading ? (
              <div className="loading-recipes">
                <div className="spinner"></div>
                <p>Loading recipes...</p>
              </div>
            ) : filteredRecipes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🍽️</div>
                <h3>No recipes found</h3>
                <p>
                  {searchQuery 
                    ? `No recipes match "${searchQuery}". Try a different search term.`
                    : 'Be the first to share a recipe!'
                  }
                </p>
                {!searchQuery && (
                  <Link to="/create" className="btn btn-primary">
                    <FaPlus /> Create Your First Recipe
                  </Link>
                )}
              </div>
            ) : (
              <div className="recipes-grid">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    onLike={handleLike}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard; 
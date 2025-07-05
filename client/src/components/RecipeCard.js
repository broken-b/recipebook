import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaClock, FaUsers, FaStar, FaUser } from 'react-icons/fa';
import '../styles.css';

function RecipeCard({ recipe, onLike }) {
  const { user } = useAuth();
  const isLiked = recipe.likes?.some(like => like._id === user?._id || like === user?._id);
  const isAuthor = recipe.author?._id === user?._id || recipe.author === user?._id;

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLike) {
      onLike(recipe._id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link to={`/recipe/${recipe._id}`} className="recipe-card">
      <div className="recipe-card-image">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} />
        ) : (
          <div className="recipe-placeholder">
            <span>🍽️</span>
          </div>
        )}
        <div className="recipe-card-overlay">
          <button
            onClick={handleLike}
            className={`like-button ${isLiked ? 'liked' : ''}`}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            <FaHeart />
          </button>
        </div>
      </div>

      <div className="recipe-card-content">
        <div className="recipe-card-header">
          <h3 className="recipe-title">{recipe.title}</h3>
          {isAuthor && (
            <span className="author-badge">Your Recipe</span>
          )}
        </div>

        <p className="recipe-description">
          {recipe.description.length > 100
            ? `${recipe.description.substring(0, 100)}...`
            : recipe.description
          }
        </p>

        <div className="recipe-meta">
          <div className="meta-item">
            <FaClock />
            <span>{recipe.cookingTime} min</span>
          </div>
          <div className="meta-item">
            <FaUsers />
            <span>{recipe.servings} servings</span>
          </div>
          {recipe.rating?.average > 0 && (
            <div className="meta-item">
              <FaStar />
              <span>{recipe.rating.average.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="recipe-footer">
          <div className="recipe-author">
            <FaUser />
            <span>{recipe.author?.username || 'Unknown'}</span>
          </div>
          <div className="recipe-date">
            {formatDate(recipe.createdAt)}
          </div>
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="recipe-tags">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="tag-more">+{recipe.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export default RecipeCard; 
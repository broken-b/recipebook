import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recipesAPI, commentsAPI } from '../services/api';
import { FaArrowLeft, FaHeart, FaClock, FaUsers, FaStar, FaUser, FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import '../styles.css';

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    loadRecipe();
    loadComments();
  }, [id]);

  const loadRecipe = async () => {
    try {
      const response = await recipesAPI.getById(id);
      setRecipe(response.data);
    } catch (error) {
      console.error('Failed to load recipe:', error);
      toast.error('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await commentsAPI.getByRecipe(id);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      await recipesAPI.like(id);
      loadRecipe(); // Refresh recipe to update like status
      toast.success('Recipe updated!');
    } catch (error) {
      toast.error('Failed to update recipe');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      await recipesAPI.delete(id);
      toast.success('Recipe deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete recipe');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await commentsAPI.create({
        recipeId: id,
        text: newComment
      });
      setNewComment('');
      loadComments();
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const isLiked = recipe?.likes?.some(like => like._id === user?._id || like === user?._id);
  const isAuthor = recipe?.author?._id === user?._id || recipe?.author === user?._id;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-detail">
        <div className="recipe-detail-header">
          <button onClick={() => navigate('/')} className="btn btn-text">
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>Recipe not found</h3>
          <p>The recipe you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-detail-header">
        <button onClick={() => navigate('/')} className="btn btn-text">
          <FaArrowLeft /> Back to Dashboard
        </button>
        {isAuthor && (
          <div className="recipe-actions">
            <button onClick={() => navigate(`/edit/${id}`)} className="btn btn-secondary">
              <FaEdit /> Edit
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
              <FaTrash /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="recipe-detail-content">
        <div className="recipe-hero">
          {recipe.image ? (
            <img src={recipe.image} alt={recipe.title} className="recipe-hero-image" />
          ) : (
            <div className="recipe-hero-placeholder">
              <span>🍽️</span>
            </div>
          )}
          <div className="recipe-hero-overlay">
            <button
              onClick={handleLike}
              className={`like-button-large ${isLiked ? 'liked' : ''}`}
              title={isLiked ? 'Unlike' : 'Like'}
            >
              <FaHeart />
            </button>
          </div>
        </div>

        <div className="recipe-info">
          <div className="recipe-header">
            <h1>{recipe.title}</h1>
            {isAuthor && <span className="author-badge">Your Recipe</span>}
          </div>

          <p className="recipe-description-large">{recipe.description}</p>

          <div className="recipe-meta-large">
            <div className="meta-item">
              <FaClock />
              <span>{recipe.cookingTime} minutes</span>
            </div>
            <div className="meta-item">
              <FaUsers />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="meta-item">
              <span className="difficulty-badge">{recipe.difficulty}</span>
            </div>
            {recipe.cuisine && (
              <div className="meta-item">
                <span className="cuisine-badge">{recipe.cuisine}</span>
              </div>
            )}
          </div>

          <div className="recipe-author-info">
            <FaUser />
            <span>By {recipe.author?.username || 'Unknown'}</span>
            <span className="recipe-date">
              {new Date(recipe.createdAt).toLocaleDateString()}
            </span>
          </div>

          {recipe.tags && recipe.tags.length > 0 && (
            <div className="recipe-tags-large">
              {recipe.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="recipe-sections">
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="recipe-section">
              <h2>Ingredients</h2>
              <ul className="ingredients-list">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="ingredient-item">
                    <span className="ingredient-name">{ingredient.name}</span>
                    {ingredient.amount && (
                      <span className="ingredient-amount">
                        {ingredient.amount} {ingredient.unit}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {recipe.instructions && recipe.instructions.length > 0 && (
            <div className="recipe-section">
              <h2>Instructions</h2>
              <ol className="instructions-list">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="instruction-item">
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="comments-section">
          <h2>Comments ({comments.length})</h2>
          
          {user && (
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts about this recipe..."
                rows={3}
                className="comment-input"
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submittingComment || !newComment.trim()}
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">{comment.author?.username || 'Unknown'}</span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { recipesAPI } from '../services/api';
import { FaArrowLeft, FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';
import '../styles.css';

function EditRecipe({ onRecipeUpdated }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    ingredients: [{ name: '', amount: '', unit: '' }],
    instructions: [''],
    cookingTime: 30,
    servings: 4,
    difficulty: 'Medium',
    cuisine: '',
    tags: []
  });

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = async () => {
    try {
      const response = await recipesAPI.getById(id);
      const recipeData = response.data;
      
      // Check if user owns the recipe
      if (recipeData.author._id !== user._id && recipeData.author !== user._id) {
        toast.error('You can only edit your own recipes');
        navigate('/');
        return;
      }

      setRecipe({
        title: recipeData.title || '',
        description: recipeData.description || '',
        ingredients: recipeData.ingredients && recipeData.ingredients.length > 0 
          ? recipeData.ingredients 
          : [{ name: '', amount: '', unit: '' }],
        instructions: recipeData.instructions && recipeData.instructions.length > 0 
          ? recipeData.instructions 
          : [''],
        cookingTime: recipeData.cookingTime || 30,
        servings: recipeData.servings || 4,
        difficulty: recipeData.difficulty || 'Medium',
        cuisine: recipeData.cuisine || '',
        tags: recipeData.tags || []
      });
    } catch (error) {
      console.error('Failed to load recipe:', error);
      toast.error('Failed to load recipe');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setRecipe(prev => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', unit: '' }]
    }));
  };

  const removeIngredient = (index) => {
    if (recipe.ingredients.length > 1) {
      const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
      setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
    }
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe(prev => ({ ...prev, instructions: newInstructions }));
  };

  const addInstruction = () => {
    setRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index) => {
    if (recipe.instructions.length > 1) {
      const newInstructions = recipe.instructions.filter((_, i) => i !== index);
      setRecipe(prev => ({ ...prev, instructions: newInstructions }));
    }
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!recipe.tags.includes(newTag)) {
        setRecipe(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setRecipe(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!recipe.title.trim() || !recipe.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    // Filter out empty ingredients and instructions
    const filteredIngredients = recipe.ingredients.filter(ing => ing.name.trim());
    const filteredInstructions = recipe.instructions.filter(instruction => instruction.trim());

    if (filteredIngredients.length === 0) {
      toast.error('At least one ingredient is required');
      return;
    }

    if (filteredInstructions.length === 0) {
      toast.error('At least one instruction is required');
      return;
    }

    setSaving(true);
    try {
      const recipeData = {
        ...recipe,
        ingredients: filteredIngredients,
        instructions: filteredInstructions
      };

      await recipesAPI.update(id, recipeData);
      toast.success('Recipe updated successfully!');
      
      if (onRecipeUpdated) {
        onRecipeUpdated();
      }
      
      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error('Failed to update recipe:', error);
      toast.error('Failed to update recipe');
    } finally {
      setSaving(false);
    }
  };

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

  return (
    <div className="create-recipe">
      <div className="create-recipe-header">
        <button onClick={() => navigate(`/recipe/${id}`)} className="btn btn-text">
          <FaArrowLeft /> Back to Recipe
        </button>
        <h1>Edit Recipe</h1>
      </div>

      <form onSubmit={handleSubmit} className="create-recipe-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-group">
            <label htmlFor="title">Recipe Title *</label>
            <input
              id="title"
              type="text"
              value={recipe.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter recipe title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={recipe.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your recipe..."
              rows={4}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cookingTime">Cooking Time (minutes)</label>
              <input
                id="cookingTime"
                type="number"
                value={recipe.cookingTime}
                onChange={(e) => handleInputChange('cookingTime', parseInt(e.target.value) || 30)}
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="servings">Servings</label>
              <input
                id="servings"
                type="number"
                value={recipe.servings}
                onChange={(e) => handleInputChange('servings', parseInt(e.target.value) || 4)}
                min="1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                value={recipe.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cuisine">Cuisine</label>
              <input
                id="cuisine"
                type="text"
                value={recipe.cuisine}
                onChange={(e) => handleInputChange('cuisine', e.target.value)}
                placeholder="e.g., Italian, Mexican, Asian"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Ingredients</h2>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-row">
              <input
                type="text"
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                className="ingredient-name"
              />
              <input
                type="text"
                placeholder="Amount"
                value={ingredient.amount}
                onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                className="ingredient-amount"
              />
              <input
                type="text"
                placeholder="Unit"
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                className="ingredient-unit"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="btn btn-icon btn-danger"
                disabled={recipe.ingredients.length === 1}
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="btn btn-outline"
          >
            <FaPlus /> Add Ingredient
          </button>
        </div>

        <div className="form-section">
          <h2>Instructions</h2>
          {recipe.instructions.map((instruction, index) => (
            <div key={index} className="instruction-row">
              <div className="step-number">{index + 1}</div>
              <textarea
                placeholder={`Step ${index + 1}`}
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                className="instruction-text"
              />
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="btn btn-icon btn-danger"
                disabled={recipe.instructions.length === 1}
              >
                <FaTrash />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addInstruction}
            className="btn btn-outline"
          >
            <FaPlus /> Add Step
          </button>
        </div>

        <div className="form-section">
          <h2>Tags</h2>
          <div className="tags-input-container">
            <input
              type="text"
              placeholder="Add tags (press Enter to add)"
              onKeyPress={handleTagInput}
              className="tags-input"
            />
          </div>
          <div className="tags-list">
            {recipe.tags.map((tag, index) => (
              <span key={index} className="tag tag-remove" onClick={() => removeTag(tag)}>
                {tag} ×
              </span>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(`/recipe/${id}`)}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            <FaSave />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRecipe; 
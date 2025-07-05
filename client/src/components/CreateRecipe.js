import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipesAPI } from '../services/api';
import { FaArrowLeft, FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';
import '../styles.css';

function CreateRecipe({ onRecipeCreated }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    ingredients: [{ name: '', amount: '', unit: '' }],
    instructions: [''],
    cookingTime: 30,
    servings: 4,
    difficulty: 'Medium',
    cuisine: '',
    tags: [],
    image: ''
  });

  const handleInputChange = (field, value) => {
    setRecipe(prev => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index][field] = value;
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
    const filteredInstructions = recipe.instructions.filter(inst => inst.trim());

    if (filteredIngredients.length === 0) {
      toast.error('At least one ingredient is required');
      return;
    }

    if (filteredInstructions.length === 0) {
      toast.error('At least one instruction is required');
      return;
    }

    setLoading(true);

    try {
      const recipeData = {
        ...recipe,
        ingredients: filteredIngredients,
        instructions: filteredInstructions
      };

      await recipesAPI.create(recipeData);
      toast.success('Recipe created successfully!');
      
      if (onRecipeCreated) {
        onRecipeCreated();
      }
      
      navigate('/');
    } catch (error) {
      console.error('Failed to create recipe:', error);
      toast.error('Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-recipe">
      <div className="create-recipe-header">
        <button onClick={() => navigate('/')} className="btn btn-text">
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>Create New Recipe</h1>
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
                onChange={(e) => handleInputChange('cookingTime', parseInt(e.target.value))}
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="servings">Servings</label>
              <input
                id="servings"
                type="number"
                value={recipe.servings}
                onChange={(e) => handleInputChange('servings', parseInt(e.target.value))}
                min="1"
              />
            </div>

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
          <button type="button" onClick={addIngredient} className="btn btn-secondary">
            <FaPlus /> Add Ingredient
          </button>
        </div>

        <div className="form-section">
          <h2>Instructions</h2>
          {recipe.instructions.map((instruction, index) => (
            <div key={index} className="instruction-row">
              <span className="step-number">{index + 1}</span>
              <textarea
                placeholder="Enter instruction step..."
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                className="instruction-text"
                rows={2}
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
          <button type="button" onClick={addInstruction} className="btn btn-secondary">
            <FaPlus /> Add Step
          </button>
        </div>

        <div className="form-section">
          <h2>Tags</h2>
          <div className="tags-input-container">
            <input
              type="text"
              placeholder="Press Enter to add tags"
              onKeyPress={handleTagInput}
              className="tags-input"
            />
          </div>
          {recipe.tags.length > 0 && (
            <div className="tags-list">
              {recipe.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-section">
          <h2>Image URL (Optional)</h2>
          <div className="form-group">
            <input
              type="url"
              value={recipe.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="btn btn-outline">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <FaSave />
            {loading ? 'Creating...' : 'Create Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateRecipe; 
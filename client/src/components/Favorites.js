import React, { useEffect, useState } from 'react';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;
    fetch('/api/favorites', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(setFavorites)
      .catch(() => setError('Failed to load favorites'));
    fetch('/api/recipes')
      .then(res => res.json())
      .then(setRecipes)
      .catch(() => {});
  }, [token]);

  function addFavorite(recipeId) {
    fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ recipeId })
    })
      .then(res => res.json())
      .then(setFavorites)
      .catch(() => setError('Failed to add favorite'));
  }

  return (
    <div>
      <h2>Favorites</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {favorites.length === 0 ? (
        <div>No favorites yet</div>
      ) : (
        <ul>
          {favorites.map((id, i) => {
            const recipe = recipes.find(r => r.id === id);
            return recipe ? <li key={i}>{recipe.title}</li> : null;
          })}
        </ul>
      )}
      <h4>Add to Favorites</h4>
      <ul>
        {recipes.map(r => (
          <li key={r.id}>
            {r.title} <button onClick={() => addFavorite(r.id)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Favorites; 
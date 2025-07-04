import React, { useState, useEffect } from 'react';
import Login from './Login';
import Favorites from './Favorites';
import RecipeImageUpload from './RecipeImageUpload';
import Comments from './Comments';
import SearchBar from './SearchBar';
import Profile from './Profile';
import ThemeSwitcher from './ThemeSwitcher';
import Notifications from './Notifications';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [search, setSearch] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    fetch('/api/recipes')
      .then(res => res.json())
      .then(setRecipes)
      .catch(() => setError('Failed to load recipes'));
  }, []);

  function addRecipe() {
    const token = localStorage.getItem('token');
    const title = prompt('Recipe title?');
    const description = prompt('Recipe description?');
    if (!title || !description) return;
    fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ title, description })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add recipe');
        return res.json();
      })
      .then(recipe => setRecipes(r => [...r, recipe]))
      .catch(() => setError('Failed to add recipe'));
  }

  function handleSearch(q) {
    setSearch(q);
    if (!q) {
      fetch('/api/recipes')
        .then(res => res.json())
        .then(setRecipes)
        .catch(() => setError('Failed to load recipes'));
      return;
    }
    fetch('/api/search?q=' + encodeURIComponent(q))
      .then(res => res.json())
      .then(setRecipes)
      .catch(() => setError('Search failed'));
  }

  function handleLogout() {
    localStorage.removeItem('token');
    window.location.reload();
  }

  if (!loggedIn) return <Login />;
  if (showProfile) return <div className="app-main"><Profile onGoHome={() => setShowProfile(false)} /></div>;

  return (
    <div className="app-main">
      <div className="header-row">
        <ThemeSwitcher className="theme-switcher" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={handleLogout} className="login-btn">Logout</button>
        </div>
        <Notifications className="notifications" />
      </div>
      <h1>RecipeBook</h1>
      <div style={{ marginBottom: 16 }}>
        <button onClick={addRecipe}>Add Recipe</button>
        <button onClick={() => setShowProfile(true)}>Profile</button>
      </div>
      <SearchBar onSearch={handleSearch} />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <RecipeImageUpload />
      <div className="favorites-section">
        <Favorites />
      </div>
      {/* Show search results or no results message */}
      <div>
        <h2>Search Results</h2>
        <ul className="recipe-list">
          {recipes.length === 0 ? (
            <div>No recipes found.</div>
          ) : (
            recipes.map((r, i) => (
              <li className="recipe-card" key={i}>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{r.title}</div>
                <div style={{ margin: '8px 0' }}>{r.description}</div>
                <Comments recipeId={r.id} />
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App; 
import React, { useState, useEffect } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Fetch all recipes for autocomplete
    fetch('/api/recipes')
      .then(res => res.json())
      .then(data => setAllRecipes(data.map(r => r.title)))
      .catch(() => setAllRecipes([]));
  }, []);

  function handleInput(e) {
    const value = e.target.value;
    setQuery(value);
    if (value.trim() === '') {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    const filtered = allRecipes.filter(title =>
      title.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
    setShowDropdown(filtered.length > 0);
  }

  function handleSearch(val) {
    const searchVal = typeof val === 'string' ? val : query;
    onSearch(searchVal);
    setShowDropdown(false);
  }

  function handleSuggestionClick(suggestion) {
    setQuery(suggestion);
    handleSearch(suggestion);
  }

  return (
    <div className="search-bar-container">
      <div style={{ display: 'flex', width: '100%' }}>
        <input
          className="search-bar-input"
          value={query}
          onChange={handleInput}
          placeholder="Search recipes"
          onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
          style={{ width: '100%' }}
          onFocus={() => setShowDropdown(suggestions.length > 0)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        />
        <button className="search-bar-btn" onClick={handleSearch}>Search</button>
      </div>
      {showDropdown && (
        <ul className="search-bar-dropdown">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onMouseDown={() => handleSuggestionClick(s)}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar; 
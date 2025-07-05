import React, { useState } from 'react';

function RecipeImageUpload() {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  function handleUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setError(null);
    } else {
      setError('No file selected.');
    }
  }

  return (
    <div>
      <label>Recipe Image: </label>
      <input type="file" onChange={handleUpload} />
      {image && <img src={image} alt="Preview" style={{ maxWidth: 100, display: 'block', marginTop: 10 }} />}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default RecipeImageUpload; 
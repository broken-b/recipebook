import React, { useState } from 'react';

function ThemeSwitcher() {
  const [dark, setDark] = useState(false);
  function toggleTheme() {
    setDark(d => {
      const newDark = !d;
      document.body.style.background = newDark ? '#222' : '#f99';
      return newDark;
    });
  }
  return (
    <button onClick={toggleTheme} style={{ margin: 10 }}>
      Switch Theme
    </button>
  );
}

export default ThemeSwitcher; 
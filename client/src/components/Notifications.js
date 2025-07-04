import React, { useEffect, useState } from 'react';

function Notifications() {
  const [msg, setMsg] = useState('');
  useEffect(() => {
    fetch('/api/recipes')
      .then(res => res.json())
      .then(recipes => setMsg(`You have ${recipes.length} recipes.`))
      .catch(() => setMsg('Could not load recipe count.'));
  }, []);
  return <div style={{ background: '#ff0', color: '#900', padding: 5 }}>{msg}</div>;
}

export default Notifications; 
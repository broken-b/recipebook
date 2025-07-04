import React, { useState, useEffect } from 'react';

function Comments({ recipeId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!recipeId) return;
    fetch(`/api/comments?recipeId=${recipeId}`)
      .then(res => res.json())
      .then(setComments)
      .catch(() => setError('Failed to load comments'));
  }, [recipeId]);

  function addComment() {
    if (!text.trim()) {
      setError('Comment cannot be empty.');
      return;
    }
    fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ recipeId, text })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to add comment');
        return res.json();
      })
      .then(comment => {
        setComments(c => [...c, comment]);
        setText('');
        setError(null);
      })
      .catch(() => setError('Failed to add comment'));
  }

  return (
    <div>
      <h3>Comments</h3>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Add comment" />
      <button onClick={addComment}>Add</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {comments.map((c, i) => <li key={i}>{c.text} <small>by {c.author}</small></li>)}
      </ul>
    </div>
  );
}

export default Comments; 
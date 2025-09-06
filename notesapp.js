import React, { useState, useEffect } from 'react';

function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:4000/notes';

  // Fetch notes from backend
  const fetchNotes = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(() => setError('Failed to fetch notes'));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Add or update note
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError(null);

    const noteData = { title, content };

    if (editingId) {
      // Update note
      fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      })
        .then(res => res.json())
        .then(() => {
          fetchNotes();
          resetForm();
        })
        .catch(() => setError('Failed to update note'));
    } else {
      // Create note
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      })
        .then(res => res.json())
        .then(() => {
          fetchNotes();
          resetForm();
        })
        .catch(() => setError('Failed to add note'));
    }
  };

  // Delete note
  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(() => fetchNotes())
      .catch(() => setError('Failed to delete note'));
  };

  // Edit note
  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
  };

  // Reset form
  const resetForm = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
    setError(null);
  };

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Notes App</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          {editingId ? 'Update Note' : 'Add Note'}
        </button>
        {editingId && (
          <button type="button" onClick={resetForm} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
            Cancel
          </button>
        )}
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notes.map(note => (
          <li key={note._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '0.5rem' }}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small>{new Date(note.createdAt).toLocaleString()}</small>
            <div style={{ marginTop: '0.5rem' }}>
              <button onClick={() => handleEdit(note)} style={{ marginRight: '1rem' }}>Edit</button>
              <button onClick={() => handleDelete(note._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotesApp;
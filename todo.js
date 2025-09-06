// todo-backend.js - Node.js Express backend for To-Do App
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// In-memory todos data (use a database in production)
let todos = [
  { id: 1, task: "Learn JavaScript", completed: false },
  { id: 2, task: "Build a React app", completed: false },
];

// GET all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST create new todo
app.post('/todos', (req, res) => {
  const { task, completed = false } = req.body;
  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }
  const newTodo = {
    id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
    task,
    completed
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// DELETE todo by ID
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: "To-Do not found" });
  }
  const deletedTodo = todos.splice(todoIndex, 1);
  res.json({ message: "To-Do deleted", todo: deletedTodo[0] });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});</content>
</create_file>

<create_file>
<path>todo-app.html</path>
<content><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>To-Do App - React + API</title>
    <!-- Tailwind CSS for styling -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- React CDN -->
    <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
    <!-- Babel for JSX -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            font-family: 'Poppins', sans-serif;
        }
        .todo-animation {
            transition: all 0.3s ease;
        }
        .todo-completed {
            text-decoration: line-through;
            opacity: 0.6;
        }
    </style>
</head>
<body class="p-8">
    <div id="root" class="max-w-2xl mx-auto"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;

        // TodoItem Component
        function TodoItem({ todo, onDelete, onToggle }) {
            return (
                <div className={`bg-white rounded-lg shadow-md p-4 mb-4 todo-animation ${todo.completed ? 'todo-completed' : ''}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => onToggle(todo.id)}
                                className="mr-4 w-5 h-5 text-purple-600 rounded focus:ring-0"
                            />
                            <span className="text-lg text-gray-800">{todo.task}</span>
                        </div>
                        <button
                            onClick={() => onDelete(todo.id)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                </div>
            );
        }

        // TodoForm Component
        function TodoForm({ onAdd }) {
            const [task, setTask] = useState('');

            const handleSubmit = (e) => {
                e.preventDefault();
                if (task.trim()) {
                    onAdd(task.trim());
                    setTask('');
                }
            };

            return (
                <form onSubmit={handleSubmit} className="mb-8 bg-white rounded-lg shadow-md p-6">
                    <div className="flex">
                        <input
                            type="text"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                            placeholder="Add a new task..."
                            className="flex-grow px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="bg-purple-600 text-white px-6 py-3 rounded-r-lg hover:bg-purple-700 transition-colors duration-200 font-semibold"
                        >
                            Add
                        </button>
                    </div>
                </form>
            );
        }

        // TodoList Component
        function TodoList({ todos, onDelete, onToggle }) {
            return (
                <div>
                    {todos.length === 0 ? (
                        <p className="text-white text-lg text-center">No tasks yet. Add one above!</p>
                    ) : (
                        todos.map(todo => (
                            <TodoItem
                                key={todo.id}
                                todo={todo}
                                onDelete={onDelete}
                                onToggle={onToggle}
                            />
                        ))
                    )}
                </div>
            );
        }

        // App Component
        function App() {
            const [todos, setTodos] = useState([]);
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState(null);

            // Fetch todos from backend
            const fetchTodos = () => {
                setLoading(true);
                fetch('http://localhost:3000/todos')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        setTodos(data);
                        setLoading(false);
                    })
                    .catch(err => {
                        setError(err.message);
                        setLoading(false);
                    });
            };

            // Add new todo
            const addTodo = (task) => {
                fetch('http://localhost:3000/todos', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        task,
                        completed: false
                    }),
                })
                .then(response => response.json())
                .then(newTodo => {
                    setTodos([...todos, newTodo]);
                })
                .catch(err => setError('Failed to add todo: ' + err.message));
            };

            // Delete todo
            const deleteTodo = (id) => {
                fetch(`http://localhost:3000/todos/${id}`, {
                    method: 'DELETE',
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(() => {
                    setTodos(todos.filter(todo => todo.id !== id));
                })
                .catch(err => setError('Failed to delete todo: ' + err.message));
            };

            // Toggle todo completion (note: this is not implemented on backend, so just update locally)
            const toggleTodo = (id) => {
                setTodos(todos.map(todo =>
                    todo.id === id ? { ...todo, completed: !todo.completed } : todo
                ));
            };

            // Fetch todos on component mount
            useEffect(() => {
                fetchTodos();
            }, []);

            if (loading) return <p className="text-white text-center text-xl">Loading todos...</p>;
            if (error) return <p className="text-red-300 text-center text-xl">Error: {error}</p>;

            return (
                <div>
                    <header className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">To-Do App</h1>
                        <p className="text-purple-200">Manage your tasks with React and Node.js</p>
                    </header>
                    <TodoForm onAdd={addTodo} />
                    <TodoList todos={todos} onDelete={deleteTodo} onToggle={toggleTodo} />
                    <footer className="text-center mt-8">
                        <p className="text-purple-200">Total tasks: {todos.length}</p>
                    </footer>
                </div>
            );
        }

        // Render the App
        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html></content>
</create_file>
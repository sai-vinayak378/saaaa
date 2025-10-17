import React from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  return (
    <div className="App" style={{ maxWidth: 900, margin: '20px auto', padding: 10 }}>
      <h1>Student Task Manager</h1>
      <TaskForm />
      <hr />
      <TaskList />
    </div>
  );
}

export default App;

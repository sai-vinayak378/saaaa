import React, { useState } from 'react';
import axios from 'axios';

const defaultTask = { title: '', description: '', dueDate: '', status: 'Pending' };

const TaskForm = ({ onAdded }) => {
  const [task, setTask] = useState(defaultTask);
  const [saving, setSaving] = useState(false);
  const handleChange = e => setTask({ ...task, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.title.trim()) return alert('Title required');
    try {
      setSaving(true);
      await axios.post('/api/tasks', task); // proxy is used if set
      setTask(defaultTask);
      if (onAdded) onAdded();
      // dispatch a custom event so TaskList could refresh if not using prop
      window.dispatchEvent(new Event('taskAdded'));
    } catch (err) {
      console.error(err);
      alert('Error adding task');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
      <input name="title" placeholder="Title" value={task.title} onChange={handleChange} required />
      <input name="description" placeholder="Description" value={task.description} onChange={handleChange} />
      <input name="dueDate" type="date" value={task.dueDate} onChange={handleChange} />
      <select name="status" value={task.status} onChange={handleChange}>
        <option>Pending</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>
      <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Add Task'}</button>
    </form>
  );
};

export default TaskForm;

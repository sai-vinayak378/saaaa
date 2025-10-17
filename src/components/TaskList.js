import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const fetchTasks = async () => {
    try {
      const params = {};
      if (filter !== 'All') params.status = filter;
      if (search.trim()) params.search = search;
      const res = await axios.get('/api/tasks', { params });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
    const onAdd = () => fetchTasks();
    window.addEventListener('taskAdded', onAdd);
    return () => window.removeEventListener('taskAdded', onAdd);
  }, [filter, search]);

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await axios.delete(`/api/tasks/${id}`);
    fetchTasks();
  };

  const updateStatus = async (id, status) => {
    await axios.put(`/api/tasks/${id}`, { status });
    fetchTasks();
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <input placeholder="Search title..." value={search} onChange={e => setSearch(e.target.value)} />
        <button onClick={fetchTasks}>Search</button>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {tasks.length === 0 ? <p>No tasks found</p> : tasks.map(task => (
          <div key={task._id} style={{ border: '1px solid #ddd', padding: 10, borderRadius: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0 }}>{task.title}</h3>
              <small>{new Date(task.createdAt).toLocaleString()}</small>
            </div>
            <p style={{ margin: '6px 0' }}>{task.description}</p>
            <p style={{ margin: '6px 0' }}>
              Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'} | Status: <strong>{task.status}</strong>
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {task.status !== 'Completed' && (
                <button onClick={() => updateStatus(task._id, 'Completed')}>Mark Completed</button>
              )}
              <button onClick={() => updateStatus(task._id, 'In Progress')}>Mark In Progress</button>
              <button onClick={() => deleteTask(task._id)} style={{ background: '#f44', color: '#fff' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;

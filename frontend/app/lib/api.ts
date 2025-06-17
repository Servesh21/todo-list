const API_BASE = 'http://localhost:5000/api/tasks';

// Reuse Task type from TaskForm
import type { Task } from '../components/TaskForm';

export async function fetchTasks() {
  const res = await fetch(API_BASE, {
    method: 'GET',
    credentials: 'include',
  });
  return res.json();
}

export async function addTask(task: Task) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  console.log('Response from addTask:', res);
  return res.json();
}

export async function markAsDone(id: number) {
  const res = await fetch(`${API_BASE}/${id}/done`, {
    method: 'PATCH',
    credentials: 'include',
  });
  console.log('Response from markAsDone:', res);
  return res.json();
}

export async function markasUndone(id: number) {
  const res = await fetch(`${API_BASE}/${id}/undone`, {
    method: 'PATCH',
    credentials: 'include',
  });
  return res.json();
}

export async function fetchUpcoming(range: 'week' | 'month') {
  const res = await fetch(`${API_BASE}/upcoming/${range}`, {
    method: 'GET',
    credentials: 'include',
  });
  return res.json();
}

export const deleteTask = async (id: number) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete task');
  return data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return await res.json();
};

export const registerUser = async (email: string, password: string) => {
  console.log('Registering user:', { email, password });
  const res = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  console.log('Response from registerUser:', res);

  return await res.json();
};

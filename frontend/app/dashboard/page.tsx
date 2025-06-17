'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/UseAuthStore';
import TaskForm, { Task as FormTask } from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskOverview from '../components/TaskOverview';
import { fetchTasks, addTask, markAsDone, fetchUpcoming, markasUndone } from '../lib/api';
import type { Task as ListTask } from '../components/TaskList';

export default function DashboardPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const [tasks, setTasks] = useState<ListTask[]>([]);
  const [upcomingWeek, setUpcomingWeek] = useState<ListTask[]>([]); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [upcomingMonth, setUpcomingMonth] = useState<ListTask[]>([]); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [view, setView] = useState<'today' | 'upcoming'>('today'); // Toggle view

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else {
      loadTasks();
      loadUpcoming();
    }
    // Add router to dependency array for exhaustive-deps
  }, [isAuthenticated, router]);

  const loadTasks = async () => {
    const data = await fetchTasks();
    setTasks(data);
  };

  const loadUpcoming = async () => {
    const week = await fetchUpcoming('week');
    const month = await fetchUpcoming('month');
    setUpcomingWeek(week);
    setUpcomingMonth(month);
  };

  const handleAddTask = async (task: FormTask) => {
    await addTask(task);
    loadTasks();
    loadUpcoming();
  };

  const handlemarkAsDone = async (id: number) => {
    await markAsDone(id);
    loadTasks();
  };

  const MarkAsundone = async (id: number) => {
    await markasUndone(id);
    loadTasks();
  };
  
  const handleDelete = (id: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== id)); // remove task from state
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with logout button */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Taskify Dashboard</h1>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Task Form */}
          <div className="lg:col-span-1">
            <TaskForm onAdd={handleAddTask} />
          </div>

          {/* Right column - Task List/Overview */}
          <div className="lg:col-span-2">
            {/* View Toggle Buttons */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setView('today')}
                  className={`flex-1 py-2 rounded-md font-medium transition text-center ${
                    view === 'today' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todays Tasks
                </button>
                <button
                  onClick={() => setView('upcoming')}
                  className={`flex-1 py-2 rounded-md font-medium transition text-center ${
                    view === 'upcoming' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Upcoming Tasks
                </button>
              </div>
            </div>

            {/* Conditionally render TaskList or TaskOverview */}
            <div className="bg-white rounded-lg shadow-md">
              {view === 'today' ? (
                <TaskList 
                  tasks={tasks} 
                  markasdone={handlemarkAsDone} 
                  markasundone={MarkAsundone} 
                  onDelete={handleDelete} 
                />
              ) : (
                <TaskOverview 

                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
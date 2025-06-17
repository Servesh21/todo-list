'use client';

import { deleteTask } from '../lib/api';
import { useState } from 'react';
import { Check, X, Trash2, RefreshCw, Calendar, Clock, AlertCircle } from 'lucide-react';

export interface Task {
  id: number;
  title: string;
  start_date: string | Date;
  recurrence_type: string;
  interval: number;
  endDate?: string | Date | null;
  completed: boolean;
}

export default function TaskList({
  tasks,
  markasdone,
  markasundone,
  onDelete,
}: {
  tasks: Task[];
  markasdone: (id: number) => void;
  markasundone: (id: number) => void;
  onDelete?: (id: number) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState({
    pending: false,
    completed: false
  });

  if (!Array.isArray(tasks)) return <p>Invalid task data</p>;
  
  const pending = tasks.filter((task) => !task.completed);
  const completed = tasks.filter((task) => task.completed);

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      if (onDelete) onDelete(id);
      setDeleteConfirmId(null);
    } catch (error) {
      alert('Failed to delete task');
      console.error(error);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRecurrenceText = (task: Task) => {
    if (task.recurrence_type === 'none') return null;
    
    let text = '';
    switch (task.recurrence_type) {
      case 'daily':
        text = task.interval > 1 ? `Every ${task.interval} days` : 'Daily';
        break;
      case 'weekly':
        text = task.interval > 1 ? `Every ${task.interval} weeks` : 'Weekly';
        break;
      case 'monthly':
        text = task.interval > 1 ? `Every ${task.interval} months` : 'Monthly';
        break;
      case 'yearly':
        text = task.interval > 1 ? `Every ${task.interval} years` : 'Yearly';
        break;
      default:
        text = `${task.recurrence_type} (${task.interval})`;
    }
    
    return text;
  };

  const getPriorityColor = (task: Task) => {
    // This is a placeholder implementation - you might want to add a priority field to your Task interface
    const now = new Date();
    const start = new Date(task.start_date);
    const daysDiff = Math.ceil((start.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return 'border-l-red-500'; // Overdue
    if (daysDiff < 3) return 'border-l-amber-500'; // Soon
    return 'border-l-green-500'; // Plenty of time
  };

  const renderTask = (task: Task) => {
    const priorityColor = getPriorityColor(task);
    const recurrenceText = getRecurrenceText(task);
    
    return (
      <li
        key={task.id}
        className={`bg-white rounded-lg shadow-sm border border-gray-100 ${priorityColor} border-l-4 mb-3 overflow-hidden transition-all hover:shadow-md`}
      >
        <div className="p-4 flex items-start gap-3">
          <button
            onClick={() => {
              if (task.completed) {
                markasundone(task.id);
              } else {
                markasdone(task.id);
              }
            }}
            className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
              task.completed 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'border-2 border-gray-300 hover:border-green-500'
            }`}
            aria-label={task.completed ? "Mark as not done" : "Mark as done"}
          >
            {task.completed && <Check size={16} />}
          </button>
          
          <div className="flex-grow">
            <h3 className={`font-medium text-base ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h3>
            
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar size={14} className="text-gray-400" />
                <span>{formatDate(task.start_date)}</span>
              </div>
              
              {recurrenceText && (
                <div className="flex items-center gap-1">
                  <RefreshCw size={14} className="text-gray-400" />
                  <span>{recurrenceText}</span>
                </div>
              )}
              
              {task.endDate && (
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-gray-400" />
                  <span>Until {formatDate(task.endDate)}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0 flex items-center gap-1">
            {deleteConfirmId === task.id ? (
              <>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="p-2 text-white bg-red-500 rounded hover:bg-red-600 transition-colors"
                  aria-label="Confirm delete"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="p-2 text-gray-500 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                  aria-label="Cancel delete"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setDeleteConfirmId(task.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Delete task"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </li>
    );
  };

  // Make sure we're properly filtering tasks
  const getFilteredTasks = () => {
    switch (filter) {
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  };
  
  const filteredTasks = getFilteredTasks();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">My Tasks</h2>
        
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-200`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 text-sm font-medium ${
              filter === 'pending' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border-t border-b border-gray-200`}
          >
            Pending ({pending.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              filter === 'completed' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-200`}
          >
            Completed ({completed.length})
          </button>
        </div>
      </div>
      
      {filter !== 'completed' && pending.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div 
            className="p-3 border-b border-gray-100 flex justify-between items-center cursor-pointer"
            onClick={() => setIsCollapsed({...isCollapsed, pending: !isCollapsed.pending})}
          >
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-500" />
              Pending Tasks ({pending.length})
            </h3>
            <button className="text-gray-400 hover:text-gray-600">
              {isCollapsed.pending ? '▼' : '▲'}
            </button>
          </div>
          
          {!isCollapsed.pending && (
            <ul className="p-3">
              {filter === 'all' ? pending.map(renderTask) : filteredTasks.map(renderTask)}
              {pending.length === 0 && <p className="text-gray-500 p-3">No pending tasks</p>}
            </ul>
          )}
        </div>
      )}
      
      {filter !== 'pending' && completed.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div 
            className="p-3 border-b border-gray-100 flex justify-between items-center cursor-pointer"
            onClick={() => setIsCollapsed({...isCollapsed, completed: !isCollapsed.completed})}
          >
            <h3 className="font-medium text-gray-800 flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              Completed Tasks ({completed.length})
            </h3>
            <button className="text-gray-400 hover:text-gray-600">
              {isCollapsed.completed ? '▼' : '▲'}
            </button>
          </div>
          
          {!isCollapsed.completed && (
            <ul className="p-3">
              {filter === 'all' ? completed.map(renderTask) : filteredTasks.map(renderTask)}
              {completed.length === 0 && <p className="text-gray-500 p-3">No completed tasks</p>}
            </ul>
          )}
        </div>
      )}
      
      {((filter === 'pending' && pending.length === 0) || 
         (filter === 'completed' && completed.length === 0) ||
         (filter === 'all' && tasks.length === 0)) && (
        <div className="text-center p-8 bg-white rounded-lg border border-gray-100 shadow-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
            <AlertCircle size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-1">No tasks found</h3>
          <p className="text-gray-500">
            {filter === 'pending' ? 'You have no pending tasks.' : 
             filter === 'completed' ? 'You have no completed tasks.' : 
             'Start by adding your first task.'}
          </p>
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from 'lucide-react';
import { auth, db } from '@/firebase/firebase';
import { saveUserData, loadUserData } from '@/lib/firestore-operations';
import { doc, getDoc } from 'firebase/firestore';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setTodos(data.todoList || []);
          }
        }
      } catch (error) {
        console.error('Error loading todos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []);

  const saveTodos = async (updatedTodos: Todo[]) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await saveUserData(user.uid, {
          todoList: updatedTodos
        });
      }
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  const handleAddTodo = async () => {
    if (newTodo.trim() !== '') {
      const newTodoItem: Todo = {
        id: Date.now().toString(),
        text: newTodo,
        completed: false
      };
      const updatedTodos = [...todos, newTodoItem];
      setTodos(updatedTodos);
      setNewTodo('');
      await saveTodos(updatedTodos);
    }
  };

  const handleRemoveTodo = async (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    await saveTodos(updatedTodos);
  };

  const handleToggleTodo = async (id: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    await saveTodos(updatedTodos);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <input
          type="text"
          className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 block w-full rounded-md px-4 py-2 border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder:text-gray-500"
          placeholder="Add a todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
        />
        <button
          onClick={handleAddTodo}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-blue-900 px-4 py-2 text-sm font-medium text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Add
        </button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between py-2 border-b border-gray-200">
            <div className="flex items-center">
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={() => handleToggleTodo(todo.id)}
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-3 ${
                  todo.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {todo.text}
              </label>
            </div>
            <button
              onClick={() => handleRemoveTodo(todo.id)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
            >
              <Trash2 />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

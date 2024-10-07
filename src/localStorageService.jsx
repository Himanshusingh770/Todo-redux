// src/localStorageService.js

const LOCAL_STORAGE_KEY = 'todos';

export const getTodos = () => {
  const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedTodos) {
    try {
      const parsedTodos = JSON.parse(storedTodos);
      return Array.isArray(parsedTodos) ? parsedTodos : [];
    } catch (error) {
      console.error('Error parsing todos from localStorage', error);
      return [];
    }
  }
  return [];
};

export const setTodos = (todos) => {
  if (Array.isArray(todos)) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  } else {
    console.error('Invalid data format for todos. Expected an array.');
  }
};

export const removeTodos = () => {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
};

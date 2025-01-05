import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  todos: [],
  loading: true,
  error: '',
  showEditAddModal: false,
  showDeleteConfirmModal: false,
  editTodo: null,
  todoToDelete: null,
};

// Utility function to update colors based on time
const updateTodoColors = (todos) => {
  const currentTime = Date.now();
  return todos.map((todo) => {
    if (todo.completed) {
      return { ...todo, color: 'green' }; // Completed, set to green
    } else if (new Date(todo.time).getTime() < currentTime) {
      return { ...todo, color: 'red' }; // Past time, set to red
    } else {
      return { ...todo, color: 'violet' }; // Future time, set to violet
    }
  });
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action) => {
      state.todos = updateTodoColors(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addTodo: (state, action) => {
      const newTodo = { ...action.payload, id: Date.now(), completed: false, color: 'violet' };
      state.todos.push(newTodo);
      state.todos = updateTodoColors(state.todos);
    },
    editTodo: (state, action) => {
      const { id, updatedTodo } = action.payload;
      state.todos = state.todos.map((todo) => (todo.id === id ? updatedTodo : todo));
      state.todos = updateTodoColors(state.todos);
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
    toggleComplete: (state, action) => {
      state.todos = state.todos.map((todo) => {
        if (todo.id === action.payload) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });
      state.todos = updateTodoColors(state.todos);
    },
  },
});

export const {
  setTodos,
  setLoading,
  setError,
  addTodo,
  editTodo,
  deleteTodo,
  toggleComplete,
} = todosSlice.actions;

export default todosSlice.reducer;

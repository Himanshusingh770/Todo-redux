import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice'; // Ensure the correct path to your slice

const store = configureStore({
  reducer: {
    todos: todosReducer,
    // Add more reducers here if needed
  },
});

export default store;

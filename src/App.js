import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import TodoList from './components/TodoList';
import AddEditTodoModal from './components/AddEditTodoModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import Header from './components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PlusCircle } from 'react-bootstrap-icons';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  setTodos,
  setLoading,
  setShowEditAddModal,
  setEditTodo,
  setShowDeleteConfirmModal,
  setTodoToDelete,
  deleteTodo,
  setError,
  addTodo,
} from './redux/todosSlice';

const App = () => {
  const dispatch = useDispatch();
  const {
    todos,
    loading,
    error,
    showEditAddModal,
    editTodo,
    showDeleteConfirmModal,
    todoToDelete,
  } = useSelector((state) => state.todos);

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      try {
        const parsedTodos = JSON.parse(storedTodos);
        if (Array.isArray(parsedTodos)) {
          dispatch(setTodos(parsedTodos));
        } else {
          console.error("Invalid data format in localStorage");
        }
      } catch (error) {
        console.error("Error parsing todos from localStorage", error);
      }
    }
    dispatch(setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    } else {
      localStorage.removeItem('todos');
    }
  }, [todos]);

  // Periodic check to update todo colors when time is past
  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(setTodos([...todos])); // Trigger an update to refresh color based on time
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, [todos, dispatch]);

  const handleAddEditTodo = (newTodo = null) => {
    if (newTodo && !isValidDate(newTodo.time)) {
      dispatch(setError('Please enter a valid date and time.'));
      return;
    }
    if (newTodo && newTodo.title.trim() === '') {
      dispatch(setError('Title cannot be empty.'));
      return;
    }
    dispatch(setError(''));

    if (editTodo && newTodo) {
      dispatch(editTodo({ id: editTodo.id, updatedTodo: newTodo }));
      dispatch(setEditTodo(null));
    } else if (newTodo) {
      dispatch(addTodo({ ...newTodo, color: 'violet' })); // Set color to violet by default
    }
    dispatch(setShowEditAddModal(false));
  };

  const handleConfirmDelete = () => {
    dispatch(deleteTodo(todoToDelete));
    dispatch(setTodoToDelete(null));
    dispatch(setShowDeleteConfirmModal(false));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.getTime() > Date.now();
  };

  return (
    <div className="container">
      <Header />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Today</h1>
        <Button
          variant="outline-primary"
          className="rounded-circle p-0 border-0"
          style={{ width: '50px', height: '50px', backgroundColor: 'white' }}
          onClick={() => {
            dispatch(setEditTodo(null));
            dispatch(setShowEditAddModal(true));
          }}
        >
          <PlusCircle className="text-primary" size={40} />
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <TodoList />

      <AddEditTodoModal
        show={showEditAddModal}
        onHide={() => dispatch(setShowEditAddModal(false))}
        addTodo={handleAddEditTodo}
        editTodo={editTodo}
      />

      <ConfirmDeleteModal
        showModal={showDeleteConfirmModal}
        onHide={() => dispatch(setShowDeleteConfirmModal(false))}
        onDelete={handleConfirmDelete}
        message="Do you really want to delete this todo?"
      />
    </div>
  );
};

export default App;

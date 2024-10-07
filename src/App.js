import React, { useEffect, useState } from 'react';
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
  deleteTodo,
  setError,
  addTodo,
} from './redux/todosSlice';
import { getTodos, setTodos as setLocalTodos, removeTodos } from './localStorageService'; // Import your local storage service

const App = () => {
  const dispatch = useDispatch();
  const { todos, loading, error } = useSelector((state) => state.todos);
  const [showEditAddModal, setShowEditAddModal] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  useEffect(() => {
    const parsedTodos = getTodos(); // Use the service to get todos
    dispatch(setTodos(parsedTodos));
    dispatch(setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (todos.length > 0) {
      setLocalTodos(todos); // Use the service to set todos
    } else {
      removeTodos(); // Use the service to remove todos from local storage
    }
  }, [todos]); 

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(setTodos([...todos]));   // Trigger an update to refresh color based on time
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
      setEditTodo(null);
    } else if (newTodo) {
      dispatch(addTodo({ ...newTodo, color: 'violet' }));
    }
    setShowEditAddModal(false);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteTodo(todoToDelete));
    setTodoToDelete(null);
    setShowDeleteConfirmModal(false);
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
            setEditTodo(null);
            setShowEditAddModal(true);
          }}
        >
          <PlusCircle className="text-primary" size={40} />
        </Button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <TodoList
        setEditTodo={setEditTodo}
        setShowEditAddModal={setShowEditAddModal}
        setShowDeleteConfirmModal={setShowDeleteConfirmModal}
        setTodoToDelete={setTodoToDelete}
      />

      <AddEditTodoModal
        show={showEditAddModal}
        onHide={() => setShowEditAddModal(false)}
        addTodo={handleAddEditTodo}
        editTodo={editTodo}
      />

      <ConfirmDeleteModal
        showModal={showDeleteConfirmModal}
        onHide={() => setShowDeleteConfirmModal(false)}
        onDelete={handleConfirmDelete}
        message="Do you really want to delete this todo?"
      />
    </div>
  );
};

export default App;

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleComplete } from '../redux/todosSlice';
import { CheckCircleFill, PencilSquare, TrashFill, Clock } from 'react-bootstrap-icons';
import './TodoList.css'; // Ensure to define your custom styles here
import moment from 'moment';

const TodoList = ({ setEditTodo, setShowEditAddModal, setShowDeleteConfirmModal, setTodoToDelete }) => {
  const dispatch = useDispatch();
  const { todos } = useSelector((state) => state.todos);

  const handleToggleComplete = (id) => {
    dispatch(toggleComplete(id));
  };

  const handleEdit = (todo) => {
    setEditTodo(todo);
    setShowEditAddModal(true);
  };

  const handleDelete = (todoId) => {
    setTodoToDelete(todoId);
    setShowDeleteConfirmModal(true);
  };

  return (
    <div className="todo-list">
      {todos.length === 0 ? (
        <div className="text-center">No todos. Add a new one!</div>
      ) : (
        todos
          .slice() // Create a shallow copy to avoid mutating the original array
          .reverse() // Reverse the order to show the latest todos at the top
          .map((todo) => (
            <div key={todo.id} className={`todo-item ${todo.color} d-flex align-items-start p-3 border rounded mb-2`}>
              <div className="todo-main d-flex align-items-start flex-grow-1">
                <CheckCircleFill
                  className={`check-icon ${todo.completed ? 'text-success' : 'text-secondary'} mr-2`}
                  onClick={() => handleToggleComplete(todo.id)}
                  style={{ cursor: 'pointer' }}
                />
                <div className="todo-content">
                  <div className={`todo-title ${todo.completed ? 'completed' : ''}`}>
                    {todo.title}
                  </div>
                  <div className="todo-time text-muted d-flex align-items-center">
                    <Clock className="me-2" />
                    <span className="time-text">
                              {moment(todo.time).format('MMM D, YYYY')}
                     </span>
                    &nbsp;
                    {moment(todo.time).format('hh:mm A')}
                  </div>
                </div>
              </div>
              <div className="button-group d-flex align-items-center ml-3">
                <div
                  className={`color-dot ${todo.color}`}
                  style={{ width: '10px', height: '10px', borderRadius: '50%', marginRight: '10px' }}
                ></div>
                <PencilSquare
                  className="edit-button m-2 fs-4"
                  onClick={() => handleEdit(todo)}
                  style={{ cursor: 'pointer' }}
                />
                <TrashFill
                  className="edit-button text-danger fs-4"
                  onClick={() => handleDelete(todo.id)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default TodoList;

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addTodo, editTodo as editTodoAction } from '../redux/todosSlice';

const AddEditTodoModal = ({ show, onHide, editTodo }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [error, setLocalError] = useState('');

  useEffect(() => {
    if (show && !editTodo) {
      // Reset fields when opening the modal for adding a new todo
      setTitle('');
      setTime('');
      setLocalError('');
    } else if (editTodo) {
      // Set fields to editTodo values when editing an existing todo
      setTitle(editTodo.title);
      setTime(editTodo.time);
    }
  }, [show, editTodo]);

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date.getTime() > Date.now();
  };

  const handleSave = () => {
    if (title.trim() === '') {
      setLocalError('Title is required');
      return;
    }
    if (!isValidDate(time)) {
      setLocalError('Please enter a valid future date and time.');
      return;
    }
    setLocalError('');

    const newTodo = {
      title,
      time,
    };

    if (editTodo) {
      dispatch(editTodoAction({ id: editTodo.id, updatedTodo: { ...editTodo, ...newTodo } }));
    } else {
      dispatch(addTodo(newTodo));
    }

    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editTodo ? 'Edit Todo' : 'Add Todo'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="todoTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              as="textarea"
              rows={8}
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={!!error && title.trim() === ''}
            />
            <Form.Control.Feedback type="invalid">
              Title is required.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="todoTime">
            <Form.Label>Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              isInvalid={!!error && !isValidDate(time)}
              min={new Date().toISOString().slice(0, 16)} // Disable past dates and times
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid future date and time.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {editTodo ? 'Save Changes' : 'Add Todo'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditTodoModal;

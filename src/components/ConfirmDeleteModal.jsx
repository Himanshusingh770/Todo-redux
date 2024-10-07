import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setShowDeleteConfirmModal } from '../redux/todosSlice';
import './TodoList.css';;
const ConfirmDeleteModal = ({ onDelete, message }) => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.todos.showDeleteConfirmModal);

  return (
    <Modal className='delete-model' show={show} onHide={() => dispatch(setShowDeleteConfirmModal(false))}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(setShowDeleteConfirmModal(false))}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;

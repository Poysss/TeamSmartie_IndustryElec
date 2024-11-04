import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currentCard, setCurrentCard] = useState({});
  const [form, setForm] = useState({ studentID: '', subject: '', category: '' });

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    const response = await axios.get('http://localhost:8080/api/flashcards');
    setFlashcards(response.data);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    await axios.post('http://localhost:8080/api/flashcards', form);
    fetchFlashcards();
    setShowAdd(false);
    setForm({ studentID: '', subject: '', category: '' });
  };

  const handleEdit = async () => {
    await axios.put(`http://localhost:8080/api/flashcards/${currentCard.flashCardID}`, form);
    fetchFlashcards();
    setShowEdit(false);
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:8080/api/flashcards/${currentCard.flashCardID}`);
    fetchFlashcards();
    setShowDelete(false);
  };

  return (
    <div className="container mt-4">
      <h2>Flashcard Manager</h2>
      <Button variant="primary" onClick={() => setShowAdd(true)}>
        Add Flashcard
      </Button>

      {/* Add Flashcard Modal */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Flashcard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Student ID</Form.Label>
              <Form.Control
                type="text"
                name="studentID"
                value={form.studentID}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={form.category}
                onChange={handleFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAdd(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Flashcards Table */}
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Student ID</th>
            <th>Subject</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flashcards.map((card) => (
            <tr key={card.flashCardID}>
              <td>{card.flashCardID}</td>
              <td>{card.studentID}</td>
              <td>{card.subject}</td>
              <td>{card.category}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => {
                    setCurrentCard(card);
                    setForm({ studentID: card.studentID, subject: card.subject, category: card.category });
                    setShowEdit(true);
                  }}
                  className="me-2"
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setCurrentCard(card);
                    setShowDelete(true);
                  }}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Update Flashcard Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Flashcard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Student ID</Form.Label>
              <Form.Control
                type="text"
                name="studentID"
                value={form.studentID}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={form.category}
                onChange={handleFormChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this flashcard?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;

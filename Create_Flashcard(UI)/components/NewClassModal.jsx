import React, { useState } from 'react';
import './NewClassModal.css';

const NewClassModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>New Class</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" />
          </div>
          
          <div className="form-group">
            <label>Teacher (optional)</label>
            <input type="text" />
          </div>
          
          <div className="form-group">
            <label>Language</label>
            <select defaultValue="">
              <option value="" disabled>Select...</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          
          <div className="button-group">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};

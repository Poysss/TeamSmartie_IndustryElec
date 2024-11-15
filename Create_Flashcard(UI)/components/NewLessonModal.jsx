// NewLessonModal.jsx
const NewLessonModal = ({ isOpen, onClose, onSubmit, currentClass }) => {
    const handleNewLessonSubmit = (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const newLesson = {
        id: Date.now(),
        name: formData.get('name'),
        flashcards: [],
        audio: [],
        notes: []
      };
  
      const updatedClass = {
        ...currentClass,
        lessons: [...currentClass.lessons, newLesson]
      };
  
      onSubmit(updatedClass);
      onClose();
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2>New Lesson</h2>
          <form onSubmit={handleNewLessonSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" />
            </div>
            
            <div className="button-group">
              <button type="button" onClick={onClose}>Cancel</button>
              <button type="submit">Create</button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default NewLessonModal;
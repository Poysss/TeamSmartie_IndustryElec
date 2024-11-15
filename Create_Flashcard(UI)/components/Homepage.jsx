import React, { useState } from 'react';
import { Upload, PlayCircle, Plus } from 'lucide-react';
import './Homepage.css';

const EditClassModal = ({ isOpen, onClose, onSubmit, classData }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Class</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" defaultValue={classData?.name} required />
          </div>
          
          <div className="form-group">
            <label>Teacher (optional)</label>
            <input type="text" name="teacher" defaultValue={classData?.teacher} />
          </div>
          
          <div className="form-group">
            <label>Language</label>
            <select name="language" defaultValue={classData?.language}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>
          
          <div className="button-group">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NewClassModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>New Class</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" required />
          </div>
          
          <div className="form-group">
            <label>Teacher (optional)</label>
            <input type="text" name="teacher" />
          </div>
          
          <div className="form-group">
            <label>Language</label>
            <select name="language" defaultValue="" required>
              <option value="" disabled>Select...</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
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

const NewLessonModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>New Lesson</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" required />
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

const Homepage = () => {
  const [currentView, setCurrentView] = useState('home');
  const [classes, setClasses] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isNewClassModalOpen, setIsNewClassModalOpen] = useState(false);
  const [isNewLessonModalOpen, setIsNewLessonModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState(null);

  const handleLessonClick = (cls) => {
    setCurrentClass(cls);
    setCurrentView('lesson');
  };

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
  };

  const handleNewClassSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newClass = {
      id: Date.now(),
      name: formData.get('name'),
      teacher: formData.get('teacher'),
      language: formData.get('language'),
      status: 'Empty',
      rating: 3,
      lessons: []
    };
    setClasses([...classes, newClass]);
    setIsNewClassModalOpen(false);
  };

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
  
    setClasses(classes.map(cls => 
      cls.id === currentClass.id ? updatedClass : cls
    ));
    setCurrentClass(updatedClass);
    setIsNewLessonModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      name: formData.get('name'),
      teacher: formData.get('teacher'),
      language: formData.get('language')
    };
    
    handleEditClass(classToEdit.id, updatedData);
    setIsEditModalOpen(false);
    setClassToEdit(null);
  };

  const handleEditClass = (classId, updatedData) => {
    setClasses(classes.map(cls => 
      cls.id === classId ? { ...cls, ...updatedData } : cls
    ));
  };

  const handleDeleteClass = (classId) => {
    setClasses(classes.filter(cls => cls.id !== classId));
    if (currentClass?.id === classId) {
      setCurrentView('home');
      setCurrentClass(null);
    }
  };

  return (
    <div className="container">
      <nav>
        <div className="logo-section">
          <div className="logo-square"></div>
          <span className="logo-text">SMARTIE</span>
        </div>
        <div className="profile-circle"></div>
      </nav>

      <main>
        {currentView === 'home' ? (
          <div className="home-view">
            <div className="teacher-header">
              <h1>My Classes</h1>
              <div className="button-group">
                <button className="play-btn">
                  <PlayCircle size={20} />
                  <span>Play Class</span>
                </button>
                <button 
                  className="new-lesson-btn"
                  onClick={() => setIsNewClassModalOpen(true)}
                >
                  <Plus size={20} />
                  <span>New Class</span>
                </button>
              </div>
            </div>

            <div className="lessons-list">
              {classes.length === 0 ? (
                <div className="empty-state">
                  <p>No classes yet. Click "New Class" to get started!</p>
                </div>
              ) : (
                classes.map((cls) => (
                  <div 
                    key={cls.id} 
                    className="lesson-card"
                    onClick={() => handleLessonClick(cls)}
                  >
                    <div className="lesson-info">
                      <h3>{cls.name}</h3>
                      <div className="class-details">
                        <span>{cls.teacher}</span>
                        <span>•</span>
                        <span>{cls.language === 'en' ? 'English' : 'Spanish'}</span>
                      </div>
                    </div>
                    <div className="card-actions">
                      <div className="lesson-rating">{'★'.repeat(cls.rating)}</div>
                      <button className="more-options">•••</button>
                      <button 
                        className="edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setClassToEdit(cls);
                          setIsEditModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClass(cls.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="lesson-page">
            <div className="left-panel">
              <div className="lesson-header">
                <button onClick={() => setCurrentView('home')} className="back-btn">
                  ← {currentClass?.name}
                </button>
                <div className="stars">{'★'.repeat(currentClass?.rating || 0)}</div>
              </div>

              <div className="lessons-section">
                <div className="lessons-header">
                  <h3>Lessons</h3>
                  <button 
                    className="create-lesson-btn"
                    onClick={() => setIsNewLessonModalOpen(true)}
                  >
                    + Create Lesson
                  </button>
                </div>
                <div className="lessons-list">
                  {currentClass?.lessons.map((lesson, index) => (
                    <div 
                      key={index} 
                      className={`lesson-item ${currentLesson?.id === lesson.id ? 'active' : ''}`}
                      onClick={() => handleLessonSelect(lesson)}
                    >
                      {lesson.name}
                    </div>
                  ))}
                  {(!currentClass?.lessons || currentClass.lessons.length === 0) && (
                    <div className="empty-lessons">
                      No lessons yet. Click "Create Lesson" to add one.
                    </div>
                  )}
                </div>
              </div>

              {currentLesson && (
                <div className="category-list">
                  <button 
                    className={`category-btn ${activeCategory === 'flashcards' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('flashcards')}
                  >
                    <span>Flashcards</span>
                    <span>0</span>
                  </button>
                  <button 
                    className={`category-btn ${activeCategory === 'audio' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('audio')}
                  >
                    <span>Audio</span>
                    <span>0</span>
                  </button>
                  <button 
                    className={`category-btn ${activeCategory === 'notes' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('notes')}
                  >
                    <span>Notes</span>
                    <span>0</span>
                  </button>
                </div>
              )}
            </div>
            <div className="right-panel">
              {currentLesson ? (
                <>
                  <div className="control-header">
                    <button className="cancel-btn">Cancel</button>
                    <div className="toggle-container">
                      <span>Front</span>
                      <div className="toggle-switch"></div>
                      <span>Back</span>
                    </div>
                    <button className="next-btn">Next</button>
                  </div>
                  <div className="question-card">
                    <h3>Question Type</h3>
                    <div className="question-options">
                      <button>Text</button>
                      <button>Spelling</button>
                      <button>Audio</button>
                      <button>Photo</button>
                      <button>Web Images</button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-lesson-selected">
                  <p>Select a lesson to start creating flashcards</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <NewClassModal 
        isOpen={isNewClassModalOpen}
        onClose={() => setIsNewClassModalOpen(false)}
        onSubmit={handleNewClassSubmit}
      />
      
      <NewLessonModal
        isOpen={isNewLessonModalOpen}
        onClose={() => setIsNewLessonModalOpen(false)}
        onSubmit={handleNewLessonSubmit}
      />

      <EditClassModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setClassToEdit(null);
        }}
        onSubmit={handleEditSubmit}
        classData={classToEdit}
      />
    </div>
  );
};

export default Homepage;
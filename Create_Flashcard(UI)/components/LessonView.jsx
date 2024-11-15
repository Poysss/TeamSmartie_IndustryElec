// LessonView.jsx
import React from 'react';
import { Plus } from 'lucide-react';

const LessonView = ({ currentClass, setIsNewLessonModalOpen, setCurrentClass, setCurrentView }) => {
  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
  };

  return (
    <div className="lesson-view">
      <div className="lesson-header">
        <button onClick={() => setCurrentClass(null) & setCurrentView('home')} className="back-btn">
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
            <Plus size={16} /> Create Lesson
          </button>
        </div>
        <div className="lessons-list">
          {currentClass?.lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`lesson-item ${currentLesson?.id === lesson.id ? 'active' : ''}`}
              onClick={() => handleLessonSelect(lesson)}
            >
              <div className="lesson-card">
                <h4>{lesson.name}</h4>
              </div>
            </div>
          ))}
          {(!currentClass?.lessons || currentClass.lessons.length === 0) && (
            <div className="empty-lessons">No lessons yet. Click "Create Lesson" to add one.</div>
          )}
        </div>
      </div>

      {currentLesson && (
        <div className="flashcards-section">
          <h3>Flashcards</h3>
          {currentLesson.flashcards.map((flashcard) => (
            <div key={flashcard.id} className="flashcard-item">
              <div className="flashcard-question">{flashcard.question}</div>
              <div className="flashcard-answer">{flashcard.answer}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonView;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Brain,
  Book,
  Save,
  ArrowLeft,
  AlertTriangle,
  Loader,
  Calendar,
  Timer,
  List,
  Shuffle,
  BookOpen,
  CheckCircle 
} from 'lucide-react';
import flashcardService from '../../services/flashcard.service';
import quizService from '../../services/quiz.service';
import './QuizForm.css';

const QuizForm = () => {
  const navigate = useNavigate();
  const { flashcardId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flashcard, setFlashcard] = useState(null);
  const [contents, setContents] = useState([]);
  
  const [formData, setFormData] = useState({
    difficultyLevel: 'MEDIUM',
    randomizeQuestions: false
  });

  const timeLimits = {
    EASY: 600, // 10 minutes
    MEDIUM: 300, // 5 minutes
    HARD: 180  // 3 minutes
  };

  useEffect(() => {
    loadFlashcardData();
  }, [flashcardId]);

  const loadFlashcardData = async () => {
    try {
      setLoading(true);
      setError('');

      const flashcardData = await flashcardService.getFlashcardById(flashcardId);
      const contentsList = await flashcardService.getFlashcardContents();
      
      const flashcardContents = contentsList.filter(
        content => content.flashCard?.flashCardId.toString() === flashcardId.toString()
      ).sort((a, b) => a.numberOfQuestion - b.numberOfQuestion);

      if (!flashcardContents.length) {
        throw new Error('No questions available for this flashcard');
      }

      setFlashcard(flashcardData);
      setContents(flashcardContents);
    } catch (err) {
      console.error('Error loading flashcard data:', err);
      setError(err.message || 'Failed to load flashcard data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');

      const quizData = {
        flashCardId: flashcardId,
        difficultyLevel: formData.difficultyLevel,
        typeOfQuiz: 'IDENTIFICATION',
        timeLimit: timeLimits[formData.difficultyLevel],
        randomizeQuestions: formData.randomizeQuestions
      };

      const quiz = await quizService.setupQuiz(quizData);
      navigate(`/quiz/start/${quiz.quizModeId}`);
    } catch (err) {
      console.error('Error setting up quiz:', err);
      setError(err.message || 'Failed to setup quiz');
      setLoading(false);
    }
  };

  const renderQuestionSetup = () => {
    return (
      <div className="question-preview">
        <h3>Questions Preview</h3>
        <div className="preview-list">
          {contents.slice(0, 3).map((content, index) => (
            <div key={content.contentId} className="preview-item">
              <span className="question-number">Q{index + 1}</span>
              <p>{content.question}</p>
            </div>
          ))}
          {contents.length > 3 && (
            <div className="more-questions">
              <BookOpen size={20} />
              +{contents.length - 3} more questions
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading && !flashcard) {
    return (
      <div className="quiz-form-loading">
        <div className="loading-content">
          <Loader className="animate-spin" size={24} />
          <span>Setting up quiz...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-form-container">
      <div className="quiz-form-header">
        <button className="back-btn" onClick={() => navigate('/flashcards')}>
          <ArrowLeft size={20} />
          Back to Flashcards
        </button>
        <h1>Quiz Setup</h1>
      </div>

      <div className="flashcard-info">
        <div className="info-card">
          <Book size={24} />
          <div className="info-content">
            <h3>{flashcard?.subject}</h3>
            <span className="category-badge">{flashcard?.category}</span>
          </div>
        </div>
        <div className="info-stats">
          <div className="stat-item">
            <List size={20} />
            <span>{contents.length} Questions</span>
          </div>
          <div className="stat-item">
            <Timer size={20} />
            <span>{Math.round(timeLimits[formData.difficultyLevel] / 60)} Minutes</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="quiz-setup-form">
        <div className="form-section">
          <h2>
            <Brain size={24} />
            Quiz Settings
          </h2>

          <div className="form-group">
            <label htmlFor="difficultyLevel">Difficulty Level</label>
            <select
              id="difficultyLevel"
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              required
            >
              <option value="EASY">Easy (10 minutes)</option>
              <option value="MEDIUM">Medium (5 minutes)</option>
              <option value="HARD">Hard (3 minutes)</option>
            </select>
          </div>

          <div className="randomize-option">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.randomizeQuestions}
                onChange={() => setFormData(prev => ({
                  ...prev,
                  randomizeQuestions: !prev.randomizeQuestions
                }))}
              />
              <Shuffle size={20} />
              Randomize Questions
            </label>
          </div>

          <div className="questions-section">
            {renderQuestionSetup()}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/flashcards')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="start-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                Setting up...
              </>
            ) : (
              <>
                <Brain size={20} />
                Start Quiz
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizForm;
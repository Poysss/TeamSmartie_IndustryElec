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
  List 
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
    typeOfQuiz: 'STANDARD',
    timeLimit: 600 // 10 minutes in seconds
  });

  useEffect(() => {
    loadFlashcardData();
  }, [flashcardId]);

  const loadFlashcardData = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Loading flashcard data for ID:', flashcardId);

      // Get flashcard details
      const flashcardData = await flashcardService.getFlashcardById(flashcardId);
      const contentsList = await flashcardService.getFlashcardContents();
      
      // Filter contents for this flashcard
      const flashcardContents = contentsList.filter(
        content => content.flashCard?.flashCardId.toString() === flashcardId.toString()
      ).sort((a, b) => a.numberOfQuestion - b.numberOfQuestion);

      console.log('Loaded flashcard:', flashcardData);
      console.log('Loaded contents:', flashcardContents);

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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      console.log('Setting up quiz with settings:', formData);

      // Create quiz with settings
      const quiz = await quizService.setupQuiz(flashcardId, {
        difficultyLevel: formData.difficultyLevel,
        typeOfQuiz: formData.typeOfQuiz
      });

      console.log('Quiz created:', quiz);

      // Navigate to quiz mode
      navigate(`/quiz/start/${quiz.quizModeId}`);
    } catch (err) {
      console.error('Error setting up quiz:', err);
      setError(err.message || 'Failed to setup quiz');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="quiz-form-loading">
        <div className="loading-content">
          <Loader className="animate-spin" size={24} />
          <span>Setting up quiz...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-form-error">
        <div className="error-content">
          <AlertTriangle size={48} />
          <h2>Unable to Setup Quiz</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/flashcards')} className="back-btn">
            <ArrowLeft size={20} />
            Back to Flashcards
          </button>
        </div>
      </div>
    );
  }

  if (!flashcard || !contents.length) {
    return (
      <div className="quiz-form-empty">
        <div className="empty-content">
          <Book size={48} />
          <h2>No Content Available</h2>
          <p>This flashcard has no questions available for quiz.</p>
          <button onClick={() => navigate('/flashcards')} className="back-btn">
            <ArrowLeft size={20} />
            Back to Flashcards
          </button>
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
            <h3>{flashcard.subject}</h3>
            <span className="category-badge">{flashcard.category}</span>
          </div>
        </div>
        <div className="info-stats">
          <div className="stat-item">
            <List size={20} />
            <span>{contents.length} Questions</span>
          </div>
          <div className="stat-item">
            <Timer size={20} />
            <span>{Math.round(formData.timeLimit / 60)} Minutes</span>
          </div>
        </div>
      </div>

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
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="typeOfQuiz">Quiz Type</label>
            <select
              id="typeOfQuiz"
              name="typeOfQuiz"
              value={formData.typeOfQuiz}
              onChange={handleChange}
              required
            >
              <option value="STANDARD">Standard</option>
              <option value="MULTIPLE_CHOICE">Multiple Choice</option>
              <option value="TRUE_FALSE">True/False</option>
            </select>
          </div>

          <div className="form-preview">
            <h3>Question Preview</h3>
            <div className="questions-preview">
              {contents.slice(0, 3).map((content, index) => (
                <div key={content.contentId} className="preview-item">
                  <span className="question-number">Q{index + 1}</span>
                  <p>{content.question}</p>
                </div>
              ))}
              {contents.length > 3 && (
                <div className="more-questions">
                  +{contents.length - 3} more questions
                </div>
              )}
            </div>
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
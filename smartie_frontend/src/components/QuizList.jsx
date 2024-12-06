import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Trophy, 
  Clock, 
  Book,
  Star,
  ArrowRight,
  BarChart2,
  BookOpen,
  Plus,
  Loader,
  Filter,
  Search,
  Trash2,
  AlertTriangle 
} from 'lucide-react';
import quizService from '../../services/quiz.service';
import './QuizList.css';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingQuiz, setDeletingQuiz] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    avgScore: 0,
    bestScore: 0
  });

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get user data
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        throw new Error('User not authenticated');
      }

      const data = await quizService.getQuizzesByStudent(userData.studentId);
      setQuizzes(data || []);
      calculateStats(data || []);
    } catch (err) {
      console.error('Error loading quizzes:', err);
      setError('No quizzes available. Create a flashcard deck first!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId, event) => {
    event.preventDefault();
    event.stopPropagation();
    setQuizToDelete(quizId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeletingQuiz(quizToDelete);
      await quizService.deleteQuiz(quizToDelete);
      setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.quizModeId !== quizToDelete));
      calculateStats(quizzes.filter(quiz => quiz.quizModeId !== quizToDelete));
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting quiz:', err);
      setError('Failed to delete quiz. Please try again.');
    } finally {
      setDeletingQuiz(null);
      setQuizToDelete(null);
    }
  };

  const calculateStats = (quizData) => {
    if (!quizData || quizData.length === 0) {
      setStats({
        totalQuizzes: 0,
        avgScore: 0,
        bestScore: 0
      });
      return;
    }

    const scores = quizData.map(q => q.score || 0);
    setStats({
      totalQuizzes: quizData.length,
      avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
      bestScore: Math.max(...scores)
    });
  };

  const getDifficultyColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FFC436';
      case 'hard': return '#FF5252';
      default: return '#337CCF';
    }
  };

  const getTimeLimit = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 600;
      case 'MEDIUM': return 300;
      case 'HARD': return 180;
      default: return 300;
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.flashCard?.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || quiz.difficultyLevel?.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loading-content">
          <Loader className="animate-spin" size={24} />
          <span>Loading quizzes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-list-container">
      <div className="quiz-header">
        <div className="title-section">
          <h1>Quiz Mode</h1>
          <p>Test your knowledge and track your progress</p>
          <br/>
        </div>

        <div className="quiz-stats">
          <div className="stat-card">
            <Book size={24} />
            <div className="stat-info">
              <span className="stat-value">{stats.totalQuizzes}</span>
              <span className="stat-label">Total Quizzes</span>
            </div>
          </div>
          <div className="stat-card">
            <Trophy size={24} />
            <div className="stat-info">
              <span className="stat-value">{stats.bestScore}%</span>
              <span className="stat-label">Best Score</span>
            </div>
          </div>
          <div className="stat-card">
            <BarChart2 size={24} />
            <div className="stat-info">
              <span className="stat-value">{stats.avgScore}%</span>
              <span className="stat-label">Average Score</span>
            </div>
          </div>
        </div>

        {quizzes.length > 0 && (
          <div className="filter-section">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-dropdown">
              <Filter size={20} />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      {quizzes.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} />
          <h2>No Quizzes Available</h2>
          <p>Create a flashcard deck to start quizzing!</p>
          <Link to="/flashcards/create" className="create-btn">
            <Plus size={20} />
            Create Flashcard Deck
          </Link>
        </div>
      ) : (
        <div className="quiz-grid">
          {filteredQuizzes.map((quiz, index) => (
            <div 
              key={quiz.quizModeId} 
              className="quiz-card"
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className="quiz-info">
                <div className="quiz-header">
                  <h3>{quiz.flashCard?.subject}</h3>
                  <span 
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(quiz.difficultyLevel) }}
                  >
                    {quiz.difficultyLevel}
                  </span>
                </div>
                
                <div className="quiz-details">
                  <span>
                    <Clock size={16} />
                    {getTimeLimit(quiz.difficultyLevel) / 60} minutes
                  </span>
                </div>

                {quiz.score !== undefined && quiz.score !== null && (
                  <div className="previous-score">
                    <BarChart2 size={16} />
                    Previous Score: {quiz.score}%
                  </div>
                )}
              </div>

              <div className="quiz-actions">
                <Link 
                  to={`/quiz/start/${quiz.quizModeId}`} 
                  className="quiz-action-btn start"
                >
                  Start Quiz
                  <ArrowRight size={18} />
                </Link>
                <button 
                  className="quiz-action-btn delete"
                  onClick={(e) => handleDeleteQuiz(quiz.quizModeId, e)}
                  disabled={deletingQuiz === quiz.quizModeId}
                >
                  {deletingQuiz === quiz.quizModeId ? (
                    <Loader className="animate-spin" size={18} />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="delete-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <AlertTriangle size={24} className="warning-icon" />
              <h3>Delete Quiz</h3>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete this quiz? This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="delete-btn"
                onClick={confirmDelete}
                disabled={deletingQuiz}
              >
                {deletingQuiz ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Quiz
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizList;
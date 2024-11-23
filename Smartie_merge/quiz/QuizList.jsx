import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Trophy, 
  Clock, 
  Star,
  ArrowRight,
  BarChart,
  BookOpen,
  Plus,
  Loader,
  Filter,
  Search 
} from 'lucide-react';
import quizService from '../../services/quiz.service';
import './QuizList.css';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
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
    switch (level.toLowerCase()) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FFC436';
      case 'hard': return '#FF5252';
      default: return '#337CCF';
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
        </div>

        <div className="quiz-stats">
          <div className="stat-card">
            <Brain size={24} />
            <span className="stat-value">{stats.totalQuizzes}</span>
            <span className="stat-label">Total Quizzes</span>
          </div>
          <div className="stat-card">
            <Trophy size={24} />
            <span className="stat-value">{stats.bestScore}%</span>
            <span className="stat-label">Best Score</span>
          </div>
          <div className="stat-card">
            <Star size={24} />
            <span className="stat-value">{stats.avgScore}%</span>
            <span className="stat-label">Average Score</span>
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

      {error || quizzes.length === 0 ? (
        <div className="empty-state">
          <BookOpen size={48} />
          <h2>No Quizzes Available</h2>
          <p>{error || "Create a flashcard deck to start quizzing!"}</p>
          <Link to="/flashcards/create" className="create-btn">
            <Plus size={20} />
            Create Flashcard Deck
          </Link>
        </div>
      ) : (
        <div className="quiz-content">
          <div className="available-quizzes">
            <h2>Available Quizzes</h2>
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
                        10 minutes
                      </span>
                      <span>
                        <Brain size={16} />
                        {quiz.typeOfQuiz}
                      </span>
                    </div>

                    {quiz.score !== undefined && quiz.score !== null && (
                      <div className="previous-score">
                        <BarChart size={16} />
                        Previous Score: {quiz.score}%
                      </div>
                    )}
                  </div>

                  <Link 
                    to={`/quiz/start/${quiz.quizModeId}`} 
                    className="start-quiz-btn"
                  >
                    Start Quiz
                    <ArrowRight size={18} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizList;
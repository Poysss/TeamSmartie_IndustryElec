import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Trophy, 
  Clock, 
  Star,
  ArrowRight,
  BarChart 
} from 'lucide-react';
import quizService from '../../services/quiz.service';
import './QuizList.css';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      const data = await quizService.getAllQuizModes();
      setQuizzes(data);
      calculateStats(data);
    } catch (err) {
      setError('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (quizData) => {
    if (quizData.length === 0) return;

    const scores = quizData.map(q => q.score);
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

  if (loading) {
    return <div className="quiz-loading">Loading quizzes...</div>;
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
      </div>

      <div className="quiz-content">
        <div className="available-quizzes">
          <h2>Available Quizzes</h2>
          <div className="quiz-grid">
            {quizzes.map((quiz, index) => (
              <div 
                key={quiz.quizModeId} 
                className="quiz-card"
                style={{ '--delay': `${index * 0.1}s` }}
              >
                <div className="quiz-info">
                  <div className="quiz-header">
                    <h3>{quiz.flashCard.subject}</h3>
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

                  {quiz.score && (
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

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!loading && !error && quizzes.length === 0 && (
        <div className="empty-state">
          <Brain size={48} />
          <h2>No Quizzes Available</h2>
          <p>Create flashcards first to generate quizzes!</p>
          <Link to="/flashcards/create" className="create-btn">
            Create Flashcards
          </Link>
        </div>
      )}
    </div>
  );
};

export default QuizList;
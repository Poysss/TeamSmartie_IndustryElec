import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  BarChart2,
  BookOpen,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import './QuizComplete.css';

const QuizComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    score, 
    correctCount, 
    totalQuestions, 
    timeSpent, 
    answers, 
    contents,
    subject,
    category
  } = location.state || {};

  const getScoreColor = (score) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 75) return '#FFC436';
    if (score >= 60) return '#2196F3';
    return '#FF5252';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Excellent! Outstanding performance!';
    if (score >= 75) return 'Great job! Well done!';
    if (score >= 60) return 'Good effort! Keep practicing!';
    return 'Keep studying! You\'ll improve!';
  };

  if (!score) {
    navigate('/quiz');
    return null;
  }

  return (
    <div className="quiz-complete-container">
      <div className="quiz-complete-header">
        <div className="subject-info">
          <h1>{subject}</h1>
          <span className="category-badge">{category}</span>
        </div>
      </div>

      <div className="score-card">
        <div className="score-circle" style={{ '--score-color': getScoreColor(score) }}>
          <Trophy size={32} />
          <span className="score-value">{score}%</span>
          <span className="score-message">{getScoreMessage(score)}</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card correct">
          <CheckCircle size={24} />
          <div className="stat-info">
            <span className="stat-value">{correctCount}</span>
            <span className="stat-label">Correct Answers</span>
          </div>
        </div>

        <div className="stat-card incorrect">
          <XCircle size={24} />
          <div className="stat-info">
            <span className="stat-value">{totalQuestions - correctCount}</span>
            <span className="stat-label">Incorrect Answers</span>
          </div>
        </div>

        <div className="stat-card time">
          <Clock size={24} />
          <div className="stat-info">
            <span className="stat-value">{Math.round(timeSpent / 60)}m {timeSpent % 60}s</span>
            <span className="stat-label">Time Taken</span>
          </div>
        </div>

        <div className="stat-card accuracy">
          <BarChart2 size={24} />
          <div className="stat-info">
            <span className="stat-value">{Math.round((correctCount / totalQuestions) * 100)}%</span>
            <span className="stat-label">Accuracy</span>
          </div>
        </div>
      </div>

      <div className="answers-review">
        <h2>Question Review</h2>
        {contents.map((content, index) => (
          <div 
            key={content.contentId} 
            className={`review-item ${
              answers[index]?.toLowerCase() === content.answer.toLowerCase()
                ? 'correct'
                : 'incorrect'
            }`}
          >
            <div className="review-header">
              <span className="question-number">Question {index + 1}</span>
              {answers[index]?.toLowerCase() === content.answer.toLowerCase() ? (
                <CheckCircle size={20} />
              ) : (
                <XCircle size={20} />
              )}
            </div>
            <p className="question-text">{content.question}</p>
            <div className="answer-comparison">
              <div className="your-answer">
                <strong>Your Answer:</strong>
                <span>{answers[index] || 'Not answered'}</span>
              </div>
              <div className="correct-answer">
                <strong>Correct Answer:</strong>
                <span>{content.answer}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <Link to="/quiz" className="action-btn retry">
          <RefreshCw size={20} />
          Try Another Quiz
        </Link>
        <Link to="/flashcards" className="action-btn study">
          <BookOpen size={20} />
          Back to Flashcards
        </Link>
        <Link to="/progress" className="action-btn progress">
          <BarChart2 size={20} />
          View Progress
        </Link>
      </div>
    </div>
  );
};

export default QuizComplete;
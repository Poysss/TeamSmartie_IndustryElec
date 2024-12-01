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
  RefreshCw,
  AlertTriangle
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

  if (!score) {
    navigate('/quiz');
    return null;
  }

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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const renderAnswer = (content, index) => {
    const userAnswer = answers[index];
    const isCorrect = content.answer.toLowerCase() === userAnswer?.toLowerCase();

    return (
      <div className="answer-comparison">
        <div className="your-answer">
          <strong>Your Answer:</strong>
          <span className={isCorrect ? 'correct' : 'incorrect'}>
            {userAnswer || 'Not answered'}
          </span>
        </div>
        <div className="correct-answer">
          <strong>Correct Answer:</strong>
          <span>{content.answer}</span>
        </div>
        <div className="answer-explanation">
          {isCorrect ? (
            <>
              <CheckCircle size={20} className="correct-icon" />
              <p>Correct!</p>
            </>
          ) : (
            <>
              <XCircle size={20} className="incorrect-icon" />
              <p>
                {userAnswer ? 
                  'Your answer doesn\'t match exactly. Remember to check spelling and wording.' 
                  : 'No answer provided'
                }
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="quiz-complete-container">
      <div className="quiz-complete-header">
        <div className="subject-info">
          <h1>{subject}</h1>
          <span className="category-badge">{category}</span>
        </div>
      </div>

      <div className="score-section">
        <div className="score-circle" style={{ '--score-color': getScoreColor(score) }}>
          <Trophy size={32} />
          <span className="score-value">{score}%</span>
        </div>
        <div className="score-message">{getScoreMessage(score)}</div>
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
            <span className="stat-value">{formatTime(timeSpent)}</span>
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
            {renderAnswer(content, index)}
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

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BarChart2,
  Home,
  RefreshCcw,
  BookOpen 
} from 'lucide-react';
import './QuizResults.css';

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, answers, questions } = location.state || {};
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (!score || !answers || !questions) {
      navigate('/quiz');
    }

    // Hide confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FFC436';
    return '#FF5252';
  };

  const calculateStats = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    questions.forEach((_, index) => {
      if (!answers[index]) {
        unanswered++;
      } else if (answers[index] === questions[index].answer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    return { correct, incorrect, unanswered };
  };

  const stats = calculateStats();

  return (
    <div className="quiz-results-container">
      {showConfetti && (
        <div className="confetti">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="confetti-piece"
              style={{
                '--delay': `${Math.random() * 5}s`,
                '--rotation': `${Math.random() * 360}deg`,
                '--position': `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      )}

      <div className="results-card">
        <div className="score-section">
          <div 
            className="score-circle"
            style={{ '--score-color': getScoreColor(score) }}
          >
            <Trophy size={32} />
            <span className="score-value">{score}%</span>
            <span className="score-label">Final Score</span>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-item correct">
            <CheckCircle size={24} />
            <div className="stat-info">
              <span className="stat-value">{stats.correct}</span>
              <span className="stat-label">Correct</span>
            </div>
          </div>
          <div className="stat-item incorrect">
            <XCircle size={24} />
            <div className="stat-info">
              <span className="stat-value">{stats.incorrect}</span>
              <span className="stat-label">Incorrect</span>
            </div>
          </div>
          <div className="stat-item unanswered">
            <Clock size={24} />
            <div className="stat-info">
              <span className="stat-value">{stats.unanswered}</span>
              <span className="stat-label">Unanswered</span>
            </div>
          </div>
        </div>

        <div className="review-section">
          <h2>Question Review</h2>
          {questions.map((question, index) => (
            <div 
              key={index}
              className={`review-item ${
                !answers[index] 
                  ? 'unanswered' 
                  : answers[index] === question.answer 
                    ? 'correct' 
                    : 'incorrect'
              }`}
            >
              <div className="review-header">
                <span className="question-number">Question {index + 1}</span>
                {!answers[index] ? (
                  <Clock size={18} />
                ) : answers[index] === question.answer ? (
                  <CheckCircle size={18} />
                ) : (
                  <XCircle size={18} />
                )}
              </div>
              <p className="question-text">{question.question}</p>
              <div className="answer-review">
                <div className="your-answer">
                  <strong>Your Answer:</strong>
                  <span>{answers[index] || 'Not answered'}</span>
                </div>
                <div className="correct-answer">
                  <strong>Correct Answer:</strong>
                  <span>{question.answer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="actions-section">
          <Link to="/dashboard" className="action-btn home">
            <Home size={20} />
            Dashboard
          </Link>
          <Link to="/quiz" className="action-btn retry">
            <RefreshCcw size={20} />
            Try Another Quiz
          </Link>
          <Link to="/flashcards" className="action-btn study">
            <BookOpen size={20} />
            Study More
          </Link>
        </div>

        <div className="performance-chart">
          <h2>
            <BarChart2 size={20} />
            Performance Analysis
          </h2>
          <div className="chart-bars">
            <div className="chart-bar">
              <div 
                className="bar correct"
                style={{ height: `${(stats.correct / questions.length) * 100}%` }}
              >
                {Math.round((stats.correct / questions.length) * 100)}%
              </div>
              <span className="bar-label">Correct</span>
            </div>
            <div className="chart-bar">
              <div 
                className="bar incorrect"
                style={{ height: `${(stats.incorrect / questions.length) * 100}%` }}
              >
                {Math.round((stats.incorrect / questions.length) * 100)}%
              </div>
              <span className="bar-label">Incorrect</span>
            </div>
            <div className="chart-bar">
              <div 
                className="bar unanswered"
                style={{ height: `${(stats.unanswered / questions.length) * 100}%` }}
              >
                {Math.round((stats.unanswered / questions.length) * 100)}%
              </div>
              <span className="bar-label">Unanswered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
// src/components/quiz/QuizComplete.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BarChart2,
  Home,
  RefreshCw,
  BookOpen 
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

  useEffect(() => {
    // Check if we have the necessary data
    if (!contents || contents.length === 0) {
      navigate('/quiz');
    }
  }, []);

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
                  'Your answer doesn\'t match exactly. Check the correct answer above.' 
                  : 'No answer provided'
                }
              </p>
            </>
          )}
        </div>
      </div>
    );
  };

  const stats = {
    correct: correctCount || 0,
    incorrect: totalQuestions - (correctCount || 0),
    total: totalQuestions,
    accuracy: totalQuestions > 0 ? Math.round((correctCount || 0) / totalQuestions * 100) : 0
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
        <div className="score-circle" style={{ '--score-color': getScoreColor(score || 0) }}>
          <Trophy size={32} />
          <span className="score-value">{score || 0}%</span>
        </div>
        <div className="score-message">{getScoreMessage(score || 0)}</div>
      </div>

      <div className="stats-grid">
        <div className="stat-card correct">
          <CheckCircle size={24} />
          <div className="stat-info">
            <span className="stat-value">{stats.correct}</span>
            <span className="stat-label">Correct Answers</span>
          </div>
        </div>

        <div className="stat-card incorrect">
          <XCircle size={24} />
          <div className="stat-info">
            <span className="stat-value">{stats.incorrect}</span>
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
            <span className="stat-value">{stats.accuracy}%</span>
            <span className="stat-label">Accuracy</span>
          </div>
        </div>
      </div>

      <div className="answers-review">
        <h2>Question Review</h2>
        {contents && contents.map((content, index) => (
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
          Study More
        </Link>
      </div>
    </div>
  );
};

export default QuizComplete;
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Flag,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader,
  BookOpen
} from 'lucide-react';
import quizService from '../../services/quiz.service';
import './QuizMode.css';

const QuizMode = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [contents, setContents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    loadQuiz();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError('');
      const quizData = await quizService.getQuizById(quizId);

      if (!quizData.contents || quizData.contents.length === 0) {
        throw new Error('No questions available for this quiz');
      }

      let quizContents = [...quizData.contents];
      if (quizData.randomizeQuestions) {
        quizContents = shuffleArray(quizContents);
      }

      setQuiz(quizData);
      setContents(quizContents);
      setTimeLeft(quizData.timeLimit || getTimeLimit(quizData.difficultyLevel));
      startTimer();
    } catch (err) {
      console.error('Error loading quiz:', err);
      setError(err.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = 
      [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  const getTimeLimit = (difficulty) => {
    switch (difficulty) {
      case 'EASY': return 600;
      case 'MEDIUM': return 300;
      case 'HARD': return 180;
      default: return 300;
    }
  };

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleAutoSubmit = () => {
    handleSubmitQuiz(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: answer
    }));
  };

  const handleNext = () => {
    if (currentIndex < contents.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const calculateResults = () => {
    let correctCount = 0;
    const incorrectAnswers = [];

    contents.forEach((content, index) => {
      const userAnswer = answers[index]?.toString().toLowerCase().trim() || '';
      const correctAnswer = content.answer.toLowerCase().trim();

      if (userAnswer === correctAnswer) {
        correctCount++;
      } else {
        incorrectAnswers.push({
          flashCardId: quiz.flashCard.flashCardId,
          contentId: content.contentId,
          userAnswer: answers[index] || '',
          correctAnswer: content.answer
        });
      }
    });

    const score = Math.round((correctCount / contents.length) * 100);
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);

    return {
      score,
      correctCount,
      incorrectAnswers,
      timeSpent,
      flashCardId: quiz.flashCard.flashCardId,
      contentId: quiz.flashCardContent.contentId
    };
  };

  const handleSubmitQuiz = async (autoSubmit = false) => {
    if (!autoSubmit && !showConfirmSubmit && Object.keys(answers).length < contents.length) {
      setShowConfirmSubmit(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const results = calculateResults();

      await quizService.submitQuiz(quiz.quizModeId, {
        ...results,
        difficultyLevel: quiz.difficultyLevel,
        typeOfQuiz: 'IDENTIFICATION'
      });

      navigate(`/quiz/complete/${quiz.quizModeId}`, { 
        state: { 
          score: results.score,
          correctCount: results.correctCount,
          totalQuestions: contents.length,
          timeSpent: results.timeSpent,
          answers,
          contents,
          subject: quiz.flashCard.subject,
          category: quiz.flashCard.category,
          quizType: 'IDENTIFICATION'
        }
      });
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz results');
      setIsSubmitting(false);
      setShowConfirmSubmit(false);
    }
  };

  if (loading) {
    return (
      <div className="quiz-loading">
        <Loader className="animate-spin" size={24} />
        <span>Loading quiz...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-error">
        <AlertTriangle size={48} />
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/quiz')} className="back-btn">
        <ArrowLeft size={20} />
          Back to Quizzes
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-mode-container">
      <div className="quiz-header">
        <div className="quiz-info">
          <h1>{quiz.flashCard.subject}</h1>
          <div className="quiz-meta">
            <span className="category-badge">{quiz.flashCard.category}</span>
            <span className="difficulty-badge">{quiz.difficultyLevel}</span>
            <span className={`timer ${timeLeft <= 60 ? 'warning' : ''}`}>
              <Clock size={20} />
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      <div className="quiz-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / contents.length) * 100}%` }}
          />
        </div>
        <div className="progress-stats">
          <span>Question {currentIndex + 1} of {contents.length}</span>
          <span>{Object.keys(answers).length} Answered</span>
        </div>
      </div>

      <div className="question-container">
        <div className="identification-question">
          <h2>Question {currentIndex + 1}</h2>
          <p className="question-text">{contents[currentIndex].question}</p>
          <textarea
            className="answer-input"
            value={answers[currentIndex] || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer here..."
            rows={3}
          />
        </div>

        <div className="navigation-buttons">
          <button 
            className="nav-btn"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ArrowLeft size={20} />
            Previous
          </button>

          {currentIndex === contents.length - 1 ? (
            <button 
              className={`submit-btn ${showConfirmSubmit ? 'confirm' : ''}`}
              onClick={() => handleSubmitQuiz(false)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : showConfirmSubmit ? (
                <>
                  <CheckCircle size={20} />
                  Confirm Submit
                </>
              ) : (
                <>
                  <Flag size={20} />
                  Submit Quiz
                </>
              )}
            </button>
          ) : (
            <button 
              className="nav-btn next"
              onClick={handleNext}
            >
              Next
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>

      {showConfirmSubmit && (
        <div className="submit-overlay" onClick={() => setShowConfirmSubmit(false)}>
          <div className="submit-modal" onClick={e => e.stopPropagation()}>
            <h3>Submit Quiz?</h3>
            <p>
              You have answered {Object.keys(answers).length} out of {contents.length} questions.
              {Object.keys(answers).length < contents.length && 
                ` ${contents.length - Object.keys(answers).length} questions are still unanswered.`}
            </p>
            <div className="submit-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowConfirmSubmit(false)}
              >
                <XCircle size={20} />
                Continue Quiz
              </button>
              <button 
                className="confirm-btn"
                onClick={() => handleSubmitQuiz(false)}
              >
                <CheckCircle size={20} />
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizMode;

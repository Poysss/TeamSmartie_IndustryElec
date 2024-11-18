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
  HelpCircle,
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
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    loadQuiz();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizId]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading quiz:', quizId);

      const quizData = await quizService.getQuizById(quizId);
      console.log('Quiz data loaded:', quizData);

      if (!quizData.contents || quizData.contents.length === 0) {
        throw new Error('No questions available for this quiz');
      }

      setQuiz(quizData);
      setContents(quizData.contents.sort((a, b) => a.numberOfQuestion - b.numberOfQuestion));
      startTimer();
    } catch (err) {
      console.error('Error loading quiz:', err);
      setError(err.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
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
      [currentIndex]: answer.trim()
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
      const userAnswer = answers[index]?.toLowerCase() || '';
      const correctAnswer = content.answer.toLowerCase();

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

      console.log('Submitting quiz results:', results);
      await quizService.submitQuiz(quiz.quizModeId, {
        ...results,
        difficultyLevel: quiz.difficultyLevel,
        typeOfQuiz: quiz.typeOfQuiz
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
          category: quiz.flashCard.category
        }
      });
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz results');
      setIsSubmitting(false);
      setShowConfirmSubmit(false);
    }
  };

  const getProgressPercentage = () => {
    const answered = Object.keys(answers).length;
    return Math.round((answered / contents.length) * 100);
  };

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loading-content">
          <Loader className="animate-spin" size={24} />
          <span>Loading quiz...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-error">
        <div className="error-content">
          <AlertTriangle size={48} color="#FFC436" />
          <h2>Unable to Load Quiz</h2>
          <p>{error}</p>
          <button 
            className="back-button"
            onClick={() => navigate('/flashcards')}
          >
            <ArrowLeft size={20} />
            Back to Flashcards
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = contents[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = contents.length;
  const progressPercentage = getProgressPercentage();

  return (
    <div className="quiz-mode-container">
      <div className="quiz-header">
        <div className="quiz-info">
          <h1>{quiz.flashCard.subject}</h1>
          <div className="quiz-meta">
            <span className="category-badge">{quiz.flashCard.category}</span>
            <span className="difficulty-badge">{quiz.difficultyLevel}</span>
            <span className="timer">
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
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="progress-stats">
          <span>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span>
            {answeredCount} Answered
          </span>
        </div>
      </div>

      <div className="question-container">
        <div className="question-content">
          <h2>Question {currentIndex + 1}</h2>
          <p>{currentQuestion.question}</p>
        </div>

        <div className="answer-section">
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
              You have answered {answeredCount} out of {totalQuestions} questions.
              {answeredCount < totalQuestions && 
                ` ${totalQuestions - answeredCount} questions are still unanswered.`}
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
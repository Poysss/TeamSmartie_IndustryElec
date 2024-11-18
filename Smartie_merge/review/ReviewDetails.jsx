import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  BookOpen,
  Clock,
  RepeatIcon,
  Bookmark,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import reviewService from '../../services/review.service';
import './ReviewDetails.css';

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    loadReview();
  }, [id]);

  const loadReview = async () => {
    try {
      const data = await reviewService.getReviewById(id);
      setReview(data);
    } catch (err) {
      setError('Failed to load review details');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    navigate(`/quiz/start/${review.flashCard.flashCardId}`);
  };

  const handleBookmark = async () => {
    try {
      await reviewService.bookmarkReview(id);
      // Update local state or show success message
    } catch (err) {
      setError('Failed to bookmark review');
    }
  };

  if (loading) {
    return <div className="review-details-loading">Loading review details...</div>;
  }

  if (error) {
    return (
      <div className="review-details-error">
        <AlertTriangle size={48} />
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/reviews')} className="back-btn">
          Back to Reviews
        </button>
      </div>
    );
  }

  return (
    <div className="review-details-container">
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate('/reviews')}>
          <ArrowLeft size={20} />
          Back to Reviews
        </button>
        <div className="header-content">
          <h1>{review.flashCard.subject}</h1>
          <div className="header-badges">
            <span className="category-badge">
              <BookOpen size={16} />
              {review.flashCard.category}
            </span>
            <span className="date-badge">
              <Clock size={16} />
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="review-content-wrapper">
        <div className="review-main-content">
          <div className="answer-comparison">
            {review.reviewIncorrectAnswer && (
              <div className="answer-panel incorrect">
                <div className="panel-header">
                  <XCircle size={24} />
                  <h3>Incorrect Answer</h3>
                </div>
                <div className="panel-content">
                  <p>{review.reviewIncorrectAnswer}</p>
                  <button 
                    className="explanation-btn"
                    onClick={() => setShowExplanation(!showExplanation)}
                  >
                    {showExplanation ? 'Hide' : 'Show'} Explanation
                  </button>
                  {showExplanation && (
                    <div className="explanation-content">
                      <p>Here's why this answer was incorrect:</p>
                      <ul>
                        {/* Add explanation points */}
                        <li>Key concept misunderstanding</li>
                        <li>Common mistake patterns</li>
                        <li>Related topics to review</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {review.reviewCorrectAnswer && (
              <div className="answer-panel correct">
                <div className="panel-header">
                  <CheckCircle size={24} />
                  <h3>Correct Answer</h3>
                </div>
                <div className="panel-content">
                  <p>{review.reviewCorrectAnswer}</p>
                </div>
              </div>
            )}
          </div>

          <div className="related-concepts">
            <h3>Related Concepts</h3>
            <div className="concept-tags">
              {/* Add dynamic tags based on the subject/category */}
              <span className="concept-tag">Key Term 1</span>
              <span className="concept-tag">Key Term 2</span>
              <span className="concept-tag">Key Term 3</span>
            </div>
          </div>

          <div className="study-recommendations">
            <h3>Study Recommendations</h3>
            <div className="recommendation-cards">
              <div className="recommendation-card">
                <RepeatIcon size={20} />
                <div className="recommendation-content">
                  <h4>Practice Similar Questions</h4>
                  <p>Focus on questions from the same category to reinforce learning</p>
                  <button className="action-btn">
                    Start Practice
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
              
              <div className="recommendation-card">
                <BookOpen size={20} />
                <div className="recommendation-content">
                  <h4>Review Materials</h4>
                  <p>Check related flashcards and study materials</p>
                  <button className="action-btn">
                    View Materials
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="review-actions">
          <button className="action-btn retry" onClick={handleRetry}>
            <RepeatIcon size={20} />
            Try Similar Questions
          </button>
          <button className="action-btn bookmark" onClick={handleBookmark}>
            <Bookmark size={20} />
            Save for Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;
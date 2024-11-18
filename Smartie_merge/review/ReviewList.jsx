import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Filter,
  Search,
  Clock,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import reviewService from '../../services/review.service';
import './ReviewList.css';

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await reviewService.getAllReviews();
      setReviews(data);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const getReviewStatus = (review) => {
    const hasIncorrect = review.reviewIncorrectAnswer;
    const hasCorrect = review.reviewCorrectAnswer;
    if (hasIncorrect && hasCorrect) return 'mixed';
    if (hasCorrect) return 'correct';
    if (hasIncorrect) return 'incorrect';
    return 'pending';
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.flashCard.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getReviewStatus(review);
    return matchesSearch && (filter === 'all' || filter === status);
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'correct':
        return <CheckCircle size={20} className="status-icon correct" />;
      case 'incorrect':
        return <XCircle size={20} className="status-icon incorrect" />;
      case 'mixed':
        return <RefreshCw size={20} className="status-icon mixed" />;
      default:
        return <Clock size={20} className="status-icon pending" />;
    }
  };

  if (loading) {
    return <div className="review-loading">Loading reviews...</div>;
  }

  return (
    <div className="review-list-container">
      <div className="review-header">
        <h1>Review History</h1>
        
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
              <option value="all">All Reviews</option>
              <option value="correct">Correct Only</option>
              <option value="incorrect">Incorrect Only</option>
              <option value="mixed">Mixed Results</option>
              <option value="pending">Pending Review</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="reviews-grid">
        {filteredReviews.map((review, index) => {
          const status = getReviewStatus(review);
          return (
            <div 
              key={review.reviewId} 
              className={`review-card ${status}`}
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className="review-header">
                {getStatusIcon(status)}
                <h3>{review.flashCard.subject}</h3>
                <span className="review-date">
                  <Clock size={16} />
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="review-content">
                <div className="category-badge">
                  <BookOpen size={16} />
                  {review.flashCard.category}
                </div>

                {review.reviewIncorrectAnswer && (
                  <div className="answer-section incorrect">
                    <h4>Incorrect Answer:</h4>
                    <p>{review.reviewIncorrectAnswer}</p>
                  </div>
                )}

                {review.reviewCorrectAnswer && (
                  <div className="answer-section correct">
                    <h4>Correct Answer:</h4>
                    <p>{review.reviewCorrectAnswer}</p>
                  </div>
                )}
              </div>

              <button 
                className="review-action-btn"
                onClick={() => {/* Handle review action */}}
              >
                Review Again
                <ArrowRight size={18} />
              </button>
            </div>
          );
        })}
      </div>

      {filteredReviews.length === 0 && (
        <div className="empty-state">
          <BookOpen size={48} />
          <h2>No Reviews Found</h2>
          <p>Complete some quizzes to see your review history</p>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
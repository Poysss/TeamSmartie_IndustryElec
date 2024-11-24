import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Book, 
  Brain, 
  Clock, 
  BarChart2,
  Plus,
  CheckCircle,
  Star,
  Loader
} from 'lucide-react';
import flashcardService from '../services/flashcard.service';
import quizService from '../services/quiz.service';
import reviewService from '../services/review.service';
import '../styles/pages/dashboard.css';

const Dashboard = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardData, setDashboardData] = useState({
    flashcards: [],
    quizzes: [],
    reviews: [],
    stats: {
      totalFlashcards: 0,
      completedQuizzes: 0,
      averageScore: 0,
      studyTime: 0,
      recentActivity: []
    }
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get user-specific data
      const [flashcards, quizzes, reviews] = await Promise.all([
        flashcardService.getFlashcardByStudentId(user.studentId),
        quizService.getQuizzesByStudent(user.studentId),
        reviewService.getAllReviews()
      ]);

      // Filter reviews for current user's flashcards
      const userFlashcardIds = flashcards.map(f => f.flashCardId);
      const userReviews = reviews.filter(r => 
        userFlashcardIds.includes(r.flashCard?.flashCardId)
      );

      // Calculate statistics
      const stats = calculateStats(flashcards, quizzes, userReviews);

      setDashboardData({
        flashcards,
        quizzes,
        reviews: userReviews,
        stats
      });

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (flashcards, quizzes, reviews) => {
    // Calculate average score
    const scores = quizzes.map(q => q.score).filter(Boolean);
    const averageScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    // Calculate total study time
    const totalTime = quizzes.reduce((sum, quiz) => {
      return sum + (quiz.timeSpent || 0);
    }, 0);

    // Get recent activity
    const recentActivity = [
      ...quizzes.map(q => ({
        type: 'quiz',
        date: new Date(q.createdAt || Date.now()),
        score: q.score,
        subject: q.flashCard?.subject
      })),
      ...reviews.map(r => ({
        type: 'review',
        date: new Date(r.createdAt || Date.now()),
        subject: r.flashCard?.subject
      }))
    ]
    .sort((a, b) => b.date - a.date)
    .slice(0, 5);

    return {
      totalFlashcards: flashcards.length,
      completedQuizzes: quizzes.length,
      averageScore,
      studyTime: totalTime,
      recentActivity
    };
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader className="animate-spin" size={24} />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.firstName || 'Student'}!</h1>
          <p>Continue your learning journey</p>
        </div>

        <div className="quick-stats">
          <div className="stat-card">
            <Book size={24} />
            <span className="stat-value">{dashboardData.stats.totalFlashcards}</span>
            <span className="stat-label">Total Flashcards</span>
          </div>
          <div className="stat-card">
            <Brain size={24} />
            <span className="stat-value">{dashboardData.stats.completedQuizzes}</span>
            <span className="stat-label">Completed Quizzes</span>
          </div>
          <div className="stat-card">
            <Star size={24} />
            <span className="stat-value">{dashboardData.stats.averageScore}%</span>
            <span className="stat-label">Average Score</span>
          </div>
          <div className="stat-card">
            <Clock size={24} />
            <span className="stat-value">{Math.round(dashboardData.stats.studyTime / 60)}h</span>
            <span className="stat-label">Study Time</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <div className="section-header">
            <h2>Recent Flashcard Decks</h2>
            <Link to="/flashcards/create" className="create-deck-btn">
              <Plus size={20} />
              Create New Deck
            </Link>
          </div>

          <div className="decks-grid">
            {dashboardData.flashcards.slice(0, 3).map(deck => (
              <div key={deck.flashCardId} className="deck-card">
                <div className="deck-info">
                  <h3>{deck.subject}</h3>
                  <p>{deck.contents?.length || 0} cards</p>
                  <span className="category-badge">{deck.category}</span>
                </div>
                <div className="deck-actions">
                  <Link to={`/flashcards/study/${deck.flashCardId}`} className="btn-study">
                    Study Now
                  </Link>
                  {deck.contents?.length > 0 && (
                    <Link to={`/quiz/setup/${deck.flashCardId}`} className="btn-quiz">
                      Quiz
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {dashboardData.stats.recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                {activity.type === 'quiz' ? (
                  <>
                    <Brain className="activity-icon" />
                    <div className="activity-info">
                      <p>Completed quiz in {activity.subject}</p>
                      <span>Score: {activity.score}%</span>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle className="activity-icon" />
                    <div className="activity-info">
                      <p>Reviewed {activity.subject}</p>
                      <span>{activity.date.toLocaleDateString()}</span>
                    </div>
                  </>
                )}
              </div>
            ))}

            {dashboardData.stats.recentActivity.length === 0 && (
              <div className="no-activity">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
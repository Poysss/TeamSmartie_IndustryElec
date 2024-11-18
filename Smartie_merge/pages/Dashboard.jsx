import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Book, 
  Brain,
  Clock, 
  BarChart2,
  Plus,
  Layout,
  CheckCircle,
  Star,
  Loader
} from 'lucide-react';
import flashcardService from '../services/flashcard.service';
import quizService from '../services/quiz.service';
import reviewService from '../services/review.service';
import '../styles/pages/dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
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
      
      // Fetch all data in parallel
      const [flashcards, quizzes, reviews] = await Promise.all([
        flashcardService.getFlashcardByStudentId(user.studentId),
        quizService.getAllQuizzes(),
        reviewService.getAllReviews()
      ]);

      // Filter data for current user
      const userFlashcards = flashcards.filter(f => f.student?.studentId === user.studentId);
      const userQuizzes = quizzes.filter(q => q.flashCard?.student?.studentId === user.studentId);
      const userReviews = reviews.filter(r => r.flashCard?.student?.studentId === user.studentId);

      // Calculate statistics
      const stats = calculateStats(userFlashcards, userQuizzes, userReviews);

      setDashboardData({
        flashcards: userFlashcards,
        quizzes: userQuizzes,
        reviews: userReviews,
        stats
      });

      console.log('Dashboard data loaded:', {
        flashcards: userFlashcards,
        quizzes: userQuizzes,
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

    // Calculate total study time (implementation depends on your data structure)
    const totalTime = 0; // Replace with actual calculation based on your data

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
    ].sort((a, b) => b.date - a.date).slice(0, 5);

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
        <Loader className="animate-spin" />
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
            <span className="stat-value">{dashboardData.stats.studyTime}h</span>
            <span className="stat-label">Study Time</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h2>Quick Actions</h2>
          <div className="menu-grid">
            <Link to="/flashcards" className="menu-card">
              <div className="menu-icon">
                <Book size={24} />
              </div>
              <span className="menu-title">Flashcards</span>
            </Link>
            <Link to="/quiz" className="menu-card">
              <div className="menu-icon">
                <Brain size={24} />
              </div>
              <span className="menu-title">Quiz Mode</span>
            </Link>
            <Link to="/reviews" className="menu-card">
              <div className="menu-icon">
                <CheckCircle size={24} />
              </div>
              <span className="menu-title">Review</span>
            </Link>
            <Link to="/progress" className="menu-card">
              <div className="menu-icon">
                <BarChart2 size={24} />
              </div>
              <span className="menu-title">Progress</span>
            </Link>
          </div>
        </div>

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
                  <Link to={`/quiz/start/${deck.flashCardId}`} className="btn-quiz">
                    Quiz
                  </Link>
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
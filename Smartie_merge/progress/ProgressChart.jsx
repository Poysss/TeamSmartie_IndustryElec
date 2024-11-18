import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Award,
  Clock,
  Target,
  Calendar,
  BookOpen,
  Brain
} from 'lucide-react';
import './ProgressChart.css';

const ProgressChart = () => {
  const [timeframe, setTimeframe] = useState('week');
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sample data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // Replace this with actual API call
        const sampleData = [
          { date: '2023-11-01', score: 85, timeSpent: 25, subject: 'Math' },
          { date: '2023-11-02', score: 90, timeSpent: 30, subject: 'Science' },
          { date: '2023-11-03', score: 75, timeSpent: 20, subject: 'History' },
          { date: '2023-11-04', score: 95, timeSpent: 35, subject: 'Math' },
          { date: '2023-11-05', score: 88, timeSpent: 28, subject: 'Science' }
        ];
        setProgressData(sampleData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load progress data');
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  const calculateStats = () => {
    if (!progressData.length) return { avg: 0, best: 0, improvement: 0, totalTime: 0 };
    
    const scores = progressData.map(item => item.score);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const best = Math.max(...scores);
    const improvement = ((scores[scores.length - 1] - scores[0]) / scores[0]) * 100;
    const totalTime = progressData.reduce((sum, item) => sum + item.timeSpent, 0);

    return {
      avg: Math.round(avg),
      best: Math.round(best),
      improvement: Math.round(improvement),
      totalTime
    };
  };

  const stats = calculateStats();

  if (loading) {
    return <div className="progress-loading">Loading progress data...</div>;
  }

  if (error) {
    return <div className="progress-error">{error}</div>;
  }

  return (
    <div className="progress-chart-container">
      <div className="chart-header">
        <h1>Learning Progress</h1>
        <div className="timeframe-selector">
          <button 
            className={timeframe === 'week' ? 'active' : ''} 
            onClick={() => setTimeframe('week')}
          >
            Week
          </button>
          <button 
            className={timeframe === 'month' ? 'active' : ''} 
            onClick={() => setTimeframe('month')}
          >
            Month
          </button>
          <button 
            className={timeframe === 'all' ? 'active' : ''} 
            onClick={() => setTimeframe('all')}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Target size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.avg}%</span>
            <span className="stat-label">Average Score</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Award size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.best}%</span>
            <span className="stat-label">Best Score</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.improvement}%</span>
            <span className="stat-label">Improvement</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalTime}min</span>
            <span className="stat-label">Total Study Time</span>
          </div>
        </div>
      </div>

      <div className="progress-visualization">
        <h2>Score History</h2>
        <div className="progress-bars">
          {progressData.map((data, index) => (
            <div key={index} className="progress-bar-item">
              <div className="progress-bar-date">
                {new Date(data.date).toLocaleDateString()}
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${data.score}%` }}
                >
                  {data.score}%
                </div>
              </div>
              <div className="progress-bar-subject">
                {data.subject}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="subject-breakdown">
        <h2>Subject Performance</h2>
        <div className="subject-grid">
          {Array.from(new Set(progressData.map(data => data.subject))).map((subject, index) => {
            const subjectData = progressData.filter(data => data.subject === subject);
            const avgScore = Math.round(
              subjectData.reduce((sum, data) => sum + data.score, 0) / subjectData.length
            );

            return (
              <div key={index} className="subject-card">
                <div className="subject-icon">
                  <BookOpen size={24} />
                </div>
                <div className="subject-info">
                  <h3>{subject}</h3>
                  <div className="subject-stat">
                    <Brain size={16} />
                    <span>Avg. Score: {avgScore}%</span>
                  </div>
                  <div className="subject-stat">
                    <Calendar size={16} />
                    <span>{subjectData.length} Quizzes</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
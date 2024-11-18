import React from 'react';
import { 
  BookOpen, 
  Clock, 
  Target, 
  Award,
  TrendingUp,
  Calendar,
  BarChart2,
  Check
} from 'lucide-react';
import './ProgressStats.css';

const ProgressStats = ({ data }) => {
  const calculateSubjectStats = () => {
    const subjects = data.reduce((acc, item) => {
      const subject = item.flashCard.subject;
      if (!acc[subject]) {
        acc[subject] = {
          totalScore: item.score,
          count: 1,
          timeSpent: item.timeSpent,
          bestScore: item.score
        };
      } else {
        acc[subject].totalScore += item.score;
        acc[subject].count += 1;
        acc[subject].timeSpent += item.timeSpent;
        acc[subject].bestScore = Math.max(acc[subject].bestScore, item.score);
      }
      return acc;
    }, {});

    return Object.entries(subjects).map(([subject, stats]) => ({
      subject,
      avgScore: Math.round(stats.totalScore / stats.count),
      bestScore: stats.bestScore,
      timeSpent: stats.timeSpent,
      quizCount: stats.count
    }));
  };

  const subjectStats = calculateSubjectStats();

  return (
    <div className="progress-stats-container">
      <div className="stats-header">
        <h2>Progress Analysis</h2>
        <div className="header-stats">
          <div className="header-stat">
            <Calendar size={20} />
            <span>Last 30 Days</span>
          </div>
          <div className="header-stat">
            <Check size={20} />
            <span>{data.length} Quizzes Completed</span>
          </div>
        </div>
      </div>

      <div className="subject-stats">
        <h3>Performance by Subject</h3>
        <div className="subject-grid">
          {subjectStats.map(stat => (
            <div key={stat.subject} className="subject-card">
              <div className="subject-header">
                <h4>{stat.subject}</h4>
                <span className="quiz-count">{stat.quizCount} quizzes</span>
              </div>

              <div className="stats-row">
                <div className="stat">
                  <Target size={18} />
                  <div>
                    <span className="value">{stat.avgScore}%</span>
                    <span className="label">Avg. Score</span>
                  </div>
                </div>
                <div className="stat">
                  <Award size={18} />
                  <div>
                    <span className="value">{stat.bestScore}%</span>
                    <span className="label">Best Score</span>
                  </div>
                </div>
                <div className="stat">
                  <Clock size={18} />
                  <div>
                    <span className="value">{stat.timeSpent}min</span>
                    <span className="label">Time Spent</span>
                  </div>
                </div>
              </div>

              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${stat.avgScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="achievement-section">
        <h3>Recent Achievements</h3>
        <div className="achievement-grid">
          {data.some(item => item.score >= 90) && (
            <div className="achievement-card">
              <div className="achievement-icon">
                <Award size={24} />
              </div>
              <div className="achievement-info">
                <h4>Excellence</h4>
                <p>Scored 90% or higher in a quiz</p>
              </div>
            </div>
          )}
          {subjectStats.some(stat => stat.quizCount >= 5) && (
            <div className="achievement-card">
              <div className="achievement-icon">
                <BookOpen size={24} />
              </div>
              <div className="achievement-info">
                <h4>Dedicated Learner</h4>
                <p>Completed 5+ quizzes in a subject</p>
              </div>
            </div>
          )}
          {data.some(item => item.timeSpent >= 30) && (
            <div className="achievement-card">
              <div className="achievement-icon">
                <Clock size={24} />
              </div>
              <div className="achievement-info">
                <h4>Marathon Learner</h4>
                <p>Spent over 30 minutes in a single study session</p>
              </div>
            </div>
          )}
          {data.length >= 10 && (
            <div className="achievement-card">
              <div className="achievement-icon">
                <TrendingUp size={24} />
              </div>
              <div className="achievement-info">
                <h4>Consistent Learner</h4>
                <p>Completed 10+ quizzes</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="recommendations-section">
        <h3>Improvement Recommendations</h3>
        <div className="recommendations-grid">
          {subjectStats.map(stat => {
            if (stat.avgScore < 70) {
              return (
                <div key={`rec-${stat.subject}`} className="recommendation-card">
                  <BarChart2 size={20} />
                  <div className="recommendation-content">
                    <h4>{stat.subject}</h4>
                    <p>Focus on improving {stat.subject} with more practice. Current average: {stat.avgScore}%</p>
                  </div>
                </div>
              );
            }
            return null;
          })}
          {data.length < 5 && (
            <div className="recommendation-card">
              <Target size={20} />
              <div className="recommendation-content">
                <h4>Take More Quizzes</h4>
                <p>Complete more quizzes to get a better understanding of your progress</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressStats;
import React, { useState, useEffect } from 'react';
import { Book, Brain, Award } from 'lucide-react';
import ProgressChart from '../components/progress/ProgressChart';
import ProgressStats from '../components/progress/ProgressStats';
import progressService from '../services/progress.service';
import './ProgressPage.css';

const ProgressPage = () => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeframe, setTimeframe] = useState('month');

  useEffect(() => {
    loadProgressData();
  }, [timeframe]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const data = await progressService.getProgress(timeframe);
      setProgressData(data);
    } catch (err) {
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="progress-loading">Loading progress data...</div>;
  }

  if (error) {
    return <div className="progress-error">{error}</div>;
  }

  return (
    <div className="progress-page-container">
      <div className="progress-header">
        <h1>Learning Progress</h1>
        <div className="progress-overview">
          <div className="overview-card">
            <Book size={24} />
            <div className="overview-info">
              <span className="value">{progressData.length}</span>
              <span className="label">Total Quizzes</span>
            </div>
          </div>
          <div className="overview-card">
            <Brain size={24} />
            <div className="overview-info">
              <span className="value">
                {Math.round(progressData.reduce((sum, item) => sum + item.score, 0) / progressData.length)}%
              </span>
              <span className="label">Average Score</span>
            </div>
          </div>
          <div className="overview-card">
            <Award size={24} />
            <div className="overview-info">
              <span className="value">
                {Math.max(...progressData.map(item => item.score))}%
              </span>
              <span className="label">Best Score</span>
            </div>
          </div>
        </div>
      </div>

      <ProgressChart 
        data={progressData} 
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
      />
      
      <ProgressStats data={progressData} />
    </div>
  );
};

export default ProgressPage;
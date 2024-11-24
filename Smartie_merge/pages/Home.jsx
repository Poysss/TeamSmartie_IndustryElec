import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Brain, 
  CheckCircle, 
  BarChart2,
  Plus
} from 'lucide-react';
import '../styles/pages/home.css';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const quickActions = [
    {
      icon: <BookOpen size={24} />,
      title: 'Study Flashcards',
      description: 'Review your study materials',
      link: '/flashcards'
    },
    {
      icon: <Brain size={24} />,
      title: 'Take a Quiz',
      description: 'Test your knowledge',
      link: '/quiz'
    },
    {
      icon: <CheckCircle size={24} />,
      title: 'Review',
      description: 'Check your answers',
      link: '/reviews'
    },
    {
      icon: <BarChart2 size={24} />,
      title: 'Track Progress',
      description: 'Monitor your learning journey',
      link: '/progress'
    },
    {
      icon: <Plus size={24} />,
      title: 'Create New Deck',
      description: 'Add a new flashcard deck',
      link: '/flashcards/create'
    }
  ];

  return (
    <div className="home-container">
      <div className="home-header">
        <div className="welcome-section">
          <h1>Welcome, {user?.firstName || 'Student'}!</h1>
          <p>Let's continue your learning journey</p>
        </div>
      </div>

      <div className="actions-section">
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <Link to={action.link} key={index} className="action-card">
              <div className="action-icon">{action.icon}</div>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
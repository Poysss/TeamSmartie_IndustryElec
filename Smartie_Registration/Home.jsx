import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Brain, 
  Trophy, 
  Clock, 
  BarChart2, 
  CheckCircle 
} from 'lucide-react';
import '../styles/pages/home.css';

const Home = () => {
  const features = [
    {
      icon: <BookOpen size={32} />,
      title: 'Create Flashcards',
      description: 'Create and organize your study materials by subject and category'
    },
    {
      icon: <Brain size={32} />,
      title: 'Quiz Mode',
      description: 'Test your knowledge with different types of quizzes'
    },
    {
      icon: <Trophy size={32} />,
      title: 'Track Progress',
      description: 'Monitor your performance and see your improvement over time'
    },
    {
      icon: <Clock size={32} />,
      title: 'Study Timer',
      description: 'Manage your study sessions effectively'
    },
    {
      icon: <BarChart2 size={32} />,
      title: 'Analytics',
      description: 'Get detailed insights into your learning progress'
    },
    {
      icon: <CheckCircle size={32} />,
      title: 'Review System',
      description: 'Review and reinforce your knowledge systematically'
    }
  ];

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="slide-up">Welcome to Smartie</h1>
          <p className="fade-in">Your personalized learning companion for effective studying</p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Smartie?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Learning?</h2>
          <p>Join thousands of students improving their study habits with Smartie</p>
          <Link to="/register" className="btn-primary">Create Free Account</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

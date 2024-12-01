import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import FlashcardList from './components/flashcard/FlashcardList';
import FlashcardForm from './components/flashcard/FlashcardForm';
import FlashcardStudy from './components/flashcard/FlashcardStudy';
import QuizList from './components/quiz/QuizList';
import QuizForm from './components/quiz/QuizForm';
import QuizMode from './components/quiz/QuizMode';
import QuizComplete from './components/quiz/QuizComplete';
import ReviewList from './components/review/ReviewList';
import ReviewDetails from './components/review/ReviewDetails';
import ProgressChart from './components/progress/ProgressChart';
import NotFound from './pages/NotFound';
import Footer from './components/layout/Footer';
import authService from './services/auth.service';
import { Loader } from 'lucide-react';
import './styles/main.css';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Loader className="animate-spin" size={24} />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return !isAuthenticated ? children : <Navigate to="/home" />;
};

const App = () => {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (initialLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Loader className="animate-spin" size={32} />
          <span>Loading Smartie...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <Landing />
                </PublicRoute>
              } 
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Flashcard Routes */}
            <Route
              path="/flashcards"
              element={
                <ProtectedRoute>
                  <FlashcardList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flashcards/create"
              element={
                <ProtectedRoute>
                  <FlashcardForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flashcards/edit/:id"
              element={
                <ProtectedRoute>
                  <FlashcardForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/flashcards/study/:id"
              element={
                <ProtectedRoute>
                  <FlashcardStudy />
                </ProtectedRoute>
              }
            />

            {/* Quiz Routes */}
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <QuizList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/setup/:flashcardId"
              element={
                <ProtectedRoute>
                  <QuizForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/start/:quizId"
              element={
                <ProtectedRoute>
                  <QuizMode />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz/complete/:quizId"
              element={
                <ProtectedRoute>
                  <QuizComplete />
                </ProtectedRoute>
              }
            />

            {/* Review Routes */}
            <Route
              path="/reviews"
              element={
                <ProtectedRoute>
                  <ReviewList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviews/:id"
              element={
                <ProtectedRoute>
                  <ReviewDetails />
                </ProtectedRoute>
              }
            />

            {/* Progress Route */}
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <ProgressChart />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
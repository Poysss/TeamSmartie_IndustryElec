import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Book, 
  Brain,
  Search,
  Filter,
  Loader,
  BookOpen 
} from 'lucide-react';
import flashcardService from '../../services/flashcard.service';
import './FlashcardList.css';

const FlashcardList = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [user] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load flashcards and contents in parallel
      const [flashcardsData, contentsData] = await Promise.all([
        flashcardService.getAllFlashcards(),
        flashcardService.getFlashcardContents()
      ]);

      console.log('Loaded flashcards:', flashcardsData);
      console.log('Loaded contents:', contentsData);

      // Filter flashcards for current user
      const userFlashcards = flashcardsData.filter(
        flashcard => flashcard.student?.studentId === user.studentId
      );

      // Map contents to flashcards
      const flashcardsWithContents = userFlashcards.map(flashcard => ({
        ...flashcard,
        contents: contentsData.filter(
          content => content.flashCard?.flashCardId === flashcard.flashCardId
        )
      }));

      setFlashcards(flashcardsWithContents);
      setContents(contentsData);
      setLoading(false);
    } catch (err) {
      console.error('Error loading flashcards:', err);
      setError('Failed to load flashcards');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this flashcard? This action cannot be undone.')) {
      try {
        await flashcardService.deleteFlashcard(id);
        setFlashcards(prev => prev.filter(card => card.flashCardId !== id));
      } catch (err) {
        console.error('Error deleting flashcard:', err);
        setError('Failed to delete flashcard');
      }
    }
  };

  const filteredFlashcards = flashcards.filter(card => {
    const matchesSearch = (
      card.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesFilter = filter === 'all' || card.category === filter;
    return matchesSearch && matchesFilter;
  });

  const categories = [...new Set(flashcards.map(card => card.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="flashcard-loading">
        <div className="loading-content">
          <Loader className="animate-spin" size={24} />
          <span>Loading flashcards...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-list-container">
      <div className="flashcard-header">
        <h1>My Flashcards</h1>
        <Link to="/flashcards/create" className="create-btn">
          <Plus size={20} />
          Create New Deck
        </Link>
      </div>

      <div className="flashcard-controls">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by subject or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-dropdown">
          <Filter size={20} />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      <div className="flashcard-grid">
        {filteredFlashcards.map(flashcard => (
          <div key={flashcard.flashCardId} className="flashcard-item">
            <div className="flashcard-content">
              <div className="flashcard-icon">
                <Book size={24} />
              </div>
              <h3>{flashcard.subject}</h3>
              <span className="category-badge">{flashcard.category}</span>
              <p>{flashcard.contents?.length || 0} cards</p>
              
              {flashcard.contents && flashcard.contents.length > 0 && (
                <div className="content-preview">
                  <p className="preview-label">Sample Question:</p>
                  <p className="preview-text">{flashcard.contents[0].question}</p>
                </div>
              )}
            </div>
            
            <div className="flashcard-actions">
              <Link 
                to={`/flashcards/study/${flashcard.flashCardId}`}
                className="action-btn study-btn"
                title="Study Cards"
              >
                <BookOpen size={18} />
                Study
              </Link>
              <Link 
                to={`/quiz/setup/${flashcard.flashCardId}`}
                className="action-btn quiz-btn"
                title="Take Quiz"
              >
                <Brain size={18} />
                Quiz
              </Link>
              <Link 
                to={`/flashcards/edit/${flashcard.flashCardId}`}
                className="action-btn edit-btn"
                title="Edit Deck"
              >
                <Edit2 size={18} />
              </Link>
              <button 
                className="action-btn delete-btn"
                onClick={() => handleDelete(flashcard.flashCardId)}
                title="Delete Deck"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {!loading && !error && filteredFlashcards.length === 0 && (
        <div className="empty-state">
          <Book size={48} />
          <h2>No Flashcards Found</h2>
          <p>{searchTerm ? 'No flashcards match your search.' : 'Create your first flashcard deck to get started!'}</p>
          <Link to="/flashcards/create" className="create-btn">
            <Plus size={20} />
            Create New Deck
          </Link>
        </div>
      )}
    </div>
  );
};

export default FlashcardList;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Plus, 
  Minus, 
  Save, 
  ArrowLeft,
  AlertTriangle,
  BookOpen,
  Bookmark,
  Loader
} from 'lucide-react';
import flashcardService from '../../services/flashcard.service';
import './FlashcardForm.css';

const FlashcardForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    contents: [{ 
      question: '',
      answer: '',
      numberOfQuestion: 1
    }]
  });

  useEffect(() => {
    if (id) {
      loadFlashcard();
    }
  }, [id]);

  const loadFlashcard = async () => {
    try {
      setLoading(true);
      const flashcard = await flashcardService.getFlashcardById(id);
      const contents = await flashcardService.getFlashcardContentsById(id);
      
      console.log('Loaded flashcard:', flashcard);
      console.log('Loaded contents:', contents);

      if (flashcard) {
        setFormData({
          subject: flashcard.subject,
          category: flashcard.category,
          contents: contents.length > 0 
            ? contents.sort((a, b) => a.numberOfQuestion - b.numberOfQuestion)
                .map(content => ({
                  contentId: content.contentId,
                  question: content.question,
                  answer: content.answer,
                  numberOfQuestion: content.numberOfQuestion,
                  flashCardId: content.flashCard.flashCardId
                }))
            : [{
                question: '',
                answer: '',
                numberOfQuestion: 1
              }]
        });
      }
    } catch (err) {
      console.error('Error loading flashcard:', err);
      setError('Failed to load flashcard');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleContentChange = (index, field, value) => {
    const newContents = [...formData.contents];
    newContents[index] = {
      ...newContents[index],
      [field]: value
    };
    setFormData({
      ...formData,
      contents: newContents
    });
    if (error) setError('');
  };

  const addContent = () => {
    setFormData({
      ...formData,
      contents: [
        ...formData.contents,
        {
          question: '',
          answer: '',
          numberOfQuestion: formData.contents.length + 1
        }
      ]
    });
  };

  const removeContent = (index) => {
    if (formData.contents.length > 1) {
      const newContents = formData.contents.filter((_, i) => i !== index)
        .map((content, i) => ({
          ...content,
          numberOfQuestion: i + 1
        }));
      setFormData({
        ...formData,
        contents: newContents
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData) {
        throw new Error('User not authenticated');
      }

      const flashcardData = {
        subject: formData.subject,
        category: formData.category,
        student: { studentId: userData.studentId }
      };

      if (id) {
        // Update existing flashcard
        flashcardData.flashCardId = id;
        await flashcardService.updateFlashcard(flashcardData);
        
        // Handle content updates
        for (const content of formData.contents) {
          if (content.contentId) {
            // Update existing content
            await flashcardService.updateFlashcardContent({
              contentId: content.contentId,
              flashCard: { flashCardId: id },
              numberOfQuestion: content.numberOfQuestion,
              question: content.question,
              answer: content.answer
            });
          } else {
            // Create new content
            await flashcardService.createFlashcardContent({
              flashCard: { flashCardId: id },
              numberOfQuestion: content.numberOfQuestion,
              question: content.question,
              answer: content.answer
            });
          }
        }

        // Handle deleted contents
        const currentContentIds = formData.contents
          .filter(c => c.contentId)
          .map(c => c.contentId);
        
        const originalContents = await flashcardService.getFlashcardContentsById(id);
        const deletedContents = originalContents.filter(
          c => !currentContentIds.includes(c.contentId)
        );

        // Delete removed contents
        for (const content of deletedContents) {
          await flashcardService.deleteFlashcardContent(content.contentId);
        }

      } else {
        // Create new flashcard with contents
        await flashcardService.createFlashcardWithContents(flashcardData, formData.contents);
      }

      navigate('/flashcards');
    } catch (err) {
      console.error('Error saving flashcard:', err);
      setError(err.message || 'Failed to save flashcard');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.subject) {
    return (
      <div className="loading-container">
        <Loader className="animate-spin" />
        <span>Loading flashcard...</span>
      </div>
    );
  }

  return (
    <div className="flashcard-form-container">
      <div className="form-header">
        <button 
          className="back-button" 
          onClick={() => navigate('/flashcards')}
        >
          <ArrowLeft size={20} />
          Back to Flashcards
        </button>
        <h1>{id ? 'Edit Flashcard' : 'Create New Flashcard'}</h1>
      </div>

      {error && (
        <div className="error-message">
          <AlertTriangle size={20} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flashcard-form">
        <div className="form-section">
          <h2>
            <BookOpen size={20} />
            Flashcard Information
          </h2>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Enter subject name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>
              <Bookmark size={20} />
              Content Cards
            </h2>
            <button 
              type="button" 
              className="add-content-btn"
              onClick={addContent}
            >
              <Plus size={20} />
              Add Card
            </button>
          </div>

          {formData.contents.map((content, index) => (
            <div key={content.contentId || index} className="content-card">
              <div className="content-header">
                <h3>Card {index + 1}</h3>
                {formData.contents.length > 1 && (
                  <button 
                    type="button"
                    className="remove-content-btn"
                    onClick={() => removeContent(index)}
                  >
                    <Minus size={18} />
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>Question</label>
                <input
                  type="text"
                  value={content.question}
                  onChange={(e) => handleContentChange(index, 'question', e.target.value)}
                  placeholder="Enter question"
                  required
                />
              </div>

              <div className="form-group">
                <label>Answer</label>
                <input
                  type="text"
                  value={content.answer}
                  onChange={(e) => handleContentChange(index, 'answer', e.target.value)}
                  placeholder="Enter answer"
                  required
                />
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate('/flashcards')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="save-btn"
            disabled={loading}
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Flashcard'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlashcardForm;
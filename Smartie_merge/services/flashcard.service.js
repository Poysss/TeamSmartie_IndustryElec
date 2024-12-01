import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const flashcardService = {
  async getAllFlashcards() {
    try {
      const response = await axios.get(`${API_URL}/flashcard/get`);
      return response.data;
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      throw error;
    }
  },

  async getFlashcardById(id) {
    try {
      if (!id) {
        throw new Error('Flashcard ID is required');
      }

      const flashcards = await this.getAllFlashcards();
      const flashcard = flashcards.find(
        card => card.flashCardId.toString() === id.toString()
      );

      if (!flashcard) {
        throw new Error('Flashcard not found');
      }

      // Get contents for this flashcard
      const contents = await this.getFlashcardContentsById(flashcard.flashCardId);
      return {
        ...flashcard,
        contents
      };
    } catch (error) {
      console.error('Error fetching flashcard by ID:', error);
      throw error;
    }
  },

  async getFlashcardByStudentId(studentId) {
    try {
      if (!studentId) {
        throw new Error('Student ID is required');
      }

      const allFlashcards = await this.getAllFlashcards();
      const studentFlashcards = allFlashcards.filter(
        flashcard => flashcard.student?.studentId === studentId
      );
      
      // Get contents for each flashcard
      const flashcardsWithContents = await Promise.all(
        studentFlashcards.map(async (flashcard) => {
          const contents = await this.getFlashcardContentsById(flashcard.flashCardId);
          return {
            ...flashcard,
            contents: contents || []
          };
        })
      );

      return flashcardsWithContents;
    } catch (error) {
      console.error('Error fetching student flashcards:', error);
      throw error;
    }
  },

  async getFlashcardContents() {
    try {
      const response = await axios.get(`${API_URL}/content/get`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contents:', error);
      throw error;
    }
  },

  async getFlashcardContentsById(flashcardId) {
    try {
      if (!flashcardId) {
        throw new Error('Flashcard ID is required');
      }

      const contents = await this.getFlashcardContents();
      return contents
        .filter(content => 
          content.flashCard?.flashCardId.toString() === flashcardId.toString()
        )
        .sort((a, b) => a.numberOfQuestion - b.numberOfQuestion);
    } catch (error) {
      console.error('Error fetching flashcard contents:', error);
      throw error;
    }
  },

  async createFlashcard(flashcardData) {
    try {
      if (!flashcardData.student?.studentId) {
        throw new Error('Student ID is required');
      }

      const response = await axios.post(`${API_URL}/flashcard/add`, {
        subject: flashcardData.subject,
        category: flashcardData.category,
        student: { studentId: flashcardData.student.studentId }
      });

      return response.data;
    } catch (error) {
      console.error('Error creating flashcard:', error);
      throw error;
    }
  },

  async createFlashcardContent(contentData) {
    try {
      if (!contentData.flashCard?.flashCardId) {
        throw new Error('Flashcard ID is required');
      }

      const response = await axios.post(`${API_URL}/content/add`, {
        flashCard: { flashCardId: contentData.flashCard.flashCardId },
        numberOfQuestion: contentData.numberOfQuestion || 1,
        question: contentData.question,
        answer: contentData.answer
      });

      return response.data;
    } catch (error) {
      console.error('Error creating content:', error);
      throw error;
    }
  },

  async createFlashcardWithContents(flashcardData, contents) {
    try {
      // First create the flashcard
      const flashcard = await this.createFlashcard(flashcardData);

      // Then create each content item
      const contentPromises = contents.map((content, index) =>
        this.createFlashcardContent({
          flashCard: { flashCardId: flashcard.flashCardId },
          numberOfQuestion: index + 1,
          question: content.question,
          answer: content.answer
        })
      );
      
      const createdContents = await Promise.all(contentPromises);

      return {
        ...flashcard,
        contents: createdContents
      };
    } catch (error) {
      console.error('Error creating flashcard with contents:', error);
      throw error;
    }
  },

  async updateFlashcard(flashcardData) {
    try {
      if (!flashcardData.flashCardId) {
        throw new Error('Flashcard ID is required');
      }

      const response = await axios.put(`${API_URL}/flashcard/update`, {
        flashCardId: flashcardData.flashCardId,
        subject: flashcardData.subject,
        category: flashcardData.category,
        student: flashcardData.student
      });

      return response.data;
    } catch (error) {
      console.error('Error updating flashcard:', error);
      throw error;
    }
  },

  async updateFlashcardContent(contentData) {
    try {
      if (!contentData.contentId || !contentData.flashCard?.flashCardId) {
        throw new Error('Content ID and Flashcard ID are required');
      }

      const response = await axios.put(`${API_URL}/content/update`, {
        contentId: contentData.contentId,
        flashCard: { flashCardId: contentData.flashCard.flashCardId },
        numberOfQuestion: contentData.numberOfQuestion,
        question: contentData.question,
        answer: contentData.answer
      });

      return response.data;
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  },

  async deleteFlashcard(flashcardId) {
    try {
      if (!flashcardId) {
        throw new Error('Flashcard ID is required');
      }

      // First, delete all contents associated with this flashcard
      const contents = await this.getFlashcardContentsById(flashcardId);
      await Promise.all(
        contents.map(content => this.deleteFlashcardContent(content.contentId))
      );

      // Then delete the flashcard
      const response = await axios.delete(`${API_URL}/flashcard/delete/${flashcardId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      throw error;
    }
  },

  async deleteFlashcardContent(contentId) {
    try {
      if (!contentId) {
        throw new Error('Content ID is required');
      }

      const response = await axios.delete(`${API_URL}/content/delete/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  }
};

export default flashcardService;

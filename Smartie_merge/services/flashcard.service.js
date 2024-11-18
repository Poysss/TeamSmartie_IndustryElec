import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const flashcardService = {
  // Flashcard operations
  async getAllFlashcards() {
    try {
      const response = await axios.get(`${API_URL}/flashcard/get`);
      console.log('Fetched flashcards:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      throw error;
    }
  },

  async getFlashcardById(id) {
    try {
      const flashcards = await this.getAllFlashcards();
      const flashcard = flashcards.find(card => card.flashCardId.toString() === id.toString());
      if (flashcard) {
        // Get the contents for this flashcard
        const contents = await this.getFlashcardContents();
        flashcard.contents = contents.filter(content => 
          content.flashCard && content.flashCard.flashCardId === flashcard.flashCardId
        );
      }
      console.log('Fetched flashcard by ID:', flashcard);
      return flashcard;
    } catch (error) {
      console.error('Error fetching flashcard by ID:', error);
      throw error;
    }
  },

  async createFlashcard(flashcardData) {
    try {
      const response = await axios.post(`${API_URL}/flashcard/add`, {
        subject: flashcardData.subject,
        category: flashcardData.category,
        student: flashcardData.student
      });
      console.log('Created flashcard:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating flashcard:', error);
      throw error;
    }
  },

  async updateFlashcard(flashcardData) {
    try {
      const response = await axios.put(`${API_URL}/flashcard/update`, {
        flashCardId: flashcardData.flashCardId,
        subject: flashcardData.subject,
        category: flashcardData.category,
        student: flashcardData.student
      });
      console.log('Updated flashcard:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating flashcard:', error);
      throw error;
    }
  },

  async deleteFlashcard(flashcardId) {
    try {
      const response = await axios.delete(`${API_URL}/flashcard/delete/${flashcardId}`);
      console.log('Deleted flashcard:', flashcardId);
      return response.data;
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      throw error;
    }
  },

  // Flashcard content operations
  async getFlashcardContents() {
    try {
      const response = await axios.get(`${API_URL}/content/get`);
      console.log('Fetched contents:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching contents:', error);
      throw error;
    }
  },

  async createFlashcardContent(contentData) {
    try {
      const response = await axios.post(`${API_URL}/content/add`, {
        flashCard: { flashCardId: contentData.flashCardId },
        numberOfQuestion: contentData.numberOfQuestion,
        question: contentData.question,
        answer: contentData.answer
      });
      console.log('Created content:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating content:', error);
      throw error;
    }
  },

  async updateFlashcardContent(contentData) {
    try {
      const response = await axios.put(`${API_URL}/content/update`, {
        contentId: contentData.contentId,
        flashCard: contentData.flashCard,
        numberOfQuestion: contentData.numberOfQuestion,
        question: contentData.question,
        answer: contentData.answer
      });
      console.log('Updated content:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  },

  async deleteFlashcardContent(contentId) {
    try {
      const response = await axios.delete(`${API_URL}/content/delete/${contentId}`);
      console.log('Deleted content:', contentId);
      return response.data;
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  },

  // Combined operations
  async createFlashcardWithContents(flashcardData, contents) {
    try {
      console.log('Creating flashcard with contents:', { flashcardData, contents });
      
      // First create the flashcard
      const flashcard = await this.createFlashcard(flashcardData);
      console.log('Created flashcard:', flashcard);

      // Then create each content item
      const contentPromises = contents.map(content =>
        this.createFlashcardContent({
          flashCardId: flashcard.flashCardId,
          numberOfQuestion: content.numberOfQuestion,
          question: content.question,
          answer: content.answer
        })
      );
      
      const createdContents = await Promise.all(contentPromises);
      console.log('Created contents:', createdContents);

      // Return the flashcard with its contents
      return {
        ...flashcard,
        contents: createdContents
      };
    } catch (error) {
      console.error('Error creating flashcard with contents:', error);
      throw error;
    }
  },

  async getFlashcardByStudentId(studentId) {
    try {
      const allFlashcards = await this.getAllFlashcards();
      const studentFlashcards = allFlashcards.filter(
        flashcard => flashcard.student && flashcard.student.studentId === studentId
      );
      
      // Get contents for each flashcard
      const flashcardsWithContents = await Promise.all(
        studentFlashcards.map(async (flashcard) => {
          const contents = await this.getFlashcardContents();
          return {
            ...flashcard,
            contents: contents.filter(
              content => content.flashCard && content.flashCard.flashCardId === flashcard.flashCardId
            )
          };
        })
      );

      console.log('Fetched student flashcards:', flashcardsWithContents);
      return flashcardsWithContents;
    } catch (error) {
      console.error('Error fetching student flashcards:', error);
      throw error;
    }
  },

  async getFlashcardContentsById(flashcardId) {
    try {
      const contents = await this.getFlashcardContents();
      const flashcardContents = contents.filter(
        content => content.flashCard && content.flashCard.flashCardId.toString() === flashcardId.toString()
      );
      console.log('Fetched flashcard contents:', flashcardContents);
      return flashcardContents;
    } catch (error) {
      console.error('Error fetching flashcard contents:', error);
      throw error;
    }
  },

  async updateFlashcardWithContents(flashcardId, flashcardData, contents) {
    try {
      console.log('Updating flashcard with contents:', { flashcardId, flashcardData, contents });

      // Update the flashcard
      const updatedFlashcard = await this.updateFlashcard({
        flashCardId: flashcardId,
        ...flashcardData
      });

      // Get existing contents
      const existingContents = await this.getFlashcardContentsById(flashcardId);

      // Update or create contents
      const contentPromises = contents.map(async (content) => {
        const existingContent = existingContents.find(
          ec => ec.numberOfQuestion === content.numberOfQuestion
        );

        if (existingContent) {
          // Update existing content
          return this.updateFlashcardContent({
            contentId: existingContent.contentId,
            flashCard: { flashCardId: flashcardId },
            ...content
          });
        } else {
          // Create new content
          return this.createFlashcardContent({
            flashCardId: flashcardId,
            ...content
          });
        }
      });

      const updatedContents = await Promise.all(contentPromises);
      console.log('Updated contents:', updatedContents);

      return {
        ...updatedFlashcard,
        contents: updatedContents
      };
    } catch (error) {
      console.error('Error updating flashcard with contents:', error);
      throw error;
    }
  }
};

export default flashcardService;
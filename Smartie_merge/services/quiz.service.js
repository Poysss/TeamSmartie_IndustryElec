import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const quizService = {
  async getAllQuizzes() {
    try {
      const response = await axios.get(`${API_URL}/quiz/get`);
      console.log('Fetched quizzes:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      return [];
    }
  },

  async getQuizById(quizId) {
    try {
      const [quizResponse, contentsResponse] = await Promise.all([
        axios.get(`${API_URL}/quiz/get`),
        axios.get(`${API_URL}/content/get`)
      ]);

      const quiz = quizResponse.data.find(q => q.quizModeId.toString() === quizId.toString());
      
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      const contents = contentsResponse.data.filter(
        content => content.flashCard?.flashCardId === quiz.flashCard?.flashCardId
      );

      return {
        ...quiz,
        contents: contents.sort((a, b) => a.numberOfQuestion - b.numberOfQuestion)
      };
    } catch (error) {
      console.error('Error getting quiz:', error);
      throw error;
    }
  },

  async getQuizzesByStudent(studentId) {
    try {
      const [quizResponse, flashcardsResponse] = await Promise.all([
        axios.get(`${API_URL}/quiz/get`),
        axios.get(`${API_URL}/flashcard/get`)
      ]);

      // First get all flashcards for this student
      const studentFlashcards = flashcardsResponse.data.filter(
        flashcard => flashcard.student?.studentId.toString() === studentId.toString()
      );

      if (studentFlashcards.length === 0) {
        return [];
      }

      // Then get quizzes for those flashcards
      const studentQuizzes = quizResponse.data.filter(quiz => 
        studentFlashcards.some(
          flashcard => flashcard.flashCardId === quiz.flashCard?.flashCardId
        )
      );

      // Get contents for each quiz
      const contentsResponse = await axios.get(`${API_URL}/content/get`);
      const quizzesWithContents = studentQuizzes.map(quiz => ({
        ...quiz,
        contents: contentsResponse.data.filter(
          content => content.flashCard?.flashCardId === quiz.flashCard?.flashCardId
        ).sort((a, b) => a.numberOfQuestion - b.numberOfQuestion)
      }));

      console.log('Student quizzes with contents:', quizzesWithContents);
      return quizzesWithContents;
    } catch (error) {
      console.error('Error fetching student quizzes:', error);
      return [];
    }
  },

  async createQuiz(formData) {
    try {
      console.log('Creating quiz with data:', formData);
      const response = await axios.post(`${API_URL}/quiz/add`, {
        flashCard: { flashCardId: formData.flashCardId },
        flashCardContent: { contentId: formData.contentId },
        difficultyLevel: formData.difficultyLevel,
        typeOfQuiz: formData.typeOfQuiz,
        score: 0
      });
      console.log('Created quiz:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw new Error('Failed to create quiz');
    }
  },

  async setupQuiz(flashcardId, settings) {
    try {
      // Get flashcard details
      const flashcardResponse = await axios.get(`${API_URL}/flashcard/get`);
      const flashcard = flashcardResponse.data.find(
        f => f.flashCardId.toString() === flashcardId.toString()
      );

      if (!flashcard) {
        throw new Error('Flashcard not found');
      }

      // Get contents
      const contentsResponse = await axios.get(`${API_URL}/content/get`);
      const contents = contentsResponse.data.filter(
        content => content.flashCard?.flashCardId.toString() === flashcardId.toString()
      );

      if (!contents.length) {
        throw new Error('No contents found for this flashcard');
      }

      // Create quiz
      const quiz = await this.createQuiz({
        flashCardId: flashcardId,
        contentId: contents[0].contentId,
        ...settings
      });

      return {
        ...quiz,
        flashCard: flashcard,
        contents: contents.sort((a, b) => a.numberOfQuestion - b.numberOfQuestion)
      };
    } catch (error) {
      console.error('Error setting up quiz:', error);
      throw error;
    }
  },

  async updateQuiz(quizId, updateData) {
    try {
      const response = await axios.put(`${API_URL}/quiz/update`, {
        quizModeId: quizId,
        ...updateData
      });
      return response.data;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw new Error('Failed to update quiz');
    }
  },

  async submitQuiz(quizId, results) {
    try {
      // Update quiz with results
      const updatedQuiz = await this.updateQuiz(quizId, {
        flashCard: { flashCardId: results.flashCardId },
        flashCardContent: { contentId: results.contentId },
        difficultyLevel: results.difficultyLevel,
        typeOfQuiz: results.typeOfQuiz,
        score: results.score
      });

      // Create reviews for incorrect answers
      if (results.incorrectAnswers?.length) {
        const reviewPromises = results.incorrectAnswers.map(answer =>
          axios.post(`${API_URL}/review/add`, {
            flashCard: { flashCardId: results.flashCardId },
            reviewIncorrectAnswer: answer.userAnswer,
            reviewCorrectAnswer: answer.correctAnswer
          })
        );
        await Promise.all(reviewPromises);
      }

      // Update progress
      await axios.post(`${API_URL}/progress/add`, {
        flashCard: { flashCardId: results.flashCardId },
        score: results.score,
        timeSpent: results.timeSpent || 0,
        scoreComparison: this.getScoreComparison(results.score)
      });

      return updatedQuiz;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw new Error('Failed to submit quiz');
    }
  },

  getScoreComparison(score) {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 75) return 'GOOD';
    if (score >= 60) return 'FAIR';
    return 'NEEDS_IMPROVEMENT';
  }
};

export default quizService;
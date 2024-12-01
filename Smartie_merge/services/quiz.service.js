import axios from 'axios';

const API_URL = 'http://localhost:8080';

const quizService = {
  async getAllQuizzes() {
    try {
      const response = await axios.get(`${API_URL}/quiz/get`);
      console.log('Fetched quizzes:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
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

      // Verify quiz belongs to current user
      const userData = JSON.parse(localStorage.getItem('user'));
      if (quiz.flashCard?.student?.studentId !== userData.studentId) {
        throw new Error('Unauthorized access to quiz');
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

      const studentFlashcardIds = studentFlashcards.map(f => f.flashCardId);

      // Then filter quizzes to only include those for the student's flashcards
      const studentQuizzes = quizResponse.data.filter(quiz => 
        studentFlashcardIds.includes(quiz.flashCard?.flashCardId)
      );

      // Get contents for each quiz
      const contentsResponse = await axios.get(`${API_URL}/content/get`);
      const quizzesWithContents = await Promise.all(studentQuizzes.map(async quiz => {
        const quizContents = contentsResponse.data.filter(
          content => content.flashCard?.flashCardId === quiz.flashCard?.flashCardId
        ).sort((a, b) => a.numberOfQuestion - b.numberOfQuestion);

        return {
          ...quiz,
          contents: quizContents
        };
      }));

      return quizzesWithContents;
    } catch (error) {
      console.error('Error fetching student quizzes:', error);
      throw error;
    }
  },

  async setupQuiz(quizData) {
    try {
      // Verify user owns the flashcard
      const userData = JSON.parse(localStorage.getItem('user'));
      const flashcardResponse = await axios.get(`${API_URL}/flashcard/get`);
      const flashcard = flashcardResponse.data.find(
        f => f.flashCardId.toString() === quizData.flashCardId.toString()
      );

      if (!flashcard || flashcard.student?.studentId !== userData.studentId) {
        throw new Error('Unauthorized access to flashcard');
      }

      // Get contents
      const contentsResponse = await axios.get(`${API_URL}/content/get`);
      const contents = contentsResponse.data.filter(
        content => content.flashCard?.flashCardId.toString() === quizData.flashCardId.toString()
      );

      if (!contents.length) {
        throw new Error('No contents found for this flashcard');
      }

      // Format quiz data
      const formattedQuizData = {
        flashCard: { flashCardId: quizData.flashCardId },
        flashCardContent: { contentId: contents[0].contentId },
        difficultyLevel: quizData.difficultyLevel,
        typeOfQuiz: 'IDENTIFICATION',
        score: 0,
        timeLimit: quizData.timeLimit,
        randomizeQuestions: quizData.randomizeQuestions
      };

      // Create quiz
      const response = await axios.post(`${API_URL}/quiz/add`, formattedQuizData);
      
      return {
        ...response.data,
        flashCard: flashcard,
        contents,
        timeLimit: quizData.timeLimit,
        randomizeQuestions: quizData.randomizeQuestions
      };
    } catch (error) {
      console.error('Error setting up quiz:', error);
      throw error;
    }
  },

  async updateQuiz(quizId, updateData) {
    try {
      // Verify user owns the quiz
      const userData = JSON.parse(localStorage.getItem('user'));
      const quizResponse = await axios.get(`${API_URL}/quiz/get`);
      const quiz = quizResponse.data.find(q => q.quizModeId.toString() === quizId.toString());

      if (!quiz || quiz.flashCard?.student?.studentId !== userData.studentId) {
        throw new Error('Unauthorized access to quiz');
      }

      const response = await axios.put(`${API_URL}/quiz/update`, {
        quizModeId: quizId,
        ...updateData
      });

      return response.data;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  },

  async deleteQuiz(quizId) {
    try {
      // Verify user owns the quiz
      const userData = JSON.parse(localStorage.getItem('user'));
      const quizResponse = await axios.get(`${API_URL}/quiz/get`);
      const quiz = quizResponse.data.find(q => q.quizModeId.toString() === quizId.toString());

      if (!quiz || quiz.flashCard?.student?.studentId !== userData.studentId) {
        throw new Error('Unauthorized access to quiz');
      }

      const response = await axios.delete(`${API_URL}/quiz/delete/${quizId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  },

  checkAnswer(userAnswer, correctAnswer) {
    if (!userAnswer || !correctAnswer) return false;

    // Normalize answers for comparison
    const normalizedUser = userAnswer.toLowerCase().trim();
    const normalizedCorrect = correctAnswer.toLowerCase().trim();

    // Direct match
    if (normalizedUser === normalizedCorrect) return true;

    // Split into words and check if all correct words are present
    const userWords = normalizedUser.split(/\s+/).filter(word => word.length > 0);
    const correctWords = normalizedCorrect.split(/\s+/).filter(word => word.length > 0);

    // Check if all correct words are present in user answer
    return correctWords.every(word => userWords.includes(word));
  },

  async submitQuiz(quizId, results) {
    try {
      // Update quiz with results
      const updatedQuiz = await this.updateQuiz(quizId, {
        flashCard: { flashCardId: results.flashCardId },
        flashCardContent: { contentId: results.contentId },
        difficultyLevel: results.difficultyLevel,
        typeOfQuiz: 'IDENTIFICATION',
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
      throw error;
    }
  },

  getScoreComparison(score) {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 75) return 'GOOD';
    if (score >= 60) return 'FAIR';
    return 'NEEDS_IMPROVEMENT';
  },

  getTimeLimit(difficulty) {
    switch (difficulty) {
      case 'EASY': return 600; // 10 minutes
      case 'MEDIUM': return 300; // 5 minutes
      case 'HARD': return 180; // 3 minutes
      default: return 300; // Default to 5 minutes
    }
  }
};

export default quizService;

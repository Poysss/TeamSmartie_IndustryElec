import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const reviewService = {
  async getAllReviews() {
    try {
      const response = await axios.get(`${API_URL}/review/get`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getReviewById(id) {
    try {
      const response = await axios.get(`${API_URL}/review/get/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createReview(reviewData) {
    try {
      const response = await axios.post(`${API_URL}/review/add`, {
        flashCard: { flashCardId: reviewData.flashCardId },
        reviewIncorrectAnswer: reviewData.reviewIncorrectAnswer,
        reviewCorrectAnswer: reviewData.reviewCorrectAnswer
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updateReview(reviewData) {
    try {
      const response = await axios.put(`${API_URL}/review/update`, {
        reviewId: reviewData.reviewId,
        flashCard: { flashCardId: reviewData.flashCardId },
        reviewIncorrectAnswer: reviewData.reviewIncorrectAnswer,
        reviewCorrectAnswer: reviewData.reviewCorrectAnswer
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async deleteReview(reviewId) {
    try {
      const response = await axios.delete(`${API_URL}/review/delete/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getReviewsByFlashcard(flashcardId) {
    try {
      const allReviews = await this.getAllReviews();
      return allReviews.filter(review => review.flashCard.flashCardId === flashcardId);
    } catch (error) {
      throw error;
    }
  },

  async bookmarkReview(reviewId) {
    try {
      // Implement if you have a bookmark endpoint, otherwise remove this method
      const response = await axios.post(`${API_URL}/review/bookmark/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default reviewService;
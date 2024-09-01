// src/services/reviewService.ts
import ReviewRepository from '../repositories/reviewRepository';
import { Review } from '../models/reviewModel';

class ReviewService {
  private reviewRepository: ReviewRepository;

  constructor(reviewRepository: ReviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  public async addReview(review: Review): Promise<void> {
    await this.reviewRepository.addReview(review);
  }

  public async getReviews(restaurantId: number, limit: number, lastEvaluatedKey?: any): Promise<{ reviews: Review[], lastEvaluatedKey?: any }> {
    
    return await this.reviewRepository.getReviews(restaurantId, limit, lastEvaluatedKey);
  }
}

export default ReviewService;

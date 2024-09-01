import { Request, Response, NextFunction } from 'express';
import ReviewService from '../services/reviewService';
import Boom from '@hapi/boom';
import { Review } from '../models/reviewModel';
import ReviewRepository from '../repositories/reviewRepository';

export default class ReviewController {
  private reviewService: ReviewService;

  constructor(reviewService: ReviewService) {
    this.reviewService = reviewService;
  }
  //TODO: DTO to be implemented with class-validator
  public async addReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    try {
      const review: Review = req.body;
      await this.reviewService.addReview(review);
      //TODO: Response RO to be implemented
      res.status(201).send({ message: 'Review added successfully' });
    } catch (err) {
      if (!Boom.isBoom(err)) {
        next(Boom.boomify(err as Error));
      } else {
        next(err);
      }
    }
  }

  public async getReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const restaurantId = parseInt(req.query.restaurantId as string, 10);
      const limit = parseInt(req.query.limit as string, 10) || 10;

      if (!restaurantId) {
        throw Boom.badRequest('Restaurant ID is required');
      }
      const lastEvaluatedKey = req.query.lastEvaluatedKey ? JSON.parse(req.query.lastEvaluatedKey as string) : undefined;

      const { reviews, lastEvaluatedKey: newLastEvaluatedKey } = await this.reviewService.getReviews(restaurantId, limit, lastEvaluatedKey);
      //TODO: Response RO to be implemented
      res.status(200).json({ reviews, lastEvaluatedKey: newLastEvaluatedKey ? JSON.stringify(newLastEvaluatedKey) : null });
    } catch (err) {
      next(err);
    }
  }
}
const reviewRepository = new ReviewRepository();
const reviewService = new ReviewService(reviewRepository);
export const reviewController = new ReviewController(reviewService);
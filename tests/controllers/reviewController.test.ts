import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import ReviewController from '../../src/controllers/reviewController';
import ReviewService from '../../src/services/reviewService';
import Boom from '@hapi/boom';
import { Review } from '../../src/models/reviewModel';

const app = express();
app.use(bodyParser.json());

jest.mock('../../src/services/reviewService');

const reviewServiceMock = new ReviewService({} as any) as jest.Mocked<ReviewService>;
const reviewController = new ReviewController(reviewServiceMock);

app.post('/api/reviews', reviewController.addReview.bind(reviewController));
app.get('/api/reviews', reviewController.getReviews.bind(reviewController));

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (Boom.isBoom(err)) {
    return res.status(err.output.statusCode).json(err.output.payload);
  }
  res.status(500).json({ message: 'Internal Server Error' });
});

const mockReview: Review = {
  review_id: '1',
  restaurant_id: 1,
  review_text: 'Review text1',
  rating: 5,
};

describe('ReviewController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('get reviews with pageing and return 200 status', async () => {
    const mockResult = {
      reviews: [mockReview],
      lastEvaluatedKey: '1',
    };
    const mockExpect = {
      reviews: [mockReview],
      lastEvaluatedKey: JSON.stringify('1'),
    };
    let restaurantId=1;
    let limit =20;
    let lastEvaluatedKey=1;
    reviewServiceMock.getReviews.mockResolvedValue(mockResult);

    const response = await request(app)
      .get('/api/reviews')
      .query({ restaurantId: restaurantId, limit: limit, lastEvaluatedKey: lastEvaluatedKey });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockExpect);
    expect(reviewServiceMock.getReviews).toHaveBeenCalledWith(restaurantId, limit, lastEvaluatedKey);
  });

  it('return 400 if restaurant_id parameter is missing', async () => {
    const response = await request(app)
      .get('/api/reviews');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Restaurant ID is required',
    });
  });
});

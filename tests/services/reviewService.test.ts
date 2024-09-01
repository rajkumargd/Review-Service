import ReviewService from '../../src/services/reviewService';
import ReviewRepository from '../../src/repositories/reviewRepository';
import { Review } from '../../src/models/reviewModel';

jest.mock('../../src/repositories/reviewRepository');

const reviewRepositoryMock = new ReviewRepository() as jest.Mocked<ReviewRepository>;
const reviewService = new ReviewService(reviewRepositoryMock);

const addmockReview: Review = {
  review_id: '1',
  restaurant_id: 1,
  review_text: 'Great place!',
  rating: 5,
};
const mockReview:{reviews:Review[],lastEvaluatedKey?: any} ={
  reviews:[{
    review_id: '1',
    restaurant_id: 1,
    review_text: 'Great place!',
    rating: 5,
  }],
  lastEvaluatedKey:{"restaurant_id":{"N":"1"},"review_id":{"S":"reviewId1"}}
}

describe('ReviewService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('add a review', async () => {
    reviewRepositoryMock.addReview.mockResolvedValue();

    await reviewService.addReview(addmockReview);

    expect(reviewRepositoryMock.addReview).toHaveBeenCalledWith(addmockReview);
  });

  it('get reviews with pagination', async () => {
    reviewRepositoryMock.getReviews.mockResolvedValue(mockReview);
    let restaurantId=1;
    let limit =20;
    let lastEvaluatedKey={};
    const reviews = await reviewService.getReviews(restaurantId, limit, lastEvaluatedKey);

    expect(reviews).toEqual(mockReview);
    expect(reviewRepositoryMock.getReviews).toHaveBeenCalledWith(restaurantId, limit, lastEvaluatedKey);
  });
});

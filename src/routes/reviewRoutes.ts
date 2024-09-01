import { Router } from 'express';
import { reviewController } from '../controllers/reviewController';
import googlePlacesController from '../controllers/googlePlacesController';

const reviewRouter = Router();

reviewRouter.get('/reviews', reviewController.getReviews.bind(reviewController));
reviewRouter.post('/reviews',reviewController.addReview.bind(reviewController));

reviewRouter.get('/integrations/google/:restaurant_id',googlePlacesController.getGooglePlaceData.bind(googlePlacesController));

export default reviewRouter;

import { Request, Response, NextFunction } from 'express';
import GooglePlacesService from '../services/googlePlacesService';
import Boom from '@hapi/boom';

class GooglePlacesController {
  private googlePlaceService: GooglePlacesService;

  constructor(googlePlaceService: GooglePlacesService) {
    this.googlePlaceService = googlePlaceService;
  }

  public async getGooglePlaceData(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    try {
      const { restaurant_id } = req.params;
      const data = await this.googlePlaceService.getGooglePlaceData(restaurant_id);
      res.status(200).json(data);
    } catch (err) {
      next(Boom.boomify(err as Error));
    }
    
  }
}

const googlePlaceSerice = new GooglePlacesService();
export default new GooglePlacesController(googlePlaceSerice);

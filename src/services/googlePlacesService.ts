import axios from 'axios';

class GooglePlacesService {

  private googlePlacesUrl = `${process.env.GOOGLE_API_URL}/places`;

  public async getGooglePlaceData(google_place_id: string): Promise<any> {
    try {
      const response = await axios.get(`${this.googlePlacesUrl}/${google_place_id}`, {
        params: {
            fields: 'id,displayName,reviews',
            key: process.env.GOOGLE_PLACES_API_KEY
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch data.');
    }
  }
}

export default GooglePlacesService;

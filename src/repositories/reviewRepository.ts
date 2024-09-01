import { DynamoDBClient, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Review } from '../models/reviewModel';

const dynamoDbClient = new DynamoDBClient({
  region: process.env.AWS_REGION, 
});

class ReviewRepository {
  private tableName = 'fh_restaurant_reviews';
  private indexName = 'restaurant_id-index'; 
  public async addReview(review: Review): Promise<void> {
    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: marshall(review),
    });
    await dynamoDbClient.send(command);
  }

  public async getReviews(restaurantId: number,limit:number,lastEvaluatedKey?: any): Promise<{reviews:Review[],lastEvaluatedKey?: any}> {
    
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: 'restaurant_id = :restaurant_id',
      ExpressionAttributeValues: marshall({ ':restaurant_id': restaurantId }),
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey,
    });
    const result = await dynamoDbClient.send(command);
    return {
      reviews: result.Items ? result.Items.map(item => unmarshall(item) as Review) : [],
      lastEvaluatedKey: result.LastEvaluatedKey,
    };
  }
}

export default ReviewRepository;

import express from 'express';
import bodyParser from 'body-parser';
import errorHandler from './middlewares/errorHandler'; 
import reviewRouter from './routes/reviewRoutes';

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());

app.use('/api', reviewRouter);

app.get('/', (req, res) => {
  res.send({Message:'Welcome to Restaurant'});
});

app.use(errorHandler);

export default app;
import express from 'express';
import { gameRouter } from '../routes';

const expressConfig = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', gameRouter);

  return app;
};

export default expressConfig;

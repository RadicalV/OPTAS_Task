import express from 'express';
import cors from 'cors';
import { gameRouter } from '../routes';
import { ORIGIN } from '../constants';

const expressConfig = () => {
  const app = express();

  app.use(cors({ origin: ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', gameRouter);

  return app;
};

export default expressConfig;

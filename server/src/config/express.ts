import express from 'express';

const expressConfig = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
};

export default expressConfig;

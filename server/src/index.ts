import * as http from 'http';
import expressConfig from './config/express';
import { PORT } from './constants';

const run = async () => {
  const app = expressConfig();
  const httpServer = http.createServer(app);

  httpServer.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`Server is now listening on port: ${PORT}`);
    console.log(`========================================`);
  });
};

run();

import { Router } from 'express';
import { gameController } from '../controllers';

const router = Router();

router.get('/startgame', gameController.startGame);

export const gameRouter = router;

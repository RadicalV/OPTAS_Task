import { Router } from 'express';
import { gameController } from '../controllers';

const router = Router();

router.get('/startgame', gameController.startGame);
router.post('/shoot/:gameId', gameController.checkShot);

export const gameRouter = router;

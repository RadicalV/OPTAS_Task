import { NextFunction, Request, Response } from 'express';
import { gameService } from '../services';

const startGame = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = await gameService.startGame();
    res.status(200).send(id);
  } catch (error) {
    next(error);
  }
};

const checkShot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await gameService.checkShot(req.params.gameId, req.body);
    res.status(200).send({ result });
  } catch (error) {
    next(error);
  }
};

export const gameController = { startGame, checkShot };

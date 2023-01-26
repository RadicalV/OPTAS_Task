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

export const gameController = { startGame };

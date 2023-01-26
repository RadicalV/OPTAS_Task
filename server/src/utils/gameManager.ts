import { GameState } from '../interfaces';

class GameManager {
  private static _instance: GameManager;

  private gamesMap: Map<string, GameState>;

  private constructor() {
    this.gamesMap = new Map<string, GameState>();
  }

  static getInstance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new GameManager();
    return this._instance;
  }

  addGame(gameId: string, grid: number[][]) {
    const gameState: GameState = { gameGrid: grid, playerHits: 25 };
    this.gamesMap.set(gameId, gameState);
  }

  updateGameState(gameId: string, gameState: GameState) {
    this.gamesMap.set(gameId, gameState);
  }

  getGame(gameId: string) {
    return this.gamesMap.get(gameId);
  }
}

export default GameManager;

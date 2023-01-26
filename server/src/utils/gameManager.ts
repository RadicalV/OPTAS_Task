import { GameState, Ship } from '../interfaces';

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

  addGame(gameId: string, grid: number[][], ships: Ship[], totalHitPoints: number) {
    const gameState: GameState = {
      gameGrid: grid,
      ships: ships,
      playerHitsLeft: 25,
      playerHits: 0,
      totalHitPoints: totalHitPoints,
    };
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

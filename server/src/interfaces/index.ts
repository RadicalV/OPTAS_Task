export interface GameState {
  gameGrid: number[][];
  ships: Ship[];
  playerHitsLeft: number;
  playerHits: number;
  totalHitPoints: number;
}

export interface Ship {
  cells: { x: number; y: number }[];
}

import { shipTypes } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import GameManager from '../utils/gameManager';
import { HttpException } from '../exceptions/httpException';

const startGame = async () => {
  const uuid = uuidv4();
  const grid = generateGrid();
  const gameManager = GameManager.getInstance();
  gameManager.addGame(uuid, grid);

  return uuid;
};

const generateGrid = (): number[][] => {
  const maxIterationCount = 200;

  // Initializing empty grid
  const grid: number[][] = [];

  for (let i = 0; i < 10; i++) {
    grid[i] = [10];
    for (let j = 0; j < 10; j++) {
      grid[i][j] = 0;
    }
  }

  // Place ships on the grid
  let iterationCount = 0;
  outerloop: for (let i = 0; i < shipTypes.length; i++) {
    for (let j = 0; j < shipTypes[i].count; j++) {
      let placed = false;

      while (!placed && maxIterationCount > iterationCount) {
        // Generate starting random starting position
        const x = Math.floor(Math.random() * 10);
        const y = Math.floor(Math.random() * 10);

        // Generate random rotation
        const direction = Math.floor(Math.random() * 2);
        const shipLength = shipTypes[i].size;

        // Check if ship fits on the grid
        let fits = true;

        // Horizontal
        if (direction === 0) {
          if (y + shipLength > 10) {
            fits = false;
          } else {
            for (let l = y; l < y + shipLength; l++) {
              if (grid[x][l] !== 0) {
                fits = false;
                break;
              }
            }
          }
          // Place the ship if it fits
          if (fits) {
            shipTypes[i].position = { startX: x, startY: y };
            for (let l = y; l < y + shipLength; l++) {
              grid[x][l] = shipTypes[i].id;

              if (l === y + shipLength - 1) {
                const shipPos = shipTypes[i].position;
              }

              //Mark neigbouring cells as occupied
              if (x > 0 && l === y && l > 0) {
                grid[x - 1][l - 1] = shipTypes[i].id * 10;
                grid[x - 1][l] = shipTypes[i].id * 10;
                grid[x][l - 1] = shipTypes[i].id * 10;
              }
              if (x < 9 && l === y && l > 0) {
                grid[x + 1][l - 1] = shipTypes[i].id * 10;
                grid[x + 1][l] = shipTypes[i].id * 10;
                grid[x][l - 1] = shipTypes[i].id * 10;
              }
              if (x > 0) {
                grid[x - 1][l] = shipTypes[i].id * 10;
              }
              if (x < 9) {
                grid[x + 1][l] = shipTypes[i].id * 10;
              }
              if (x > 0 && l === y + shipLength - 1 && l < 9) {
                grid[x][l + 1] = shipTypes[i].id * 10;
                grid[x - 1][l] = shipTypes[i].id * 10;
                grid[x - 1][l + 1] = shipTypes[i].id * 10;
              }
              if (x < 9 && l === y + shipLength - 1 && l < 9) {
                grid[x + 1][l] = shipTypes[i].id * 10;
                grid[x + 1][l + 1] = shipTypes[i].id * 10;
                grid[x][l + 1] = shipTypes[i].id * 10;
              }
            }
            placed = true;
          }
        } else {
          // Vertical
          if (x + shipLength > 10) {
            fits = false;
          } else {
            for (let l = x; l < x + shipLength; l++) {
              if (grid[l][y] !== 0) {
                fits = false;
                break;
              }
            }
          }
          // Place the ship if it fits
          if (fits) {
            for (let l = x; l < x + shipLength; l++) {
              grid[l][y] = shipTypes[i].id;

              //Mark neigbouring cells as occupied
              if (y > 0 && l === x && l > 0) {
                grid[l - 1][y - 1] = shipTypes[i].id * 10;
                grid[l - 1][y] = shipTypes[i].id * 10;
                grid[l][y - 1] = shipTypes[i].id * 10;
              }
              if (y < 9 && l === x && l > 0) {
                grid[l - 1][y + 1] = shipTypes[i].id * 10;
                grid[l - 1][y] = shipTypes[i].id * 10;
              }
              if (y > 0) {
                grid[l][y - 1] = shipTypes[i].id * 10;
              }
              if (y < 9) {
                grid[l][y + 1] = shipTypes[i].id * 10;
              }
              if (y > 0 && l === x + shipLength - 1 && l < 9) {
                grid[l + 1][y - 1] = shipTypes[i].id * 10;
                grid[l][y - 1] = shipTypes[i].id * 10;
                grid[l + 1][y] = shipTypes[i].id * 10;
              }
              if (y < 9 && l === x + shipLength - 1 && l < 9) {
                grid[l + 1][y + 1] = shipTypes[i].id * 10;
                grid[l][y + 1] = shipTypes[i].id * 10;
                grid[l + 1][y] = shipTypes[i].id * 10;
              }
            }
            placed = true;
          }
        }
        iterationCount++;
        if (iterationCount >= maxIterationCount) {
          break outerloop;
        }
      }
    }
  }
  if (iterationCount >= maxIterationCount) {
    return generateGrid();
  }
  return grid;
};

const checkShot = async (gameId: string, coordinates: { x: number; y: number }) => {
  const gameManager = GameManager.getInstance();
  const gameState = gameManager.getGame(gameId);

  if (!gameState) throw new HttpException(404, "Game doesn't exist!");

  const gameGrid = gameState.gameGrid;
  let result;

  if (gameGrid[coordinates.x][coordinates.y] !== 0 && gameGrid[coordinates.x][coordinates.y] < 10)
    result = 'Hit';
  else {
    gameState.playerHits--;
    result = 'Miss';
  }

  gameManager.updateGameState(gameId, gameState);

  return result;
};

export const gameService = {
  startGame,
  checkShot,
};

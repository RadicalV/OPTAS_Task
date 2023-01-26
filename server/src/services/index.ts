import { shipTypes } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import GameManager from '../utils/gameManager';
import { HttpException } from '../exceptions/httpException';
import { Ship } from '../interfaces';

const startGame = async () => {
  const uuid = uuidv4();
  const ships: Ship[] = [];

  const grid = generateGrid(ships);
  const gameManager = GameManager.getInstance();

  let totalHitPoints = 0;

  shipTypes.forEach((ship) => {
    totalHitPoints += ship.count * ship.size;
  });

  gameManager.addGame(uuid, grid, ships, totalHitPoints);

  console.log(ships);
  console.log(ships[0].cells);

  console.table(grid);
  return uuid;
};

const generateGrid = (ships: Ship[]): number[][] => {
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
            const ship: Ship = { cells: [] };

            for (let l = y; l < y + shipLength; l++) {
              grid[x][l] = shipTypes[i].id;

              ship.cells.push({ x: x, y: l });

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
            ships.push(ship);
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
            const ship: Ship = { cells: [] };

            for (let l = x; l < x + shipLength; l++) {
              grid[l][y] = shipTypes[i].id;

              ship.cells.push({ x: l, y: y });

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
            ships.push(ship);
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
    ships.splice(0);
    return generateGrid(ships);
  }

  return grid;
};

const checkShot = async (gameId: string, coordinates: { x: number; y: number }) => {
  const gameManager = GameManager.getInstance();
  const gameState = gameManager.getGame(gameId);

  if (!gameState) throw new HttpException(404, "Game doesn't exist!");

  const gameGrid = gameState.gameGrid;
  let result;

  if (gameGrid[coordinates.x][coordinates.y] !== 0 && gameGrid[coordinates.x][coordinates.y] < 10) {
    gameState.playerHits += 1;

    if (gameState.playerHits === gameState.totalHitPoints) {
      result = { message: 'Win', destroyed: false };
    } else {
      result = { message: 'Hit', destroyed: false };

      let index = undefined;
      gameState.ships.forEach((ship, id) => {
        for (let i = 0; i < ship.cells.length; i++) {
          if (ship.cells[i].x === coordinates.x && ship.cells[i].y === coordinates.y) {
            ship.cells.splice(i, 1);

            if (ship.cells.length === 0) {
              result = { message: 'Hit', destroyed: true };
              index = id;
            }
            break;
          }
        }
      });

      if (index !== undefined) {
        gameState.ships.splice(index, 1);
      }

      console.log(gameState.ships);
    }
  } else {
    gameState.playerHitsLeft--;

    if (gameState.playerHitsLeft !== 0) result = { message: 'Miss', destroyed: false };
    else result = { message: 'Lose', destroyed: false };
  }

  gameManager.updateGameState(gameId, gameState);

  return result;
};

export const gameService = {
  startGame,
  checkShot,
};

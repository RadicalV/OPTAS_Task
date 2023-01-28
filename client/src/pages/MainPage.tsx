import NiceModal from "@ebay/nice-modal-react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import gameApi from "../api";
import Cell from "../components/Cell";
import PlayAgainModal from "../components/PlayAgainModal";

const MainPage = () => {
  const [gameId, setGameId] = useState("");
  const [grid, setGrid] = useState<number[][]>([]);
  const [hits, setHits] = useState(25);
  const [destroyedShips, setDestroyedShips] = useState(0);

  const generateGrid = () => {
    const tempGrid: number[][] = [];

    for (let i = 0; i < 10; i++) {
      tempGrid[i] = [10];
      for (let j = 0; j < 10; j++) {
        tempGrid[i][j] = 0;
      }
    }
    setGrid(tempGrid);
  };

  const startNewGame = () => {
    gameApi.startGame().then((value) => {
      setGameId(value.data);
    });
    generateGrid();
    setHits(25);
    setDestroyedShips(0);
  };

  const checkGameOver = () => {
    gameApi.checkGameOver(gameId).then((value) => {
      switch (value.data.message) {
        case "Win": {
          NiceModal.show(PlayAgainModal, {
            gameState: "Won",
            confirm: () => {
              startNewGame();
            },
            deny: () => {
              setGameId("");
              setHits(25);
              setDestroyedShips(0);
            },
          });
          break;
        }
        case "Lose": {
          NiceModal.show(PlayAgainModal, {
            gameState: "Lost",
            confirm: () => {
              startNewGame();
            },
            deny: () => {
              setGameId("");
              setHits(25);
              setDestroyedShips(0);
            },
          });
        }
      }
    });
  };

  const handleCellClick = useCallback(
    (x: number, y: number) => {
      if (grid[x][y] === 0) {
        gameApi.shoot(gameId, { x, y }).then((value) => {
          const response = value.data;

          setGrid((prev) => {
            return prev.map((row, i) => {
              return row.map((cell, j) => {
                if (i === x && j === y) {
                  switch (response.message) {
                    case "Miss": {
                      setHits(hits - 1);
                      return 1;
                    }
                    case "Hit": {
                      if (response.destroyed) {
                        setDestroyedShips(destroyedShips + 1);
                      }
                      return 2;
                    }
                  }
                }
                return cell;
              });
            });
          });
          checkGameOver();
        });
      }
    },
    [grid, gameId]
  );

  return (
    <Box>
      {gameId ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            mt: 5,
          }}
        >
          <Typography
            variant="h2"
            component="h2"
            sx={{ fontFamily: "Bangers, cursive", mb: 2 }}
          >
            BattleShips
          </Typography>
          <Grid container spacing={0} sx={{ width: "600px" }}>
            {grid.map((row, x) => {
              return row.map((col, y) => {
                return (
                  <Cell
                    key={`y${y}x${x}`}
                    state={grid[x][y]}
                    onClick={() => {
                      handleCellClick(x, y);
                    }}
                  />
                );
              });
            })}
          </Grid>
          <Box
            sx={{
              width: "600px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                border: "1px solid",
                fontFamily: "Bangers, cursive",
                borderRadius: "5px",
                padding: "15px",
              }}
            >
              Hits left: {hits}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                border: "1px solid",
                fontFamily: "Bangers, cursive",
                borderRadius: "5px",
                padding: "15px",
              }}
            >
              Destroyed ships: {destroyedShips}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "66vh",
            gap: 5,
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{ fontFamily: "Bangers, cursive", fontSize: "10rem" }}
          >
            BattleShips
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ fontSize: "2rem" }}
            onClick={startNewGame}
          >
            Start Game
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MainPage;

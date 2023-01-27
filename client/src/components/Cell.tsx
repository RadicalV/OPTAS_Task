import NiceModal from "@ebay/nice-modal-react";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import { useState } from "react";
import gameApi from "../api";
import PlayAgainModal from "./PlayAgainModal";

interface Props {
  x: number;
  y: number;
  gameId: string;
  setHits: () => void;
  setDestroyedShips: () => void;
  checkGameOver: () => void;
}

enum CellState {
  none,
  hit,
  miss,
}

const Cell = (props: Props) => {
  const [cellState, setCellState] = useState(CellState.none);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "solid 1px black",
        width: "60px",
        height: "60px",
      }}
      onClick={() => {
        if (cellState === CellState.none) {
          gameApi
            .shoot(props.gameId, { x: props.x, y: props.y })
            .then((value) => {
              const response = value.data;

              switch (response.message) {
                case "Miss": {
                  setCellState(CellState.miss);
                  props.setHits();
                  break;
                }
                case "Hit": {
                  setCellState(CellState.hit);
                  if (response.destroyed) props.setDestroyedShips();
                  break;
                }
              }
              props.checkGameOver();
            });
        }
      }}
    >
      {cellState === CellState.none && <></>}
      {cellState === CellState.miss && <CloseIcon />}
      {cellState === CellState.hit && <CloseIcon sx={{ color: "red" }} />}
    </Box>
  );
};

export default Cell;

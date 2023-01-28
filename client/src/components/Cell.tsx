import CloseIcon from "@mui/icons-material/Close";
import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import gameApi from "../api";

interface Props {
  state: number;
  onClick: () => void;
}

enum CellState {
  none,
  hit,
  miss,
}

const Cell = (props: Props) => {
  return (
    <Grid item md={1.2}>
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
          props.onClick();
        }}
      >
        {props.state === 0 && <></>}
        {props.state === 1 && <CloseIcon />}
        {props.state === 2 && <CloseIcon sx={{ color: "red" }} />}
      </Box>
    </Grid>
  );
};

export default Cell;

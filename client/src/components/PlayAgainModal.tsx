import NiceModal, { useModal } from "@ebay/nice-modal-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface Props {
  gameState: string;
  confirm: () => void;
  deny: () => void;
}

const PlayAgainModal = NiceModal.create((props: Props) => {
  const modal = useModal();

  return (
    <Dialog open={modal.visible} TransitionComponent={Transition}>
      <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>
        You {props.gameState}!
      </DialogTitle>
      <DialogContent>
        <Typography>Do you wish to play another game?</Typography>
      </DialogContent>
      <DialogActions
        sx={{ display: "flex", justifyContent: "space-between", ml: 2, mr: 2 }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            modal.remove();
            props.deny();
          }}
          color="error"
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          color="success"
          onClick={() => {
            modal.remove();
            props.confirm();
          }}
        >
          Play Again
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default PlayAgainModal;

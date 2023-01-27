import NiceModal from "@ebay/nice-modal-react";
import { CssBaseline } from "@mui/material";
import { useState } from "react";
import MainPage from "./pages/MainPage";

function App() {
  const [gameId, setGameId] = useState("");
  return (
    <>
      <NiceModal.Provider>
        <CssBaseline />
        <MainPage />
      </NiceModal.Provider>
    </>
  );
}

export default App;

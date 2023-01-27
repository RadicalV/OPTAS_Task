import axios from "axios";

const API_URL = "http://localhost:3000/api";

const startGame = () => {
  return axios.get(`${API_URL}/startgame`);
};

const shoot = (gameId: string, coordinates: { x: number; y: number }) => {
  return axios.post(`${API_URL}/shoot/${gameId}`, coordinates);
};

const checkGameOver = (gameId: string) => {
  return axios.get(`${API_URL}/gameover/${gameId}`);
};

const gameApi = {
  startGame,
  shoot,
  checkGameOver,
};

export default gameApi;

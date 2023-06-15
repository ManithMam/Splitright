import React, { useState, useEffect } from 'react';

interface GetGameInfo {
  mode: string;
  amount: number;
  host: string;
  results: string;
}

const GameResults: React.FC = () => {
  const [gameInfo, setGameInfo] = useState<GetGameInfo | null>(null);

  useEffect(() => {
    fetchGameInfo();
  }, []);

  const fetchGameInfo = async () => {
    try {
      const response = await fetch('http://your-backend-server/game-info'); // Replace with your backend server URL
      const data = await response.json();
      setGameInfo(data);
    } catch (error) {
      console.error('Error fetching game info:', error);
    }
  };

  if (!gameInfo) {
    return <div>Loading game information...</div>;
  }

  return (
    
    <div>
      <h1>Spesific Game</h1>
      <p>Game Mode: {gameInfo.mode}</p>
      <p>Amount: {gameInfo.amount}</p>
      <p>Host: {gameInfo.host}</p>
      <p>Results: {gameInfo.results}</p>
    </div>
  );
};

export default GameResults;
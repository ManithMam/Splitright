import React, { useState, useEffect } from 'react';

interface Account {
  accountId: string;
  avatarUrl: string;
  username: string
}

interface Result {
  account: Account;
  amount: number;
}

interface GetGameInfo {
  gameId: string;
  title: string;
  mode: string;
  amount: number;
  host: string;
  results: Result[];
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
      setGameInfo(mockData);
    } catch (error) {
      console.error('Error fetching game info:', error);
      setGameInfo(mockData);
    }
  };

  // Mock data to display initially
  const mockData: GetGameInfo = {
    gameId: "gameId_1",
    title: "Bar Night",
    mode: "Random",
    amount: 20,
    host: "jeramie234",
    results: [
      {
        account: {
          accountId: "accountId_1",
          avatarUrl: "https://i.pravatar.cc/30",
          username: "jennie46"
        },
        amount: 1.15
      },
      {
        account: {
          accountId: "accountId_2",
          avatarUrl: "https://i.pravatar.cc/30",
          username: "tom123"
        },
        amount: 3.36
      },
      {
        account: {
          accountId: "accountId_3",
          avatarUrl: "https://i.pravatar.cc/30",
          username: "lilly34"
        },
        amount: 8.09
      },
      {
        account: {
          accountId: "accountId_4",
          avatarUrl: "https://i.pravatar.cc/30",
          username: "kat1213"
        },
        amount: 3.33
      },
      {
        account: {
          accountId: "accountId_5",
          avatarUrl: "https://i.pravatar.cc/30",
          username: "willow11"
        },
        amount: 2.98
      },
      {
        account: {
          accountId: "accountId_6",
          avatarUrl: "https://i.pravatar.cc/30",
          username: "jeramie234"
        },
        amount: 1.09
      },
    ]
  };

  if (!gameInfo) {
    return <div>No results available...</div>;
  }

  return (
    <div>
      <h1>{gameInfo.title}</h1>
      <p>Game Mode: {gameInfo.mode}</p>
      <p>Amount: {gameInfo.amount}</p>
      <p>Host: {gameInfo.host}</p>
      <ul>
      {gameInfo.results.map((result) => (
        <li key={result.account.accountId}>
          Account: {result.account.username}, Amount: {result.amount}
        </li>
      ))}
    </ul>
    </div>
  );
};


export default GameResults;
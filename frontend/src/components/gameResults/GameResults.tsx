import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import {Avatar, ListItemAvatar, Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import './Results.css';

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

const mockAvatarUrl: string = "https://d2qp0siotla746.cloudfront.net/img/use-cases/profile-picture/template_0.jpg"

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
          avatarUrl: mockAvatarUrl,
          username: "jennie46"
        },
        amount: 1.15
      },
      {
        account: {
          accountId: "accountId_2",
          avatarUrl: mockAvatarUrl,
          username: "tom123"
        },
        amount: 3.36
      },
      {
        account: {
          accountId: "accountId_3",
          avatarUrl: mockAvatarUrl,
          username: "lilly34"
        },
        amount: 8.09
      },
      {
        account: {
          accountId: "accountId_4",
          avatarUrl: mockAvatarUrl,
          username: "kat1213"
        },
        amount: 3.33
      },
      {
        account: {
          accountId: "accountId_5",
          avatarUrl: mockAvatarUrl,
          username: "willow11"
        },
        amount: 2.98
      },
      {
        account: {
          accountId: "accountId_6",
          avatarUrl: mockAvatarUrl,
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
      <Box className='Box' sx={{bgcolor:'secondary.light'}}>
      <Typography variant="h5" gutterBottom sx={{bgcolor:'secondary.dark', color:'secondary.light', borderRadius: '26px'}}>
        {gameInfo.title}
      </Typography>
      <List style={{display: 'flex', justifyContent: 'space-around'}}>
      <ListItem style={{ flexDirection: 'column' }}>
        <ListItemText primary="Mode:"
        sx={{ marginBottom: '1px' }}
        />
        <ListItemText primary={gameInfo.mode}/>
        </ListItem>
        <ListItem style={{ flexDirection: 'column' }}>
          <ListItemText primary="Amount:"
          sx={{ marginBottom: '1px' }}
          />
        <ListItemText primary={gameInfo.amount}/>
        </ListItem>
        <ListItem style={{ flexDirection: 'column' }}>
        <ListItemText primary="Host:"
        sx={{ marginBottom: '1px' }}
        />
        <ListItemText primary={gameInfo.host}/>
        </ListItem>
      </List>
      </Box>

      <Box className='Box' sx={{bgcolor:'primary.light'}}>
      <Typography variant="h5" gutterBottom sx={{bgcolor:'primary.dark', color:'primary.light', borderRadius: '26px'}}>
        Results
      </Typography>
      <List>
      {gameInfo.results.map((result) => (
        <ListItem key={result.account.accountId} style={{display: 'flex', justifyContent: 'space-around'}}>
          <ListItemAvatar>
            <Avatar alt={result.account.username} src={result.account.avatarUrl} />
          </ListItemAvatar>
          <ListItemText primary={`${result.account.username}`}/>
          <ListItemText style={{textAlign: 'right'}}
          primary={`${result.amount}`}/>
        </ListItem>
      ))}
      </List>
    </Box>
    </div>
  );
};


export default GameResults;
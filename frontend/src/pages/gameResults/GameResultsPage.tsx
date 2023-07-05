import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getGameById } from "../../logic/game-service";
import {Typography, Box, List, ListItem, ListItemText, Button, CircularProgress } from '@mui/material';
import './GameResultsPage.css';
import { Link } from 'react-router-dom';
import GameInfoBox from '../../shared/gameInfoBox/GameInfoBox';
import GameListItem from '../../shared/gameList/gameListItem/GameListItem';
import { GameDetails } from '../../logic/models/GameDetails';

const GameResultsPage = () => {
  const { id } = useParams();
  const [gameDetails, setGameDetails] = useState<GameDetails>();
  const [isLoading, setIsLoading] = useState(true);

  let splitMethodClass = '';
  if (gameDetails?.mode === 'Communist') {
    splitMethodClass = 'communist-box';
  } else if (gameDetails?.mode === 'Lucky') {
    splitMethodClass = 'lucky-box';
  } else if (gameDetails?.mode === 'Random') {
    splitMethodClass = 'random-box';
  }

  let titleClass = '';
  if (gameDetails?.mode === 'Communist') {
    titleClass = 'communist-title';
  } else if (gameDetails?.mode === 'Lucky') {
    titleClass = 'lucky-title';
  } else if (gameDetails?.mode === 'Random') {
    titleClass = 'random-title';
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(id) {
          const fetchedGame = await getGameById(id);
          if(fetchedGame) {
            setGameDetails(fetchedGame);
          }
        }
      } catch (error) {
        console.error('Error fetching last splits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Box sx={{ display: 'flex'}}> <CircularProgress /> </Box>;
  }

  return (
    <div className='PageContainer'>
      <GameInfoBox game={gameDetails} code={undefined} />

      <Box className='Box' sx={{bgcolor:'primary.light'}}>

        <Typography variant="h5" gutterBottom sx={{bgcolor:'primary.dark', color:'primary.light', borderRadius: '26px'}}>
          Results
        </Typography>

        <List>
          {gameDetails?.results?.length ? ( gameDetails.results.map((result, index) => (
            <GameListItem key={index} infos={result} index={index} />
            
          ))) : (
            <ListItem>
              <ListItemText primary="No results available" />
            </ListItem>
          )}
        </List>
      </Box>

      <Button component={Link} to="/home" className='Btn MainBtn' sx={{width: "100%"}}>
          Back to Homepage
      </Button>
    </div>
  );
};


export default GameResultsPage;
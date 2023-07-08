import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getGameById } from "../../logic/game-service";
import {Typography, Box, List, ListItem, ListItemText, Button, CircularProgress } from '@mui/material';
import './GameResultsPage.css';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import GameInfoBox from '../../shared/gameInfoBox/GameInfoBox';
import GameListItem from '../../shared/gameList/gameListItem/GameListItem';
import LoadBox from "../../shared/LoadBox/LoadBox"
import { GameDetails } from '../../logic/models/GameDetails';

const GameResultsPage = () => {
  const { id } = useParams();
  const [gameDetails, setGameDetails] = useState<GameDetails>();
  const [isLoading, setIsLoading] = useState(true);

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

  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/home');
  };

  window.onpopstate = () => {
    navigate("/home");
  }

  if (isLoading) {
    <LoadBox></LoadBox>
  }

  return (
    <div className='PageContainer'>
      <GameInfoBox game={gameDetails} code={undefined} />

      <Box className="Box">

        <Typography variant="h5" 
        gutterBottom 
        className="Typography"
        >
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

      <Button className="MainBtn" onClick={handleClick}>Back to Homepage</Button>
    </div>
  );
};


export default GameResultsPage;
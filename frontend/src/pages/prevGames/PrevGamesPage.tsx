import React, {useEffect, useState} from 'react';
import {Box, Button, CircularProgress} from '@mui/material';
import { Link} from 'react-router-dom';
import './PrevGamesPage.css'
import { getAllGames } from '../../logic/game-service';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GamesList from '../../shared/gameList/GamesList';
import LoadBox from "../../shared/LoadBox/LoadBox";
import "../../App.css"
import { ItemInfos } from '../../logic/models/ItemInfos';


const PrevGamesPage= () => {

  const [games, setGames] = useState<ItemInfos[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const games = await getAllGames();
        if(games) {
          setGames(games);
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
    return <LoadBox></LoadBox>;
  }


  return (
    <div className='PageContainer'>
      <Button className="BackBtn" component={Link} to="/home" startIcon={<ArrowBackIcon />}>
            Home
      </Button>
      <div className="PageContainer">
          <GamesList games={games} amount={games.length}/>
      </div>
    </div>
  )
}



export default PrevGamesPage


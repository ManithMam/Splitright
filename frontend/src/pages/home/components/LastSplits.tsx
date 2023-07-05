import { getAllGames } from "../../../logic/game-service";
import { useEffect, useState } from 'react';
import GamesList from '../../../shared/gameList/GamesList';
import { CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { ItemInfos } from "../../../logic/models/ItemInfos";

const LastSplits = () => {
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
    return <Box sx={{ display: 'flex'}}> <CircularProgress /> </Box>;;
  }


  return (
    <GamesList games={games} amount={5} />
  );
};


export default LastSplits
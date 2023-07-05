import {Typography } from '@mui/material';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import './GamesList.css';
import GameListItem from './gameListItem/GameListItem';
import { ItemInfos } from '../../logic/models/ItemInfos';

interface GamesListProps {
    games: ItemInfos[],
    amount: number
}

const GamesList: React.FC<GamesListProps> = ({ games, amount }) => {

    const displayedGames = games.reverse().slice(0, amount);

    return (
        <Box className='Box' sx={{ bgcolor: 'primary.light' }}>
            <Typography variant="h5" gutterBottom sx={{ bgcolor: 'primary.dark', color: 'primary.light', textAlign: 'center', borderRadius: '26px' }}>
                Previous Splits
            </Typography>

            <List disablePadding sx={{ color: 'primary.dark' }}>
                {displayedGames.map((game, index) => (
                    <GameListItem key={index} index={index} infos={game} />
                ))}

                {games.length > amount && (
                    <ListItem disablePadding>
                    <ListItemButton component={Link} to="/previousGames" sx={{ borderRadius: '26px', textAlign: 'center' }}>
                        <ListItemText primary="See all" />
                    </ListItemButton>
                    </ListItem>
                )}
            </List>
        </Box>
    );
};


export default GamesList;
import {Typography } from '@mui/material';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';
import './LastSplits.css';

const LastSplits = () => {
  return (
      <Box className='Box' sx={{bgcolor:'primary.light'}}>

        <Typography variant="h5" gutterBottom sx={{bgcolor:'primary.dark', color:'primary.light', textAlign: 'center', borderRadius: '26px'}}>
          Previous Splits
        </Typography>

        <List disablePadding sx={{ color:'primary.dark'}}>
          
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/gameResults">
              <ListItemText primary="Last Game 1" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="LAST GAME xx" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="LAST GAME xx" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="LAST GAME xx" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/previousGames" sx={{borderRadius: '26px', textAlign: 'center'}}>
              <ListItemText primary="See all" />
            </ListItemButton>
          </ListItem>
        </List>
    </Box>


  )
}

export default LastSplits
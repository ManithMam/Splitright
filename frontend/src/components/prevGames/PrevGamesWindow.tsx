import {Container} from '@mui/material';
import React, {useState} from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';


const PrevGamesPage= () => {
  return (
    <div>
      
      <Container sx={{p:0, mt:2, mb:2, bgcolor:"#1c5668", alignContent:"center", borderRadius: '26px'}}>
      <Box sx={{ p: 0, width: '368p', color: 'white' }}>

        <List disablePadding>
          <ListItem disablePadding>
              <ListItemText primary="PREVIOUS SPLITS" />
          </ListItem>

          <Divider />
          
          <ListItem disablePadding>

            <ListItemButton >
              <ListItemText primary="Last Game 1" />
            </ListItemButton>

          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="LAST GAME xx" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="LAST GAME xx" />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="LAST GAME xx" />
            </ListItemButton>
          </ListItem>
        </List>
      <Divider />
    </Box>

      
      </Container>
        
    </div>
  )
}



export default PrevGamesPage


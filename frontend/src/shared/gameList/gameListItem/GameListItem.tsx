import React from 'react'
import { ListItem, ListItemButton, ListItemText,} from '@mui/material';
import {ItemInfos} from "../../../logic/game-service";
import { Link } from 'react-router-dom';
import './GameListItem.css';

interface GameListItemProps {
  infos: ItemInfos | undefined;
  index: number;
}

const GameListItem: React.FC<GameListItemProps> = ({ infos, index }) => {

  if (!infos) {
    return null; // Render nothing if infos is undefined
  }

  return (
    <ListItem key={index} disablePadding>
      {infos.id ? ( 
          <ListItemButton component={Link} to={`/gameResults/${infos.id}`}>
            <img
              src={'http://localhost:3000/files/' + infos.avatar}
              className='avatar'
            />
            <ListItemText primary={infos.text} />
            <ListItemText
              primary={`${infos.amount} €`}
              className={infos.amount === 0 ? 'amount green-text' : 'amount red-text'}
            />
          </ListItemButton>
            
      ) : (
        <div style={{ display: "flex", justifyContent: "space-around", width: "100%", paddingLeft: "16px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px"}}>
          <div style={{ display: "inline-block", marginRight: "10px" }}>
                <img
                  src={'http://localhost:3000/files/' + infos.avatar}
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
              </div>
              <ListItemText primary={infos.text} />
              <ListItemText
                className={infos.amount === 0 ? "amount green-text" : "amount red-text"}
                primary={`${infos.amount} €`}
              />
        </div>
      )}
    
    </ListItem>
  )
}

export default GameListItem;
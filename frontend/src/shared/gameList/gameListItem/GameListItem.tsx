import React from 'react'
import { ListItem, ListItemButton, ListItemText,} from '@mui/material';
import { Link } from 'react-router-dom';
import './GameListItem.css';
import { ItemInfos } from '../../../logic/models/ItemInfos';

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
              src={process.env.REACT_APP_BACKEND_URL + '/files/' + infos.avatar}
              className='avatar'
            />
            <ListItemText primary={infos.text} className="ItemText"/>
            <ListItemText
              primary={`${infos.amount} €`}
              className={infos.amount === 0 ? 'amount green-text' : 'amount red-text'}
            />
          </ListItemButton>
            
      ) : (
        <div className="item-container">
          <div style={{ display: "inline-block", marginRight: "10px" }}>
                <img
                  src={'http://localhost:3000/files/' + infos.avatar}
                  className="avatar"
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
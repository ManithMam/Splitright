import React from "react";
import "./GameInfoBox.css";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CodeBtn from "./CodeBtn";
import { GameWithoutResults } from "../../logic/models/GameWithoutResults";

interface GameInfoBoxProps {
    game: GameWithoutResults | undefined,
    code: string | undefined
}

const GameInfoBox: React.FC<GameInfoBoxProps> = ({ game, code }) => {

  return (
      <Box className="Box">
        
        <Typography 
        className = "Typography"
        variant="h5"
        >
          {game?.title}
        </Typography>
        
        <List className="GameList">
          <ListItem className="GameListItem">
            <div className="GameInfo">
              <Typography className="Title">Mode:</Typography>
              <ListItemText primary={game?.mode}/>
            </div>
          </ListItem>
          <ListItem className="GameListItem">
            <div className="GameInfo">
              <Typography className="Title">Amount:</Typography>
              <ListItemText primary={`${game?.amount.toFixed(2)} €`} />
            </div>
          </ListItem>
          <ListItem className="GameListItem">
            <div className="GameInfo">
              <Typography className="Title">Host:</Typography>
              <ListItemText primary={game?.adminUsername} />
            </div>
          </ListItem>
        </List>


        <CodeBtn code={code} />

      </Box>

  );
};
export default GameInfoBox;



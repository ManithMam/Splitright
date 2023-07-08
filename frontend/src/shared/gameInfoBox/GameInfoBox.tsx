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
      <Box className="Box GameBox">
        
        <Typography variant="h4" 
          sx={{
            bgcolor: "primary.dark",
            color: "primary.light",
            borderRadius: "26px",
            width: "100%"
          }}
        >
          {game?.title}
        </Typography>


        <List style={{ display: "flex", justifyContent: "space-around" }}>
          <ListItem style={{ flexDirection: "column" }}>
            <ListItemText primary="Mode:" sx={{ marginBottom: "1px" }} />
            <ListItemText primary={game?.mode} />
          </ListItem>
          <ListItem style={{ flexDirection: "column" }}>
            <ListItemText primary="Amount:" sx={{ marginBottom: "1px" }} />
            <ListItemText primary={game?.amount} />
          </ListItem>
          <ListItem style={{ flexDirection: "column" }}>
            <ListItemText primary="Host:" sx={{ marginBottom: "1px" }} />
            <ListItemText primary={game?.adminUsername} />
          </ListItem>
        </List>

        <CodeBtn code={code} />

      </Box>

  );
};
export default GameInfoBox;



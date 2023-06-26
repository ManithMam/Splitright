import React, { useState, useEffect } from "react";
import "./Lobby.css";
import { Avatar, Button, CircularProgress, ListItemAvatar, Snackbar, SnackbarContent, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, useParams } from "react-router-dom";
import { getLobby, updateLobby,  Lobby, exitLobby } from "../../logic/lobby-service";
import { removeStringFromArray } from "../../logic/utils";
import { GameWithoutResults, getGameForLobby, updateResults } from "../../logic/game-service";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CodeBtn from "../../shared/gameInfoBox/CodeBtn";
import GameInfoBox from "../../shared/gameInfoBox/GameInfoBox";

const LobbyPage = () => {
  const navigate = useNavigate();
  const { lobbyId } = useParams();
  const [lobby, setLobby] = useState<Lobby>();
  const [game, setGame] = useState<GameWithoutResults>();
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {

    const fetchData = async () => {
      try {
        if (lobbyId) {
          const lobby = await getLobby(lobbyId);
          const game = await getGameForLobby(lobby.gameId)
          if (lobby && game) {
            setLobby(lobby);
            setGame(game);
          }
        }
      } catch (error) {
        console.error("Error fetching last splits:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 2000); // fetch every 2 seconds

    return () => {
      clearInterval(intervalId); // clean interval on component unmount
    };
  }, [lobbyId]);

  if (isLoading) {
    return <Box sx={{ display: 'flex'}}> <CircularProgress /> </Box>;
  }

  const removeUser = async (username: string) => {
    if (lobby && lobbyId && lobby.guestAccounts) {
      const usernames = lobby.guestAccounts.map((guestAccount) => guestAccount.username);
      const newGuestUsernamesList = removeStringFromArray(usernames, username);
      await updateLobby(lobbyId, newGuestUsernamesList);
    }
  };

  const handleCancel = async () => {
    if (lobbyId) {
      await exitLobby(lobbyId);
      navigate("/home");
    }
  };


  const handleStart = () => {
    if (lobby && lobbyId && lobby.guestAccounts && lobby.gameId) {
      const usernames = lobby.guestAccounts.map((guestAccount) => guestAccount.username);
      updateResults(lobby.gameId, usernames, lobbyId);
      navigate("/gameResults/" + lobby.gameId);
    }
  };

  const copyToClipboard = () => {
    if(lobby && lobby?.code) {
      navigator.clipboard.writeText(lobby?.code)
      .then(() => {
        setOpen(true);
      })
      .catch((error) => {
        console.error('Failed to copy value to clipboard:', error);
      });
    }
    
  };

  return (
    <div className="PageContainer">
      <GameInfoBox game={game} code={lobby?.code} />

      <Box className="Box" sx={{ bgcolor: "primary.light" }}>
        <Typography variant="h5" gutterBottom
          sx={{
            bgcolor: "primary.dark",
            color: "primary.light",
            borderRadius: "26px",
          }}>
          Guests
        </Typography>
        <List>
        {lobby?.guestAccounts?.length ? (
          lobby.guestAccounts.map((account, index) => (
            <ListItem
              key={index}
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <ListItemAvatar>
                <Avatar src={"http://localhost:3000/files/" + account.avatar} />
              </ListItemAvatar>
              <ListItemText primary={account.username} />
              <Button onClick={() => removeUser(account.username)}>
                <DeleteIcon sx={{ color: "primary.dark" }} />
              </Button>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No guests yet" sx={{textAlign: "center"}} />
          </ListItem>
        )}
        </List>
      </Box>

      <div className="BtnGroup">
        <Button variant="outlined" onClick={handleCancel} className="SecondaryBtn Btn">
            Cancel
        </Button>
        <Button onClick={handleStart} className="MainBtn Btn">
          Start
        </Button>
      </div>
        
    </div>
  );
};

export default LobbyPage;

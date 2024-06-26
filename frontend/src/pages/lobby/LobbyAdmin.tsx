import React, { useState, useEffect } from "react";
import "./Lobby.css";
import { Avatar, Button, ListItemAvatar, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, useParams } from "react-router-dom";
import { Lobby } from "../../logic/models/Lobby";
import { GameWithoutResults } from "../../logic/models/GameWithoutResults"; 
import { getGameForLobby } from "../../logic/game-service";
import GameInfoBox from "../../shared/gameInfoBox/GameInfoBox";
import "../../App.css"
import LoadBox from "../../shared/LoadBox/LoadBox";
import { Socket, io } from "socket.io-client";
import { getAccessToken } from "../../logic/auth-service";
import { DefaultEventsMap } from "@socket.io/component-emitter";

const LobbyPage = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

  const { gameId } = useParams();
  const [lobbyInfo, setLobbyInfo] = useState<Lobby>();
  const [game, setGame] = useState<GameWithoutResults>();

  useEffect(() => {
    const token = getAccessToken();

    const newSocket = io(process.env.REACT_APP_BACKEND_URL + '/lobbies', {
        transportOptions: {
        polling: {
            extraHeaders: {
            'access_token': token,
            },
        },
        },
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to the WebSocket server');
    });

    const fetchData = async () => {
      try {
        const result = await getGameForLobby(gameId!);
        setGame(result);
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    fetchData();

    newSocket.emit('createLobby', { gameId: gameId });

    newSocket.on('lobbyInfo', (data) => {

      if(!data.code) {
        navigate("/gameResults/" + data.gameId)
      }

      setLobbyInfo(data);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [gameId]);

  const closeLobby = () => {
    socket!.emit('closeLobby');
  };

  const kickUserOut = (guestUsername: string) => {
    socket!.emit('kickUserOut', guestUsername);
  };

  const handleDisconnect = () => {
    socket!.disconnect();
    navigate("/home")
  };

  return (
    <div className="PageContainer">
      <GameInfoBox game={game} code={lobbyInfo?.code} />

      <Box className="Box">
        <Typography variant="h5" gutterBottom className="Typography">
          Guests
        </Typography>
        <List>
        {lobbyInfo?.guestAccounts?.length ? (
          lobbyInfo.guestAccounts.map((account, index) => (
            <ListItem
              className="Item"
              key={index}
            >
              <ListItemAvatar>
                <Avatar src={process.env.REACT_APP_BACKEND_URL + "/files/" + account.avatar} />
              </ListItemAvatar>
              <ListItemText primary={account.username} />
              <Button onClick={() => kickUserOut(account.username)}>
                <DeleteIcon sx={{ color: "primary.dark" }} />
              </Button>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No guests yet" className="NoGuests"/>
          </ListItem>
        )}
        </List>
      </Box>

      <div className="BtnGroup">
        <Button variant="outlined" onClick={handleDisconnect} className="SecondaryBtn Btn">
            Cancel
        </Button>
        <Button onClick={closeLobby} className="MainBtn Btn">
          Start
        </Button>
      </div>
        
    </div>
  );
};

export default LobbyPage;

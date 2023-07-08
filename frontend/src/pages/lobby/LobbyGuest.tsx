import React, { useState, useEffect } from "react";
import "./Lobby.css";
import { Avatar, Button, ListItemAvatar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, useParams } from "react-router-dom";
import { Lobby } from "../../logic/models/Lobby";
import { GameWithoutResults } from "../../logic/models/GameWithoutResults"; 
import { getGameForLobby } from "../../logic/game-service";
import GameInfoBox from "../../shared/gameInfoBox/GameInfoBox";
import LoadBox from "../../shared/LoadBox/LoadBox";
import "../../App";
import { getAccessToken } from "../../logic/auth-service";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";


const LobbyGuest = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const [lobbyInfo, setLobbyInfo] = useState<Lobby>();
  const [game, setGame] = useState<GameWithoutResults>();
  const message = "Waiting for host to start";
  const [periods, setPeriods] = useState(".");
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

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

    newSocket.emit('joinLobby', code);

    newSocket.on('lobbyInfo', async (data) => {

      if(data === 'Lobby admin kicked you out' || data === 'Lobby was deleted by admin') {
        handleDisconnect();
        return;
      }

      else if(!data.code) {
        navigate("/gameResults/" + data.gameId)
      }

      setLobbyInfo(data);

      try {
        const result = await getGameForLobby(data?.gameId!);
        setGame(result);
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    });

    const changePeriods = () => {
      setPeriods((prevPeriods) => {
        if (prevPeriods === "...") {
          return ".";
        } else {
          return prevPeriods + ".";
        }
      });
    };

    const intervalId = setInterval(changePeriods, 2000); // every 2 seconds

    return () => {
      clearInterval(intervalId); // clean interval on component unmount
      newSocket.disconnect();
    };
  }, [code]);

  const handleDisconnect = () => {
    navigate("/home")
  };

  return (
    <div className="PageContainer">
      <GameInfoBox game={game} code={lobbyInfo?.code} />

      <Box className="Box">
        <Typography
          variant="h5"
          gutterBottom
          className="Typography"
        >
          Guests
        </Typography>
        <List>
          {lobbyInfo?.guestAccounts?.map((account, index) => (
            <ListItem
              key={index}
              className="Item"
            >
              <ListItemAvatar>
                <Avatar src={process.env.REACT_APP_BACKEND_URL + "/files/" + account.avatar} />
              </ListItemAvatar>
              <ListItemText primary={account.username} />
            </ListItem>
          ))}
        </List>
      </Box>


      <Button variant="outlined" className="Btn SecondaryBtn" onClick={handleDisconnect}>
        Cancel
      </Button>


      <Typography variant="h6" className="Waiting">
        {message}
        {periods}
      </Typography>
    </div>
  );
};
export default LobbyGuest;
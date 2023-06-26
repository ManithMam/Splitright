import React, { useState, useEffect } from "react";
import "./Lobby.css";
import { Avatar, Button, CircularProgress, ListItemAvatar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate, useParams } from "react-router-dom";
import { Lobby, getLobby, exitLobby } from "../../logic/lobby-service";
import { GameDetails, GameWithoutResults, getGameById, getGameForLobby } from "../../logic/game-service";
import GameInfoBox from "../../shared/gameInfoBox/GameInfoBox";

const LobbyGuest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lobby, setLobby] = useState<Lobby>();
  const [game, setGame] = useState<GameWithoutResults>();
  let lastFetchedLobby: Lobby;
  const [isLoading, setIsLoading] = useState(true);
  const message = "Waiting for host to start";
  const [periods, setPeriods] = useState(".");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          let fetchedLobby = await getLobby(id);

          //no lobby infos for you
          if (fetchedLobby.message) {

            //lobby doesn't exist
            if(fetchedLobby.message === "Lobby not found") {
              if(lastFetchedLobby && lastFetchedLobby.gameId) {
                let fetchedGame = await getGameById(lastFetchedLobby.gameId);
                if(fetchedGame && fetchedGame.results) {
                  navigate("/gameResults/" + lastFetchedLobby.gameId);
                }
                else {
                  navigate("/home");
                }
              }
              
            }
            // you don't have access to lobby
            else if(fetchedLobby.message === "You got kicked out") {
              navigate("/home");
            }
          }
          // lobby infos
          else if (fetchedLobby && fetchedLobby.gameId) {
            lastFetchedLobby = fetchedLobby;
            let updatedGame = await getGameForLobby(fetchedLobby.gameId);
            if(updatedGame) {
              setLobby(fetchedLobby);
              setGame(updatedGame);
            }
            setPeriods((prevPeriods) => {
              if (prevPeriods === "...") {
                return ".";
              } else {
                return prevPeriods + ".";
              }
            });
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
  }, [id]);

  if (isLoading) {
    return <Box sx={{ display: 'flex'}}> <CircularProgress /> </Box>;
  }

  const handleCancel = async () => {
    if(id) {
      await exitLobby(id);
    }
  };


  return (
    <div className="PageContainer">
      <GameInfoBox game={game} code={lobby?.code} />

      <Box className="Box" sx={{ bgcolor: "primary.light" }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            bgcolor: "primary.dark",
            color: "primary.light",
            borderRadius: "26px",
          }}
        >
          Guests
        </Typography>
        <List>
          {lobby?.guestAccounts?.map((account, index) => (
            <ListItem
              key={index}
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <ListItemAvatar>
                <Avatar src={"http://localhost:3000/files/" + account.avatar} />
              </ListItemAvatar>
              <ListItemText primary={account.username} />
            </ListItem>
          ))}
        </List>
      </Box>


      <Button variant="outlined" className="Btn SecondaryBtn" onClick={handleCancel}>
        Cancel
      </Button>


      <Typography variant="h6" sx={{ marginTop: "20px" }}>
        {message}
        {periods}
      </Typography>
    </div>
  );
};
export default LobbyGuest;
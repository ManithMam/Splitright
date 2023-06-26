import {getAccessToken} from "./auth-service";
import { deleteLobby } from "./lobby-service";

export interface GameShort {
    id: string, 
    adminAvatar: string,
    title: string,
    amountPaid: number
}

export interface ItemInfos {
  id?: string, 
  avatar: string,
  text: string,
  amount: number
}

export interface CreateGame {
  title: string,
  mode: string,
  amount: number,
}

export interface GameDetails {
  title: string, 
  mode: string, 
  amount: number,
  adminUsername: string,
  results: ItemInfos[]
}

interface GameReceivedDetails {
  title: string, 
  mode: string, 
  amount: number,
  adminUsername: string,
  results: Result[]
}

interface Result {
  username: string,
  avatar: string,
  amount: number
}

export interface GameWithoutResults {
  title: string, 
  mode: string, 
  amount: number,
  adminUsername: string,
}

export async function getAllGames() {
  try {     
    const response = await fetch('http://localhost:3000/games', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getAccessToken()
      },
    });

    const gamesData: GameShort[] = await response.json();
    let results = []
    for(let game of gamesData) {
      const currentGame: ItemInfos = {
        id: game.id, 
        avatar: game.adminAvatar,
        text: game.title,
        amount: game.amountPaid
      }
      results.push(currentGame);
    }
    return results;

  } catch (error) {
    console.error('Error getting all games:', error);
    // Handle the error (e.g., show error message to the user)
    // Optionally, rethrow the error to allow the caller to handle it
    throw error;
  } 
}
 

export async function getGameById(id: string) {
  try {     
      const response = await fetch('http://localhost:3000/games/' + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getAccessToken()
        },
      });
      
      if(response.status === 200) {
        const gameData: GameReceivedDetails = await response.json();

        let gameInfosArray = [];
        for(let result of gameData.results) {
          const currentResult: ItemInfos = {
            avatar: result.avatar,
            text: result.username,
            amount: result.amount
          }
          gameInfosArray.push(currentResult);
        }

        const gameToReturn: GameDetails = {
          title: gameData.title, 
          mode: gameData.mode, 
          amount: gameData.amount,
          adminUsername: gameData.adminUsername,
          results: gameInfosArray
        }
        return gameToReturn;
      } else {
        throw new Error('Error getting game info. Status: ' + response.status);
      }
      
    } catch (error) {
      console.error('Error getting game info:', error);
    }
}

export async function getGameForLobby(id: string) {
  try {     
      const response = await fetch('http://localhost:3000/games/lobby/' + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getAccessToken()
        },
      });

    if (await !response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.message);
    }
  
      const data: GameWithoutResults = await response.json();
      return data;

    } catch (error) {
      console.error('Error getting game info:', error);
    }
}

export async function createGame(game: CreateGame) {
  try {     
      const response = await fetch('http://localhost:3000/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getAccessToken()
        },
        body: JSON.stringify(game)
      });
  
      const data = await response.json();
      return data.gameId;

    } catch (error) {
      console.error('Error creating a game:', error);
    }
}

export async function updateResults(gameId:string, guestAccountUsernames: string[], lobbyId: string) {
  try {     
      const response = await fetch('http://localhost:3000/games/' + gameId, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getAccessToken()
        },
        body: JSON.stringify({guestAccountUsernames, lobbyId})
      });

      if(response.status != 204) {
        console.error(response)
      }
      
      await deleteLobby(lobbyId);

    } catch (error) {
      console.error('Error getting game results:', error);
    }
}
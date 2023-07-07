import {getAccessToken} from "./auth-service";

interface GuestAccount {
    username: string,
    avatar: string
}
  
export interface Lobby {
  gameId: string;
  code: string,
  guestAccounts?: GuestAccount[]
}

export async function getLobby(id: string) {
  try {     
    const response = await fetch('http://localhost:3000/lobbies/' + id, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getAccessToken()
      },
    });

    const statusCode = response.status;

    if (statusCode === 404) {
      return { message: "Lobby not found" };
    }

    if (statusCode === 403) {
      return { message: "You got kicked out" };
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching game info:', error);
    throw error; // Re-throw the error to maintain the rejection
  }
}

export async function updateLobby(id: string, guestUsernames: string[]) {
    try {     
        const response = await fetch('http://localhost:3000/lobbies/' + id, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getAccessToken(),
          },
          body: JSON.stringify({guestUsernames})
        });
    
        const status = await response.status;
    } catch (error) {
    console.error('Error fetching game info:', error);
    }
}

export async function joinLobby(code: string) {
    try {     
      const response = await fetch('http://localhost:3000/lobbies/join/' + code, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getAccessToken(),
        },
      });
      const data = await response.json();
      return data.lobbyId;
  
    } catch (error) {
      console.error('Error fetching game info:', error);
    }
}

export async function exitLobby(lobbyId: string) {
  try {     
      const response = await fetch('http://localhost:3000/lobbies/exit/' + lobbyId, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getAccessToken(),
        },
      });

      if(response.status != 204) {
        console.error(response)
      }

  } catch (error) {
    console.error('Error fetching game info:', error);
  }
}

export async function createLobby(gameId: string) {
  try {     
      const response = await fetch('http://localhost:3000/lobbies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getAccessToken(),
        },
        body: JSON.stringify({gameId})
      });
  
      const data = await response.json();
      return data.lobbyId;

  } catch (error) {
    console.error('Error fetching game info:', error);
  }
}

export async function deleteLobby(lobbyId: string) {
  try {     
      const response = await fetch('http://localhost:3000/lobbies/' + lobbyId, {
        method: 'Delete',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getAccessToken(),
        },
      });

      if(response.status != 204) {
        console.error(response)
      }
  } catch (error) {
    console.error('Error fetching game info:', error);
  }
}
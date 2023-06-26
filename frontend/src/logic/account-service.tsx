import {getAccessToken} from "./auth-service";

interface AccountInfo {
    username: string,
    games: string[],
    avatar: string
}

let accountInfo: AccountInfo;

export async function getAccountInfo() {
    try {
        const response = await fetch('http://localhost:3000/accounts/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getAccessToken()
          },
        });
    
        const data = await response.json();
        accountInfo = data;
        return accountInfo;
  
      } catch (error) {
        console.error('Error fetching game info:', error);
      }
}
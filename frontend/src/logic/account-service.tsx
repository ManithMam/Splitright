import {getAccessToken} from "./auth-service";

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
        return data;
  
      } catch (error) {
        console.error('Error fetching game info:', error);
      }
}
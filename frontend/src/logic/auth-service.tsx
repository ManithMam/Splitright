export async function login(username: string, password: string) {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        saveAccessToken(data.token);
        return true;
      } else {
        return false;
      }
      
    } catch (error) {
      console.error('Error fetching game info:', error);
      return false;
    }
}

function saveAccessToken(token: string) {
    localStorage.setItem('access_token', token);
}
  
export function getAccessToken(): string | null {
    return localStorage.getItem('access_token');
}
  
export function removeAccessToken() {
    localStorage.removeItem('access_token');
}
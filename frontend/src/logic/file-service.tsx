export async function getImage(filename: string) {
    try {     
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/files/' + filename, {
          method: 'GET',
          headers: {
            'Content-Type': 'image/png',
          },
        });
    
        const data = await response;
        return data;
  
      } catch (error) {
        console.error('Error fetching game info:', error);
      }
}
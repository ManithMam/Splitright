export async function getImage(filename: string) {
    try {     
        const response = await fetch('http://localhost:3000/files/' + filename, {
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
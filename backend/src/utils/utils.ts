// Fisher–Yates shuffle
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
export function shuffleArray(array: any[]) {
    let currentIndex = array.length;
    let randomIndex;
  
    // while there remain elements to shuffle
    while (currentIndex != 0) {
  
      // pick a remaining element between 0 (incl.) and currentIndex
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // and swap it with the current element (array destructuring)
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

export function removeStringFromArray(arr: string[], str: string): string[] {
  const index = arr.indexOf(str);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

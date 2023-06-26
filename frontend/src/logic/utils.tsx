export function removeStringFromArray(arr: string[], str: string): string[] {
    const index = arr.indexOf(str);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
}
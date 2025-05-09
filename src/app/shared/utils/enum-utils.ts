export function enumToAarray<T>(enumObj: T) {
  const temp = Object.entries(enumObj as Object).map(([key, value]) => ({
    key,
    value
  }));
  return temp.slice(temp.length / 2);
}

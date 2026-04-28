type CharacterSets = {
  numbers?: boolean,
  lowercase?: boolean,
  uppercase?: boolean,
};

export const getRandomString = (length: number, usedSets: CharacterSets) => {
  const characterSets = {
    numbers: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    lowercase: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    uppercase: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
  };

  // @ts-ignore
  const availableCharacters: string[] = Object.keys(usedSets).reduce((previousValue, key) => previousValue.concat(usedSets[key] ? characterSets[key] : []), []);
  let result = "";

  for(let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    const randomCharacter = availableCharacters[randomIndex];
    
    result += randomCharacter;
  }

  return result;
};
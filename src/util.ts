// match only ascii latin characters
export const filesafePattern = /[^a-z0-9_-]/gi;
const noDupes = /_{2,}/gi;
export const sanitizeFilename = (fn: string): string => fn.replace(filesafePattern, "_").replace(noDupes, "_");

// match the die expression in a string, ex "1d6 + 2", "1d12", "2d4+1"
export const levelDiePattern = /\d*d\d*(\s*\+\s*\d*)?/gi;
// hope that I had put the level die in with consistent formatting
// and try to parse it out. Fallback to 1d6.
export const parseLevelDie = (possibleLevelDie: string): string => {
  const matches = possibleLevelDie.match(levelDiePattern);

  // the safest default for cyphers in the book seems to be 1d6
  return matches && matches.length > 0 ? matches[0] : "1d6";
};

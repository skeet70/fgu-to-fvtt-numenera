import {
  FGU_LIGHT,
  FGU_MEDIUM,
  FGU_HEAVY,
  FVTT_LIGHT,
  FVTT_MEDIUM,
  FVTT_HEAVY,
  FguWeightClass,
  FvttWeightClass,
  FvttRange,
  FVTT_IMMEDIATE,
  FGU_SHORT,
  FVTT_SHORT,
  FGU_LONG,
  FVTT_LONG,
  FVTT_VERY_LONG,
  FGU_VERY_LONG,
  FGU_SPECIAL_LIGHT,
  FGU_SPECIAL_MEDIUM,
  FGU_SPECIAL_HEAVY
} from "./item-types";

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

export const flattenFguNotes = (notes: string | string[]): string =>
  Array.isArray(notes) ? notes.map((p) => `<p>${p}</p>`).join("") : `<p>${notes}</p>`;

export const fguToFvttWeight = (weight: FguWeightClass): FvttWeightClass => {
  switch (weight) {
    case FGU_LIGHT:
    case FGU_SPECIAL_LIGHT:
      return FVTT_LIGHT;
    case FGU_MEDIUM:
    case FGU_SPECIAL_MEDIUM:
      return FVTT_MEDIUM;
    case FGU_HEAVY:
    case FGU_SPECIAL_HEAVY:
      return FVTT_HEAVY;
    default:
      throw new Error(`Encountered unknown FGU weight class: ${weight}`);
  }
};

// Just try to parse it and set 0 if we fail. Does work with common inputs like 5, 20 shins, etc.
export const fguToFvttPrice = (cost: string): number => {
  const price = parseFloat(cost);
  return isNaN(price) || price < 0 ? 0 : price;
};

export const getDepletionThresholdAndDepletable = (match: string): [number, boolean] => {
  // if it's not a dash, we're some sort of depletable, parse it and default to 1
  if (match !== "—" && match !== "-") {
    const num = parseInt(match);
    return [isNaN(num) ? 1 : num, true];
  } else {
    return [1, false];
  }
};

export const rangeStrToType = (s: string): FvttRange => {
  switch (s.toLowerCase()) {
    case FGU_SHORT.toLowerCase():
      return FVTT_SHORT;
    case FGU_LONG.toLowerCase():
      return FVTT_LONG;
    case FGU_VERY_LONG.toLowerCase():
      return FVTT_VERY_LONG;
    default:
      return FVTT_IMMEDIATE;
  }
};

import { filesafePattern, levelDiePattern, sanitizeFilename, parseLevelDie } from "../util";

describe("filesafePattern", () => {
  it("matches non-latin ascii characters", () => {
    expect("Help me obi-wan!".match(filesafePattern)).toEqual([" ", " ", "!"]);
  });
});

describe("sanitizeFilename", () => {
  it("replaces non-latin ascii characters", () => {
    expect(sanitizeFilename("Temporal Nodule Blasting")).toEqual("Temporal_Nodule_Blasting");
  });

  it("doesn't get too overzealous", () => {
    expect(sanitizeFilename("Temporal Nodule (Blasting)")).toEqual("Temporal_Nodule_Blasting_");
  });
});

describe("levelDiePattern", () => {
  it("matches dice expressions", () => {
    expect("1d6".match(levelDiePattern)?.shift()).toEqual("1d6");
    expect("1d6+2".match(levelDiePattern)?.shift()).toEqual("1d6+2");
    expect("1d6 + 3".match(levelDiePattern)?.shift()).toEqual("1d6 + 3");
    expect("1d12".match(levelDiePattern)?.shift()).toEqual("1d12");
    expect("2d100".match(levelDiePattern)?.shift()).toEqual("2d100");
    expect("Level: 1d6".match(levelDiePattern)?.shift()).toEqual("1d6");
  });

  it("doesn't match other junk", () => {
    expect("junk".match(levelDiePattern)).toBeNull();
    expect("Level: 66x8".match(levelDiePattern)).toBeNull();
  });
});

describe("parseLevelDie", () => {
  it("extracts dice expressions", () => {
    expect(parseLevelDie("1d6")).toEqual("1d6");
    expect(parseLevelDie("1d6+2")).toEqual("1d6+2");
    expect(parseLevelDie("1d6 + 3)")).toEqual("1d6 + 3");
    expect(parseLevelDie("1d12")).toEqual("1d12");
    expect(parseLevelDie("2d100")).toEqual("2d100");
    expect(parseLevelDie("Level: 1d6")).toEqual("1d6");
  });

  it("defaults to 1d6 for junk", () => {
    expect(parseLevelDie("junk")).toBe("1d6");
    expect(parseLevelDie("Level: 66x8")).toBe("1d6");
  });
});

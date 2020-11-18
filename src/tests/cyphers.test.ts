import { FguNumenera, fguToFvttCyphers } from "../cyphers";

describe("fguToFvttCyphers", () => {
  it("happy path converts how we expect", () => {
    const fguCypher: FguNumenera = {
      armor: 0,
      damage: 0,
      depletion: 0,
      isidentified: 0,
      level: 0,
      locked: 1,
      name: "X-ray Goggles",
      nonid_name: "Glass panel",
      nonid_notes: "Level: 1d6 + 4",
      notes: {
        p: "gobbledegook"
      },
      type: "cypher"
    };

    const expected = {
      name: "X-ray Goggles",
      type: "cypher",
      data: {
        identified: false,
        level: null,
        levelDie: "1d6 + 4",
        form: "Glass panel",
        effect: "<p>gobbledegook</p>",
        name: "X-ray Goggles"
      }
    };

    expect(fguToFvttCyphers({ "id-irrelevant": fguCypher })).toEqual([expected]);
  });

  it("handles multiple paragraphs", () => {
    const fguCypher: FguNumenera = {
      armor: 0,
      damage: 0,
      depletion: 0,
      isidentified: 0,
      level: 0,
      locked: 1,
      name: "X-ray Goggles",
      nonid_name: "Glass panel",
      nonid_notes: "Level: 1d6 + 4",
      notes: {
        p: ["gobbledegook", "second line"]
      },
      type: "cypher"
    };

    const expected = {
      name: "X-ray Goggles",
      type: "cypher",
      data: {
        identified: false,
        level: null,
        levelDie: "1d6 + 4",
        form: "Glass panel",
        effect: "<p>gobbledegook</p><p>second line</p>",
        name: "X-ray Goggles"
      }
    };

    expect(fguToFvttCyphers({ "id-irrelevant": fguCypher })).toEqual([expected]);
  });
});

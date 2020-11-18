import { parseLevelDie } from "./util";

export interface FguNumenera {
  armor: number;
  damage: number;
  depletion: number;
  isidentified: 0 | 1;
  level: number;
  locked: 0 | 1;
  name: string;
  nonid_name: string;
  nonid_notes: string;
  notes: { p: string | string[] };
  type: "cypher" | "artifact";
}

export interface FvttCypher {
  name: string; // same as data.name
  type: "cypher";
  data: {
    identified: boolean;
    level: number | null;
    levelDie: string; // die to autoroll when added to inventory (ex "1d6 + 4")
    form: string;
    name: string; // same as ^.name
    effect: string; // html, should just be <p> here
  };
}

export const fguToFvttCyphers = (fguCyphers: Record<string, FguNumenera>): FvttCypher[] =>
  Object.values(fguCyphers)
    .filter((cypher) => cypher.type === "cypher")
    .map((cypher) => {
      let effect = cypher.notes.p;
      if (effect instanceof Array) {
        effect = effect.map((p) => `<p>${p}</p>`).join("");
      } else {
        effect = `<p>${effect}</p>`;
      }

      const levelDie = parseLevelDie(cypher.nonid_notes || "");

      return {
        name: cypher.name,
        type: "cypher",
        data: {
          identified: Boolean(cypher.isidentified),
          level: cypher.level !== 0 ? cypher.level : null,
          levelDie, // die to autoroll when added to inventory
          form: cypher.nonid_name,
          name: cypher.name,
          effect
        }
      };
    });

import {
  FguItemMap,
  FvttItem,
  isFguArmor,
  isFguArtifact,
  isFguCypher,
  isFguEquipment,
  isFguWeapon,
  FguArmor,
  FvttArmor,
  ARMOR,
  ARMOR_ICON,
  FguArtifact,
  FvttArtifact,
  FguCypher,
  FvttCypher,
  CYPHER,
  FguEquipment,
  FvttEquipment,
  FguWeapon,
  FvttWeapon,
  ARTIFACT,
  EQUIPMENT,
  ARTIFACT_ICON,
  CYPHER_ICON,
  EQUIPMENT_ICON,
  WEAPON_ICON,
  WEAPON,
  FGU_IMMEDIATE,
  FVTT_IMMEDIATE,
  FVTT_SHORT,
  FVTT_LONG,
  FVTT_VERY_LONG,
  FGU_LIGHT,
  FVTT_LIGHT,
  FGU_MEDIUM,
  FVTT_MEDIUM,
  FGU_HEAVY,
  FVTT_HEAVY,
  FVTT_BASHING,
  FVTT_BLADED,
  FVTT_RANGED
} from "./item-types";
import {
  fguToFvttPrice,
  fguToFvttWeight,
  flattenFguNotes,
  parseLevelDie,
  getDepletionThresholdAndDepletable,
  rangeStrToType
} from "./util";

// Driving function that maps over an FGU item map (a map of item id to item) and generates a list of Foundry items.
export const fguToFvtt = (fguItems: FguItemMap): FvttItem[] =>
  Object.values(fguItems).map((item) => {
    // This is long but all it's really doing is switching on the type and calling the right converter.
    if (isFguArmor(item)) {
      return fguToFvttArmor(item);
    } else if (isFguArtifact(item)) {
      return fguToFvttArtifact(item);
    } else if (isFguCypher(item)) {
      return fguToFvttCypher(item);
    } else if (isFguEquipment(item)) {
      return fguToFvttEquipment(item);
    } else if (isFguWeapon(item)) {
      return fguToFvttWeapon(item);
    } else {
      throw new Error(
        "Encountered an unexpected type while processing FGU items: " + JSON.stringify(item, undefined, 2)
      );
    }
  });

export const fguToFvttArmor = (armor: FguArmor): FvttArmor => {
  const notes = flattenFguNotes(armor.notes.p);
  const weight = fguToFvttWeight(armor.subtype);
  const price = fguToFvttPrice(armor.cost);

  return {
    name: armor.name,
    type: ARMOR,
    img: ARMOR_ICON,
    data: {
      notes,
      price,
      weight,
      armor: armor.armor,
      additionalSpeedEffortCost: 0,
      name: armor.name
    }
  };
};

// group 1: threshold upper range or — if undepletable
// group 3: depletion die, not an expression. not present if undepletable
const depletionRegex = /depletion:\s*\d?(?:–|-)?(\d|\d|—|-)(\s*in\s*\d(d\d*))?/gim;
export const fguToFvttArtifact = (artifact: FguArtifact): FvttArtifact => {
  const effect = flattenFguNotes(artifact.notes.p);
  const levelDie = parseLevelDie(artifact.nonid_notes || "");

  const matches = [...effect.matchAll(depletionRegex)][0];

  // try a few ways to get these. They start on defaults.
  let depletionThreshold = 1;
  let depletable = true;
  let depletionDie = "d100";
  if (matches) {
    const depletionThresholdMatch = matches[1] || "1";
    const depletionDieMatch = matches[3];
    [depletionThreshold, depletable] = getDepletionThresholdAndDepletable(depletionThresholdMatch);
    depletionDie = depletionDieMatch != undefined ? depletionDieMatch : "d100";
  } else if (artifact.depletion !== 0 && artifact.depletiondie != undefined) {
    depletionThreshold = artifact.depletion;
    depletionDie = artifact.depletiondie;
    depletable = true;
  }

  return {
    name: artifact.name,
    type: ARTIFACT,
    img: ARTIFACT_ICON,
    data: {
      identified: Boolean(artifact.isidentified),
      level: "", // unsettable
      levelDie, // die to autoroll when added to inventory
      form: artifact.nonid_name,
      name: artifact.name,
      effect,
      depletion: {
        isDepleting: depletable, // whether or not the depletion die and threshold are used
        die: depletionDie,
        threshold: depletionThreshold // values like 1 (meaning 1 in dN) or 4 (1-4 in dN)
      },
      price: 0, // unsettable
      laws: "", // unsettable
      range: "" // unsettable
    }
  };
};

export const fguToFvttCypher = (cypher: FguCypher): FvttCypher => {
  const effect = flattenFguNotes(cypher.notes.p);
  const levelDie = parseLevelDie(cypher.nonid_notes || "");

  return {
    name: cypher.name,
    type: CYPHER,
    img: CYPHER_ICON,
    data: {
      identified: Boolean(cypher.isidentified),
      level: null,
      levelDie, // die to autoroll when added to inventory
      form: cypher.nonid_name,
      name: cypher.name,
      effect
    }
  };
};

export const fguToFvttEquipment = (equipment: FguEquipment): FvttEquipment => {
  const notes = flattenFguNotes(equipment.notes.p);
  const price = fguToFvttPrice(equipment.cost);

  return {
    name: equipment.name,
    type: EQUIPMENT,
    img: EQUIPMENT_ICON,
    data: {
      notes,
      price,
      name: equipment.name,
      quantity: 0
    }
  };
};

const rangeRegex = /Short|Long|Immediate|Very Long/gim;
export const fguToFvttWeapon = (weapon: FguWeapon): FvttWeapon => {
  const notes = flattenFguNotes(weapon.notes.p);
  const weight = fguToFvttWeight(weapon.subtype);
  const price = fguToFvttPrice(weapon.cost);
  const rangeMatches = notes.match(rangeRegex);
  const rangeStr = rangeMatches !== null && rangeMatches.length > 0 ? rangeMatches[0] : FGU_IMMEDIATE;
  const range = rangeStrToType(rangeStr);

  return {
    name: weapon.name,
    type: WEAPON,
    img: WEAPON_ICON,
    data: {
      notes,
      range,
      price,
      weight,
      damage: weapon.damage,
      weaponType: range === FVTT_IMMEDIATE ? FVTT_BLADED : FVTT_RANGED,
      // everything here down in data is hardcoded but seems necessary
      ranges: [FVTT_IMMEDIATE, FVTT_SHORT, FVTT_LONG, FVTT_VERY_LONG],
      weightClasses: [
        {
          weightClass: FGU_LIGHT,
          label: FVTT_LIGHT,
          checked: false
        },
        {
          weightClass: FGU_MEDIUM,
          label: FVTT_MEDIUM,
          checked: false
        },
        {
          weightClass: FGU_HEAVY,
          label: FVTT_HEAVY,
          checked: false
        }
      ],
      weaponTypes: [
        {
          weaponType: "Bashing",
          label: FVTT_BASHING,
          checked: false
        },
        {
          weaponType: "Bladed",
          label: FVTT_BLADED,
          checked: false
        },
        {
          weaponType: "Ranged",
          label: FVTT_RANGED,
          checked: false
        }
      ]
    }
  };
};

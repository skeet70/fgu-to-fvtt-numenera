export const ARMOR = "armor";
export const ARMOR_ICON = "icons/svg/statue.svg";
export const ARTIFACT = "artifact";
export const ARTIFACT_ICON = "icons/svg/mage-shield.svg";
export const CYPHER = "cypher";
export const CYPHER_ICON = "icons/svg/pill.svg";
export const WEAPON = "weapon";
export const WEAPON_ICON = "icons/svg/sword.svg";
// equipment doesn't have a type value in FGU
export const EQUIPMENT = "equipment";
export const EQUIPMENT_ICON = "icons/svg/anchor.svg";

/* START FGU Types */
export const FGU_LIGHT = "Light";
export const FGU_SPECIAL_LIGHT = "Special Light";
export const FGU_MEDIUM = "Medium";
export const FGU_SPECIAL_MEDIUM = "Special Medium";
export const FGU_HEAVY = "Heavy";
export const FGU_SPECIAL_HEAVY = "Special Heavy";
export const FGU_IMMEDIATE = "Immediate";
export const FGU_SHORT = "Short";
export const FGU_LONG = "Long";
export const FGU_VERY_LONG = "Very Long";

// if there isn't a "type"/kind it's an equipment
export type FguItemKind = typeof ARMOR | typeof ARTIFACT | typeof CYPHER | typeof WEAPON;

export type FguWeightClass =
  | typeof FGU_LIGHT
  | typeof FGU_SPECIAL_LIGHT
  | typeof FGU_MEDIUM
  | typeof FGU_SPECIAL_MEDIUM
  | typeof FGU_HEAVY
  | typeof FGU_SPECIAL_HEAVY;

export interface FguItem {
  armor: number;
  damage: number;
  depletion: number; // not sure what this is on cyphers, but it's there. On artifacts, if they have `depletiondie` it's the number rolled on that to cause depletion
  level: 0; // always zero for things in the item repository
  locked: 0 | 1; // not used right now, indicates whether it is editable in FGU or not
  name: string;
  nonid_name: string;
  notes: { p: string | string[] };
  type?: FguItemKind; // if there isn't a "type" it's an equipment
}

export interface FguArmor extends FguItem {
  subtype: FguWeightClass; // Light, Medium, or Heavy in mine, but could be anything and is as string on the other side.
  type: typeof ARMOR;
  cost: string; // in mine this is stuff like 1 or 25 shins. Needs to be a # for FVTT
}
export const isFguArmor = (item: FguItem): item is FguArmor => (item as FguArmor).type === ARMOR;

export interface FguEquipment extends FguItem {
  type: undefined;
  cost: string; // in mine this is stuff like 1 or 25 shins. Needs to be a # for FVTT
}
export const isFguEquipment = (item: FguItem): item is FguEquipment => (item as FguEquipment).type === undefined;
// No range value in FGU. In my stuff it's in the description, always before the word "range".
// No weapon type value in FGU. Can probably default to "bashing" and intelligently guess at "ranged".

export interface FguWeapon extends FguItem {
  subtype: FguWeightClass; // Light, Medium, or Heavy in mine
  type: typeof WEAPON;
  cost: string; // in mine this is stuff like 1 or 25 shins. Needs to be a # for FVTT
}
export const isFguWeapon = (item: FguItem): item is FguWeapon => (item as FguWeapon).type === WEAPON;

export interface FguNumenera extends FguItem {
  isidentified: 0 | 1;
  nonid_notes: string;
  type: typeof CYPHER | typeof ARTIFACT;
}
// I'm only sporadically using the `depletiondie`, I think because it didn't do anything but 1 for depletion number. I'm always putting `Depletion: dieexpression` in the text though it looks like.

export interface FguArtifact extends FguNumenera {
  depletiondie?: string;
  type: typeof ARTIFACT;
}
export const isFguArtifact = (item: FguItem): item is FguArtifact => (item as FguArtifact).type === ARTIFACT;

export interface FguCypher extends FguNumenera {
  type: typeof CYPHER;
}
export const isFguCypher = (item: FguItem): item is FguCypher => (item as FguCypher).type === CYPHER;

export type FguItemMap = Record<string, FguItem>;

export interface FguParsedDb {
  root: {
    item: FguItemMap | { category: FguItemMap[] };
  };
}
/* END FVTT Numenera Types */
/* START FVTT Numenera Types */
export const FVTT_IMMEDIATE = "NUMENERA.range.immediate";
export const FVTT_SHORT = "NUMENERA.range.short";
export const FVTT_LONG = "NUMENERA.range.long";
export const FVTT_VERY_LONG = "NUMENERA.range.veryLong";
export type FvttRange = typeof FVTT_IMMEDIATE | typeof FVTT_SHORT | typeof FVTT_LONG | typeof FVTT_VERY_LONG;

export const FVTT_LIGHT = "NUMENERA.weightClasses.Light";
export const FVTT_MEDIUM = "NUMENERA.weightClasses.Medium";
export const FVTT_HEAVY = "NUMENERA.weightClasses.Heavy";
export type FvttWeightClass = typeof FVTT_LIGHT | typeof FVTT_MEDIUM | typeof FVTT_HEAVY;
export const FVTT_BASHING = "NUMENERA.weaponTypes.Bashing";
export const FVTT_BLADED = "NUMENERA.weaponTypes.Bladed";
export const FVTT_RANGED = "NUMENERA.weaponTypes.Ranged";
export type FvttWeaponType = typeof FVTT_BASHING | typeof FVTT_BLADED | typeof FVTT_RANGED;

export interface FvttArmor {
  name: string;
  type: typeof ARMOR;
  img: typeof ARMOR_ICON;
  data: {
    notes: string; // description value goes here
    price: number;
    weight: FvttWeightClass;
    armor: number;
    additionalSpeedEffortCost: 0; // as far as I can tell this isn't a common thing. Setting to 0 for now.
    name: string;
  };
}

export interface FvttEquipment {
  name: string;
  type: typeof EQUIPMENT;
  img: typeof EQUIPMENT_ICON;
  data: {
    notes: string; // description html goes here
    price: number;
    quantity: 0; // always 0 for compendium items
    name: string;
  };
}

export interface FvttWeapon {
  name: string;
  type: typeof WEAPON;
  img: typeof WEAPON_ICON;
  data: {
    notes: string; // description value goes here
    range: FvttRange;
    price: number;
    weight: FvttWeightClass;
    damage: number;
    weaponType: FvttWeaponType;
    // everything here down in data is hardcoded but seems necessary
    ranges: [typeof FVTT_IMMEDIATE, typeof FVTT_SHORT, typeof FVTT_LONG, typeof FVTT_VERY_LONG];
    weightClasses: [
      {
        weightClass: typeof FGU_LIGHT;
        label: typeof FVTT_LIGHT;
        checked: false;
      },
      {
        weightClass: typeof FGU_MEDIUM;
        label: typeof FVTT_MEDIUM;
        checked: false;
      },
      {
        weightClass: typeof FGU_HEAVY;
        label: typeof FVTT_HEAVY;
        checked: false;
      }
    ];
    weaponTypes: [
      {
        weaponType: "Bashing";
        label: typeof FVTT_BASHING;
        checked: false;
      },
      {
        weaponType: "Bladed";
        label: typeof FVTT_BLADED;
        checked: false;
      },
      {
        weaponType: "Ranged";
        label: typeof FVTT_RANGED;
        checked: false;
      }
    ];
  };
}

export interface FvttNumeneraCommonData {
  identified: boolean;
  levelDie: string; // die to autoroll when added to inventory (ex "1d6 + 4")
  form: string;
  name: string; // same as ^.name
  effect: string; // html, should just be <p> here
}

export interface FvttNumenera {
  name: string; // same as data.name
  type: typeof ARTIFACT | typeof CYPHER;
}

export interface FvttArtifact extends FvttNumenera {
  type: typeof ARTIFACT;
  data: FvttNumeneraCommonData & {
    depletion: {
      isDepleting: boolean; // whether or not the depletion die and threshold are used
      die: string; // values like d6, d100
      threshold: number; // values like 1 (meaning 1 in dN) or 4 (1-4 in dN)
    };
    price: 0; // unsettable, but appears in export
    laws: ""; // unsettable, but appears in export
    range: ""; // unsettable, but appears in export
    level: ""; // for compendium stuff I think this is always "" (artifacts)
  };
  img: typeof ARTIFACT_ICON;
}

export interface FvttCypher extends FvttNumenera {
  type: typeof CYPHER;
  data: FvttNumeneraCommonData & {
    level: null; // for compendium stuff I think this is always null (cyphers)
  };
  img: typeof CYPHER_ICON;
}

export type FvttItem = FvttArmor | FvttArtifact | FvttCypher | FvttEquipment | FvttWeapon;

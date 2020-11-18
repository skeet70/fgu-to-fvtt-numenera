import * as parser from "fast-xml-parser";
import * as fs from "fs";
import { FguNumenera, fguToFvttCyphers } from "./cyphers";
import { sanitizeFilename } from "./util";

const fguCyperFile = fs.readFileSync("./cyphers.xml", "utf8");
const fguCyphers: Record<string, FguNumenera> = parser.parse(fguCyperFile).root.item;
const fvttCyphers = fguToFvttCyphers(fguCyphers);

// make a destination directory
fs.mkdirSync("fvtt-cyphers", { recursive: true });

// write out a json file for each cypher
// fvttCyphers.forEach((cypher) =>
//   fs.writeFileSync(`fvtt-cyphers/fvtt-Item-${sanitizeFilename(cypher.name)}.json`, JSON.stringify(cypher))
// );

// write out a single array of all the cyphers
fs.writeFileSync(`fvtt-cyphers/compendium-import.json`, JSON.stringify(fvttCyphers));

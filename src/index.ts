import * as parser from "fast-xml-parser";
import * as fs from "fs";
import { fguToFvtt } from "./item-conversions";
import { FguItemMap, FguParsedDb } from "./item-types";

// TODO: get file passed in
const fguFile = fs.readFileSync("./equipment.xml", "utf8");
const fguItemsDb: FguParsedDb = parser.parse(fguFile);

// pull out the items and if there are categories, combine all the categories into one map
// in my testing so far this is safe, even when you have multiple categories they get unique ids
const fguItemsMaybeMap = fguItemsDb.root.item;
const fguMaybeCategories = fguItemsMaybeMap.category;
const combineCategories = (acc: FguItemMap, categoryMap: FguItemMap) => Object.assign(acc, categoryMap);
const fguItems: FguItemMap = Array.isArray(fguMaybeCategories)
  ? fguMaybeCategories.reduce(combineCategories, {})
  : (fguItemsMaybeMap as FguItemMap);
const fvttItems = fguToFvtt(fguItems);

// write out a json file for each item
// import {sanitizeFilename} from "./util";
// fs.mkdirSync("fvtt-items", { recursive: true });
// fvttItems.forEach((item) =>
//   fs.writeFileSync(`fvtt-items/fvtt-Item-${sanitizeFilename(item.name)}.json`, JSON.stringify(item))
// );

// write out a single array of all the items
fs.writeFileSync(`fvtt-compendium-for-import.json`, JSON.stringify(fvttItems));

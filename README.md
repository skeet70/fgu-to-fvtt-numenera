This is a quick project that converts Fantasy Grounds Unity Numenera items (cyphers, artifacts, equipment) to Foundry VTT Numenera items. This is solely so I don't personally need to re-enter all the hundreds of items I previously entered. It's tailored to the way I happened to input things. I hope it's useful to others, either because they happened on the same format as me or they can easily modify it to their format.

## Usage

_Currently only cyphers are supported._

1. Clone this repository.
1. Run `yarn && yarn start --fgu-xml path/to/db.xml` where the `db.xml` is in whatever campaign/module's items you're trying to import (for ex `Fantasy Grounds\campaigns\Cyphers\db.xml`).
1. Importable Cypher items will be placed in `./fvtt-compendium-for-import.json`.

Level die expressions are expected to be in the `nonid_notes` FGU field.

## Importing into a FVTT compendium

1. Create a compendium in the web application.
1. Open the web app console with F12.
1. Check the output of `game.packs`. The `key` value is structured as `module.pack`, copy those two values out and fill them into the example code below (`moduleName` and `packName`).
1. Copy out the content of `fvtt-cyphers/compendium-import.json` and paste it into the example code below as the `content` variable.
1. Paste the newly edited example code into the console and run it.

```js
// create a bunch of temporary items when given an array of them
var createManyItems = (items) => {
  return items.map((item) => new Item(item));
};

// retrieve this by looking at game.packs
var moduleName = "<your world name>";
var packName = "<your compendium pack name>";

// Reference a Compendium pack by it's collection ID
var pack = game.packs.find((p) => p.collection === `${moduleName}.${packName}`);

// Paste in the content of `fvtt-compendium-for-import.json`
var content = [
  {
    name: "example",
    type: "cypher",
    data: {
      identified: false,
      level: null,
      levelDie: "1d6",
      form: "Gloves with small flexible disks all over",
      name: "example",
      effect: "<p>effect description line</p>"
    }
  }
];

// or fetch the json if you have it on your server somewhere (or served from elsewhere on the web)
// var response = await fetch("worlds/myworld/data/import.json");
// var content = await response.json();

// Create temporary Item entities which impose structure on the imported data
var items = createManyItems(content);

// Save each temporary Item into the Compendium pack
for (let i of items) {
  await pack.importEntity(i);
  console.log(`Imported Item ${i.name} into Compendium pack ${pack.collection}`);
}
```

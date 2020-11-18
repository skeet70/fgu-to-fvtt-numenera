This is a quick project that converts Fantasy Grounds Unity Numenera items (cyphers, artifacts, equipment) to Foundry VTT Numenera items. This is solely so I don't personally need to re-enter all the hundreds of items I previously entered. It's tailored to the way I happened to input things. I hope it's useful to others, either because they happened on the same format as me or they can easily modify it to their format.

## Usage

_Currently only cyphers are supported._

1. Clone this repository.
1. Copy your `..\Fantasy Grounds\campaigns\Cyphers\db.xml` or equivalent into this folder as `./cyphers.xml`.
1. Run `yarn && yarn start`.
1. Importable Cypher items will be placed in `./fvtt-cyphers`.

Level die expressions are expected to be in the `nonid_notes` FGU field.

TODO:

1. Export a compendium of some sort instead of individual `.json` files.
1. Support the rest of the Numenera item types.

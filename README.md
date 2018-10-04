# Country code find

Information about countries - like their ISO (2/3) codes and currencies

## Installation

npm install country-data-find --save

## Usage

```
const Country = require('country-code-find');

// you can get all countries JSON format
let countriyJSON = Country.JSON();

// you can get all countries Array format
let arrayJSON = Country.Array();

let sl = Country.findCountry('Sri Lanka');
/* returns:
{
    "ISO3_CODE": "LKA",
    "ISO2_CODE": "LK",
    "CURRENCY": [ 
        { 
          "NAME": [ "Sri Lankan rupee" ],
          "CODE": [ "LKR" ],
          "NUM": []
        }
    ],
    "LIST_OF_NAME": {
        "ENG": ["Sri Lanka"],
        "DUTCH" : ["Sri Lanka"] 
    }
}
*/

```

## Notes

This npm patily done, but woking fine. I will hope to improve this module.

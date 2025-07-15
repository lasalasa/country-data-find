# country-data-find

> Powerful utility for looking up countries, ISO codes, currencies, and names in multiple languages.

A simple and flexible Node.js module to get country information—such as ISO 2/3 codes, currency, and multilingual names—from a single, unified data source.

---

## Installation

```bash
npm install country-data-find --save
````

---

## Usage

```js
const Country = require('country-data-find');

// Get all countries as a JSON object (ISO3_CODE as key)
const countryJSON = Country.JSON();

// Get all countries as an array of objects
const countryArray = Country.Array();

// Find a country by name (partial/case-insensitive, any language)
const sriLanka = Country.findCountry('Sri Lanka');

/* Output:
{
    ISO3_CODE: "LKA",
    ISO2_CODE: "LK",
    CURRENCY: [
        {
            NAME: ["Sri Lankan rupee"],
            CODE: ["LKR"],
            NUM: []
        }
    ],
    LIST_OF_NAME: {
        ENG: ["Sri Lanka"],
        DUTCH: ["Sri Lanka"]
    }
}
*/

// Find by ISO2 or ISO3 code
const countryByCode = Country.findByCode('LK'); // or 'LKA'

// Find ISO2 code from any country name
const iso2 = Country.findISO2Code('Sri Lanka'); // "LK"

// Find all names of a country in all languages (by code)
const allNames = Country.getAllNames('LK'); // ["Sri Lanka", "Sri Lanka"]

// Find all countries by currency code
const usdCountries = Country.findByCurrencyCode('USD'); // Array of country objects

// List all countries with their names in Dutch
const dutchCountries = Country.filterByLanguage('DUTCH');
```

---

## Features

* Search for a country by **any name** (all languages, partial/case-insensitive)
* Look up country by **ISO2 or ISO3 code**
* Get **ISO codes** from a country name
* Find all **names** for a country in all supported languages
* Find all countries by **currency code**
* List all country names in a specific **language**
* Access all data as **JSON** or **array**

---

## Data Source

* Data is based on an internal JSON file with ISO codes, currency info, and multilingual names for each country.

---

## Notes

* This package is actively maintained and will continue to add more features (region lookup, phone codes, fuzzy search, and more).
* For suggestions or contributions, feel free to submit an issue or pull request.

---

## License

MIT

---

*© 2024-present country-data-find contributors*

# country-data-find

> Powerful utility for looking up countries, ISO codes, currencies, regions, and names in multiple languages.

A simple and flexible Node.js module to get country information—such as ISO 2/3 codes, currencies, multilingual names, region, phone codes, and more—from a single, unified data source.

---

## Installation

```bash
npm install country-data-find --save
````

---

## Usage (JavaScript)

```js
const Country = require('country-data-find');

// Get all countries as a JSON object (ISO3_CODE as key)
const countryJSON = Country.JSON();

// Get all countries as an array of objects
const countryArray = Country.Array();

// Find a country by name (partial/case-insensitive, any language)
const germany = Country.findCountry('Deutschland'); // works for English, German, French, etc.

// Find a country using fuzzy/typo-tolerant search (requires fuse.js)
const fuzzy = Country.fuzzyFindCountry('Sr Lanka'); // Finds "Sri Lanka" even with typos

// Find a country by ISO2 or ISO3 code
const countryByCode = Country.findByCode('LK'); // or 'LKA'

// Find ISO2 code from any country name
const iso2 = Country.findISO2Code('Sri Lanka'); // "LK"

// Find all names of a country in all languages (by code)
const allNames = Country.getAllNames('LK'); // e.g., ["Sri Lanka", "スリランカ", ...]

// Find all countries by currency code or name
const usdCountries = Country.findCountriesByCurrency('USD');
const rupeeCountries = Country.findCountriesByCurrency('rupee');

// Find all countries in a region or subregion
const asianCountries = Country.findByRegion('Asia');

// Find countries by phone code (if PHONE_CODE field is present)
const byPhone = Country.findByPhoneCode('94'); // ["Sri Lanka"]

// List all country names in a specific language
const dutchCountries = Country.filterByLanguage('NL'); // or 'DUTCH'

// Get the country name in a requested language
const germanInDutch = Country.getCountryNameInLanguage('DE', 'NL'); // "Duitsland"

// Autocomplete: find all countries whose names start with a partial input
const startsWithGer = Country.autocompleteCountry('Ger', 'ENG'); // ["Germany", ...]

// Flexible advanced query (e.g., by currency or any custom field)
const flexible = Country.findCountryFlexible({ 'CURRENCY.CODE': 'USD', REGION: 'Americas' });

// Get country flag emoji by ISO2 code
const flag = Country.getFlagEmoji('LK'); // 🇱🇰

// Validate if a string is a valid ISO2/ISO3 country code
const isValid = Country.isValidCountryCode('LKA'); // true

// Find a country by capital city
const sriLanka = Country.findByCapital('Sri Jayawardenepura Kotte');

// Find countries by language
const sinhalaCountries = Country.findByLanguage('Sinhala');

// Find countries by timezone
const utc530 = Country.findByTimezone('UTC+05:30');

// Get neighbors of a country
const neighbors = Country.getNeighbors('LK'); // Returns array of country objects

// Get country demographics
const demonym = Country.getDemonym('LK'); // "Sri Lankan"
const area = Country.getArea('LK'); // 65610
const population = Country.getPopulation('LK'); // 21919000
```

---

## Usage (TypeScript)

`country-data-find` ships with full TypeScript typings out of the box!

```ts
import {
  Country,
  CountryType,
  findCountriesByCurrency,
  getFlagEmoji,
  isValidCountryCode,
  fuzzyFindCountry,
  autocompleteCountry
} from 'country-data-find';

// All countries as strongly-typed array
const all: CountryType[] = Country.Array();

// Find by code, with type inference
const sriLanka: CountryType | undefined = Country.findByCode('LK');

// Get all names in all languages (type-safe)
const allNames: string[] = Country.getAllNames('LK');

// Find countries by currency code
const usdCountries: CountryType[] = findCountriesByCurrency('USD');

// Fuzzy country search
const fuzzy = fuzzyFindCountry('Sr Lanka');

// Get flag emoji
const flag: string = getFlagEmoji('LK');

// Type guard for country code
const valid: boolean = isValidCountryCode('USA');

// Autocomplete countries by name
const auto: CountryType[] = autocompleteCountry('Ger', 'ENG');

// Find by capital
const capital: CountryType | undefined = Country.findByCapital('Colombo');

// Find by language
const langCountries: CountryType[] = Country.findByLanguage('Sinhala');

// Find by timezone
const tzCountries: CountryType[] = Country.findByTimezone('UTC+05:30');

// Get neighbors
const neighbors: CountryType[] = Country.getNeighbors('LK');

// Get demographics
const demonym: string | null = Country.getDemonym('LK');
const area: number | null = Country.getArea('LK');
const pop: number | null = Country.getPopulation('LK');
```

**Tip:**
All methods, return types, and object shapes are fully type-safe and provide autocompletion in your editor.

---

## Typings Support

* Full TypeScript declarations included (`index.d.ts`)
* No extra install required; types are loaded automatically

---

## Sample Output

<details>
<summary>Click to expand</summary>

### Example: `Country.findCountry('Sri Lanka')`

```json
{
  "ISO3_CODE": "LKA",
  "ISO2_CODE": "LK",
  "CURRENCY": [
    {
      "NAME": ["Sri Lankan rupee"],
      "CODE": ["LKR"],
      "NUM": [],
      "SYMBOL": ["Rs"]
    }
  ],
  "LIST_OF_NAME": {
    "ENG": ["Sri Lanka"],
    "DE": ["Sri Lanka"],
    "FR": ["Sri Lanka"],
    "NL": ["Sri Lanka"],
    "JA": ["スリランカ"],
    "IT": ["Sri Lanka"],
    "ES": ["Sri Lanka"],
    "NATIVE": ["ශ්‍රී ලංකාව"]
  },
  "REGION": "Asia",
  "SUBREGION": "Southern Asia",
  "CAPITAL": "Colombo",
  "POPULATION": 21803000,
  "FLAG": null,
  "DEMONYM": "Sri Lankan",
  "AREA": 65610,
  "TIMEZONES": ["UTC+05:30"],
  "BORDERS": [],
  "LANGUAGES": ["Sinhala", "Tamil"],
  "PHONE_CODE": ["94"]
}
```

### Example: `Country.getAllNames('DE')`

```json
[
  "Germany",
  "Deutschland",
  "Allemagne",
  "Duitsland",
  "Alemania",
  "ドイツ",
  "Germania",
  "Németország"
]
```

### Example: `Country.findCountriesByCurrency('USD')` (snippet)

```json
[
  {
    "ISO3_CODE": "USA",
    "ISO2_CODE": "US",
    "CURRENCY": [
      {
        "NAME": ["United States dollar"],
        "CODE": ["USD"],
        "NUM": [],
        "SYMBOL": ["$"]
      }
    ],
    ...
    "REGION": "Americas",
    "LIST_OF_NAME": { ... }
  },
  {
    "ISO3_CODE": "ECU",
    "ISO2_CODE": "EC",
    ...
    "CURRENCY": [
      {
        "NAME": ["United States dollar"],
        "CODE": ["USD"],
        "NUM": [],
        "SYMBOL": ["$"]
      }
    ]
  }
  // ...more
]
```

### Example: `Country.getFlagEmoji('LK')`

```js
"🇱🇰"
```

</details>

---

## Features

* Search for a country by **any name** (all languages, partial/case-insensitive)
* **Fuzzy search** for country names with typo tolerance (with [fuse.js](https://www.npmjs.com/package/fuse.js))
* Look up country by **ISO2 or ISO3 code**
* Get **ISO codes** from a country name
* Find all **names** for a country in all supported languages
* Find all countries by **currency code** or **currency name**
* Find all countries by **region** or **subregion**
* Find countries by **phone code**
* List all country names in a specific **language**
* **Autocomplete** country names in any language
* Get a country's name in **any language**
* Flexible advanced queries for custom fields (e.g., region, currency)
* **Country flag emoji** lookup by ISO2 code
* **Validation** of country codes
* Access all data as **JSON** or **array**
* Find country by **capital city**
* Find countries by **language**
* Find countries by **timezone**
* Get **neighbors** (bordering countries)
* Get **demographics** (demonym, area, population)

---

## Data Source

* Data is based on an internal JSON file with ISO codes, currencies, multilingual names, region, subregion, population, flag URL, phone codes, and more, generated from authoritative open data sources.

---

## Advanced Usage

* For **fuzzy searching**, install `fuse.js` as a dependency:

  ```bash
  npm install fuse.js
  ```
* You can customize and extend lookups by adding your own fields to the data structure.

---

## Notes

* This package is actively maintained and will continue to add more features (such as improved fuzzy matching, country subdivisions, and more).
* For suggestions or contributions, feel free to submit an issue or pull request.

---

## License

MIT

---

*© 2024-present country-data-find contributors*

// index.d.ts

/** Type for a currency used by a country */
export interface CountryCurrency {
  CODE: string[];    // Currency codes, e.g., ['USD', 'USN']
  NAME: string[];    // Names, e.g., ['US Dollar']
  SYMBOL?: string[]; // Optional symbols, e.g., ['$']
}

/** Type for names in various languages */
export interface CountryNames {
  [lang: string]: string[]; // E.g., ENG: ['United Kingdom', ...], SIN: [...]
}

/** Type for a country object */
export interface CountryType {
  ISO2_CODE: string;             // e.g., 'LK'
  ISO3_CODE: string;             // e.g., 'LKA'
  LIST_OF_NAME: CountryNames;    // All names in all languages
  CURRENCY?: CountryCurrency[];  // List of currencies
  REGION?: string;               // e.g., 'Asia'
  PHONE_CODE?: string[] | string;// e.g., ['94']
  [key: string]: any;            // Allow extension for extra fields in Country.json
}

/** Type for the flexible query */
export type CountryFlexibleQuery =
  | { [K in keyof CountryType]?: any }
  | { [key: string]: any };

/** JSON object of countries, keyed by ISO2/3 or some ID */
export interface CountryJSONType {
  [key: string]: CountryType;
}

/** ---- MAIN COUNTRY OBJECT ---- */

export declare const Country: {
  /** All countries as JSON object */
  JSON(): CountryJSONType;

  /** All countries as array */
  Array(): CountryType[];

  /** Find a country by any of its names (partial, case-insensitive, any language) */
  findCountry(name: string): CountryType | undefined;

  /** Find by ISO2 or ISO3 code */
  findByCode(code: string): CountryType | undefined;

  /** Find ISO2 code from any country name */
  findISO2Code(name: string): string | null;

  /** Find ISO3 code from any country name */
  findISO3Code(name: string): string | null;

  /** Get all names (all languages) by ISO2/ISO3 code */
  getAllNames(code: string): string[];

  /** List all country names in a specific language */
  filterByLanguage(lang?: string): { code: string; name: string[] }[];
};

/** ---- ADVANCED FUNCTIONS ---- */

/** Fuzzy search for country (requires fuse.js) */
export declare function fuzzyFindCountry(name: string): CountryType | undefined;

/** Find all countries using a currency (by code or name) */
export declare function findCountriesByCurrency(input: string): CountryType[];

/** Find all countries in a given region/continent */
export declare function findByRegion(region: string): CountryType[];

/** Find countries by phone code */
export declare function findByPhoneCode(phone: string): CountryType[];

/** Get the country's name in a given language (first variant) */
export declare function getCountryNameInLanguage(
  code: string,
  lang?: string
): string | null;

/** Autocomplete: find countries whose names start with input (in a language) */
export declare function autocompleteCountry(
  partial: string,
  lang?: string
): CountryType[];

/** Flexible search: query by fields like { ISO2_CODE: 'LK' }, { 'CURRENCY.CODE': 'USD' } */
export declare function findCountryFlexible(
  query?: CountryFlexibleQuery
): CountryType[];

/** Get flag emoji for ISO2 code */
export declare function getFlagEmoji(iso2: string): string;

/** Validate if a string is a valid ISO2/ISO3 code */
export declare function isValidCountryCode(code: string): boolean;

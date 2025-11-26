'use strict';

const CountryJSON = require('./data/Country.json');
const CountryArray = Object.values(CountryJSON);

// Require Fuse.js for fuzzy search
const Fuse = require('fuse.js');

/** Utility: Normalize a string for search (case-insensitive, trim) */
function normalize(str) {
  return typeof str === 'string' ? str.trim().toLowerCase() : '';
}

/** --- BASIC COUNTRY LOOKUPS --- **/

const Country = {
  JSON: () => CountryJSON,
  Array: () => CountryArray,

  /** Find by any country name (partial, case-insensitive, any language) */
  findCountry: (name) => {
    if (!name) return null;
    const nName = normalize(name);
    return CountryArray.find(country =>
      Object.values(country.LIST_OF_NAME)
        .flat()
        .some(n => normalize(n).includes(nName))
    );
  },

  /** Find by ISO2 or ISO3 code */
  findByCode: (code) => {
    if (!code) return null;
    const nCode = code.trim().toUpperCase();
    return CountryArray.find(
      c => c.ISO2_CODE === nCode || c.ISO3_CODE === nCode
    );
  },

  /** Find ISO2 code from any name */
  findISO2Code: (name) => {
    const c = Country.findCountry(name);
    return c ? c.ISO2_CODE : null;
  },

  /** Find ISO3 code from any name */
  findISO3Code: (name) => {
    const c = Country.findCountry(name);
    return c ? c.ISO3_CODE : null;
  },

  /** Get all names of a country (all languages) by ISO2/ISO3 code */
  getAllNames: (code) => {
    const country = Country.findByCode(code);
    if (!country) return [];
    return Object.values(country.LIST_OF_NAME).flat();
  },

  /** List all countries' names in a specific language (default ENG) */
  filterByLanguage: (lang = 'ENG') => {
    return CountryArray.map(country => ({
      code: country.ISO2_CODE,
      name: country.LIST_OF_NAME[lang] || country.LIST_OF_NAME['ENG'] || []
    }));
  },

  /** Find by capital city */
  findByCapital: (capital) => {
    if (!capital) return null;
    const nCapital = normalize(capital);
    return CountryArray.find(c => c.CAPITAL && normalize(c.CAPITAL) === nCapital);
  },

  /** Find countries by spoken language */
  findByLanguage: (language) => {
    if (!language) return [];
    const nLang = normalize(language);
    return CountryArray.filter(c => 
      (c.LANGUAGES || []).some(l => normalize(l) === nLang)
    );
  },

  /** Find countries by timezone */
  findByTimezone: (timezone) => {
    if (!timezone) return [];
    // simple exact match or partial match could be discussed, but exact match on the string in array is safest for now
    // or we can normalize. Timezones in data are like "UTC+05:30"
    return CountryArray.filter(c => 
      (c.TIMEZONES || []).includes(timezone)
    );
  },

  /** Get neighbors (bordering countries) */
  getNeighbors: (code) => {
    const country = Country.findByCode(code);
    if (!country || !country.BORDERS) return [];
    return country.BORDERS.map(borderCode => Country.findByCode(borderCode)).filter(Boolean);
  },

  /** Get demonym */
  getDemonym: (code) => {
    const country = Country.findByCode(code);
    return country ? country.DEMONYM : null;
  },

  /** Get area */
  getArea: (code) => {
    const country = Country.findByCode(code);
    return country ? country.AREA : null;
  },

  /** Get population */
  getPopulation: (code) => {
    const country = Country.findByCode(code);
    return country ? country.POPULATION : null;
  }
};

/** --- ADVANCED SEARCH FEATURES --- **/

// Cache Fuse instance
let fuseInstance = null;

/** Fuzzy country name search (requires fuse.js) */
function fuzzyFindCountry(name) {
  if (!name) return null;

  if (!fuseInstance) {
    // Prepare flat name list
    const countryNames = CountryArray.flatMap(c =>
      Object.entries(c.LIST_OF_NAME).flatMap(([lang, names]) =>
        names.map(n => ({
          name: n,
          lang,
          ISO2: c.ISO2_CODE,
          ISO3: c.ISO3_CODE
        }))
      )
    );
    fuseInstance = new Fuse(countryNames, { keys: ['name'], threshold: 0.3 });
  }

  const result = fuseInstance.search(name);
  if (!result.length) return null;
  // Return country object by ISO2 or ISO3 code
  return Country.findByCode(result[0].item.ISO2 || result[0].item.ISO3);
}

/** Find all countries using a currency (by code or name) */
function findCountriesByCurrency(input) {
  const nInput = normalize(input);
  return CountryArray.filter(c =>
    (c.CURRENCY || []).some(cur =>
      (cur.CODE || []).some(code => normalize(code) === nInput) ||
      (cur.NAME || []).some(name => normalize(name).includes(nInput))
    )
  );
}

/** Find by region/continent (requires REGION field in data) */
function findByRegion(region) {
  const nRegion = normalize(region);
  return CountryArray.filter(c =>
    c.REGION && normalize(c.REGION) === nRegion
  );
}

/** Find by phone code (requires PHONE_CODE field in data) */
function findByPhoneCode(phone) {
  if (!phone) return [];
  const nPhone = phone.replace(/^\+/, '');
  return CountryArray.filter(c =>
    Array.isArray(c.PHONE_CODE)
      ? c.PHONE_CODE.map(String).includes(nPhone)
      : String(c.PHONE_CODE) === nPhone
  );
}

/** Get country name in any language (first variant) */
function getCountryNameInLanguage(code, lang = 'ENG') {
  const country = Country.findByCode(code);
  if (!country) return null;
  return (country.LIST_OF_NAME[lang] || [])[0] || null;
}

/** Autocomplete: find all countries whose names start with input (in a language) */
function autocompleteCountry(partial, lang = 'ENG') {
  if (!partial) return [];
  const nPartial = normalize(partial);
  return CountryArray.filter(c =>
    (c.LIST_OF_NAME[lang] || []).some(
      name => normalize(name).startsWith(nPartial)
    )
  );
}

/** Generic flexible search: query by fields like { ISO2_CODE: 'LK' }, { 'CURRENCY.CODE': 'USD' } */
function findCountryFlexible(query = {}) {
  return CountryArray.filter(country => {
    return Object.entries(query).every(([key, value]) => {
      if (key.startsWith('CURRENCY.')) {
        const subKey = key.split('.')[1];
        return (country.CURRENCY || []).some(cur =>
          (cur[subKey] || []).includes(value)
        );
      }
      if (country[key]) return country[key] === value;
      return false;
    });
  });
}

/** Get flag emoji for ISO2 code */
function getFlagEmoji(iso2) {
  if (!iso2 || typeof iso2 !== 'string' || iso2.length !== 2) return '';
  return iso2
    .toUpperCase()
    .replace(/./g, c => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65));
}

/** Validate if a string is a valid ISO2/ISO3 code */
function isValidCountryCode(code) {
  return !!Country.findByCode(code);
}

/** Export all APIs */
module.exports = {
  ...Country,
  fuzzyFindCountry,
  findCountriesByCurrency,
  findByRegion,
  findByPhoneCode,
  getCountryNameInLanguage,
  autocompleteCountry,
  findCountryFlexible,
  getFlagEmoji,
  isValidCountryCode,
};

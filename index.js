'use strict';

const CountryJSON = require('./data/Country.json');
const CountryArray = Object.values(CountryJSON);

function normalize(str) {
  return typeof str === 'string' ? str.trim().toLowerCase() : '';
}

const Country = {
  JSON: () => CountryJSON,
  Array: () => CountryArray,

  /** Find country by any name (partial/case-insensitive, any language) */
  findCountry: (name) => {
    if (!name) return null;
    const nName = normalize(name);

    return CountryArray.find(country =>
      Object.values(country.LIST_OF_NAME)
        .flat()
        .some(n => normalize(n).includes(nName))
    );
  },

  /** Find country by ISO2 or ISO3 code */
  findByCode: (code) => {
    if (!code) return null;
    const nCode = code.trim().toUpperCase();
    return CountryArray.find(
      c =>
        c.ISO2_CODE === nCode ||
        c.ISO3_CODE === nCode
    );
  },

  /** Find country by currency code (e.g., "USD") */
  findByCurrencyCode: (currencyCode) => {
    if (!currencyCode) return null;
    const nCode = currencyCode.trim().toUpperCase();
    return CountryArray.filter(country =>
      (country.CURRENCY || []).some(cur =>
        (cur.CODE || []).some(c => c === nCode)
      )
    );
  },

  /** Get all available names for a country (by ISO2/ISO3 code) */
  getAllNames: (code) => {
    const country = Country.findByCode(code);
    if (!country) return [];
    return Object.values(country.LIST_OF_NAME).flat();
  },

  /** Find ISO2 code from any country name */
  findISO2Code: (name) => {
    const c = Country.findCountry(name);
    return c ? c.ISO2_CODE : null;
  },

  /** Find ISO3 code from any country name */
  findISO3Code: (name) => {
    const c = Country.findCountry(name);
    return c ? c.ISO3_CODE : null;
  },

  /** List all country objects for a given language (e.g., Dutch) */
  filterByLanguage: (lang = "ENG") => {
    return CountryArray.map(country => ({
      code: country.ISO2_CODE,
      name: country.LIST_OF_NAME[lang] || country.LIST_OF_NAME["ENG"]
    }));
  }
};

module.exports = Country;

// test/index.spec.ts

import {
  Country,
  CountryType,
  findByRegion,
  getFlagEmoji,
  isValidCountryCode,
  fuzzyFindCountry,
  findCountriesByCurrency,
  autocompleteCountry,
} from '../index';

const c1: CountryType | undefined = Country.findByCode('LK');
if (c1) {
  // Type checks: should not error if types are correct
  const names: string[] = Country.getAllNames('LK');
  const code: string | null = Country.findISO2Code('Sri Lanka');
  const region = c1.REGION;
}

// Fuzzy search test
const fuzzy = fuzzyFindCountry('Lanka');
if (fuzzy) {
  const iso2: string = fuzzy.ISO2_CODE;
}

// Currency
const usdCountries: CountryType[] = findCountriesByCurrency('USD');

// Autocomplete
const autoCountries: CountryType[] = autocompleteCountry('united', 'ENG');

// Emoji
const flag: string = getFlagEmoji('LK');

// Valid code
const valid: boolean = isValidCountryCode('LK');

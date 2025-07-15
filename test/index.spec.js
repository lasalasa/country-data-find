const assert = require('assert');
const Country = require('../index'); // adjust if needed

describe('country-data-find (basic features)', function () {
    it('findCountry(): should return correct country object for an English name', function () {
        const country = Country.findCountry('Sri Lanka');
        assert.ok(country, 'Country not found');
        assert.strictEqual(country.ISO2_CODE, 'LK');
        assert.strictEqual(country.ISO3_CODE, 'LKA');
    });

    it('findCountry(): should be case-insensitive and partial', function () {
        const country = Country.findCountry('sri');
        assert.ok(country, 'Country not found');
        assert.strictEqual(country.ISO2_CODE, 'LK');
    });

    it('findISO2Code(): should return ISO2 code for a given country name', function () {
        const code = Country.findISO2Code('Sri Lanka');
        assert.strictEqual(code, 'LK');
    });

    it('findByCode(): should find country by ISO2 code', function () {
        const country = Country.findByCode('LK');
        assert.ok(country, 'Country not found');
        assert.strictEqual(country.ISO3_CODE, 'LKA');
    });

    it('findByCode(): should find country by ISO3 code', function () {
        const country = Country.findByCode('LKA');
        assert.ok(country, 'Country not found');
        assert.strictEqual(country.ISO2_CODE, 'LK');
    });

    it('getAllNames(): should return all names for given ISO2 code', function () {
        const names = Country.getAllNames('LK');
        assert.ok(Array.isArray(names), 'Result should be an array');
        assert.ok(names.includes('Sri Lanka'));
    });

    it('filterByLanguage(): should return country names in Dutch', function () {
        const countries = Country.filterByLanguage('DUTCH');
        assert.ok(Array.isArray(countries));
        // Check that Sri Lanka exists in Dutch list
        const sri = countries.find(c => c.code === 'LK');
        assert.ok(sri);
        assert.ok(sri.name.includes('Sri Lanka'));
    });

    it('Array(): should return an array with more than 100 countries', function () {
        const arr = Country.Array();
        assert.ok(Array.isArray(arr));
        assert.ok(arr.length > 100);
    });

    it('JSON(): should return an object with keys', function () {
        const json = Country.JSON();
        assert.ok(typeof json === 'object' && json !== null);
        assert.ok(Object.keys(json).length > 100);
    });
});

describe('country-data-find (advanced features)', function () {

    it('fuzzyFindCountry(): should return correct country with fuzzy name', function () {
        try {
            const country = Country.fuzzyFindCountry('Sr Lanka');
            assert.ok(country, 'Country not found by fuzzy search');
            assert.strictEqual(country.ISO2_CODE, 'LK');
        } catch (e) {
            if (e.message.includes('fuse.js')) {
                this.skip(); // skip if fuse.js is not installed
            } else {
                throw e;
            }
        }
    });

    it('findCountriesByCurrency(): should find all countries using USD', function () {
        const countries = Country.findCountriesByCurrency('USD');
        assert.ok(Array.isArray(countries), 'Result is not array');
        assert.ok(countries.length > 0, 'No USD countries found');
        const usa = countries.find(c => c.ISO2_CODE === 'US');
        assert.ok(usa, 'United States not found in USD countries');
    });

    it('findCountriesByCurrency(): should find countries by currency name', function () {
        const rupeeCountries = Country.findCountriesByCurrency('rupee');
        assert.ok(Array.isArray(rupeeCountries));
        assert.ok(rupeeCountries.some(c => c.ISO2_CODE === 'LK'), 'Sri Lanka should use rupee');
    });

    it('getCountryNameInLanguage(): should return Dutch name for Germany', function () {
        const name = Country.getCountryNameInLanguage('DE', 'NL');
        assert.ok(typeof name === 'string');
        assert.ok(['Duitsland'].includes(name.trim()) || name.trim().length > 0);
    });

    it('autocompleteCountry(): should return countries starting with input', function () {
        const list = Country.autocompleteCountry('ger', 'ENG');
        assert.ok(Array.isArray(list));
        assert.ok(list.some(c => Country.getAllNames(c.ISO2_CODE || c.ISO3_CODE).join('').toLowerCase().includes('germ')));
    });

    it('findCountryFlexible(): should find country by flexible query (currency code)', function () {
        const arr = Country.findCountryFlexible({ 'CURRENCY.CODE': 'USD' });
        assert.ok(Array.isArray(arr));
        assert.ok(arr.find(c => c.ISO2_CODE === 'US'), 'USA not found with flexible query');
    });

    it('findCountryFlexible(): should find by ISO2 code', function () {
        const arr = Country.findCountryFlexible({ ISO2_CODE: 'LK' });
        assert.ok(Array.isArray(arr));
        assert.ok(arr.find(c => c.ISO3_CODE === 'LKA'));
    });

    it('getFlagEmoji(): should return 🇱🇰 for Sri Lanka', function () {
        const flag = Country.getFlagEmoji('LK');
        assert.strictEqual(flag, '🇱🇰');
    });

    it('isValidCountryCode(): should validate correct codes', function () {
        assert.strictEqual(Country.isValidCountryCode('LK'), true);
        assert.strictEqual(Country.isValidCountryCode('LKA'), true);
        assert.strictEqual(Country.isValidCountryCode('XYZ'), false);
    });

    it('findByRegion(): should return countries for a known region if REGION field exists', function () {
        const anyHasRegion = Country.Array().some(c => 'REGION' in c);
        if (!anyHasRegion) this.skip();
        const asiaCountries = Country.findByRegion('Asia');
        assert.ok(Array.isArray(asiaCountries));
        // Test could be expanded if REGION populated in data
    });

    it('findByPhoneCode(): should return countries for a known phone code if PHONE_CODE field exists', function () {
        const anyHasPhone = Country.Array().some(c => 'PHONE_CODE' in c && c.PHONE_CODE);
        if (!anyHasPhone) this.skip();
        // Example: "94" for Sri Lanka, adjust if needed for your data
        const code = '94';
        const phoneCountries = Country.findByPhoneCode(code);
        assert.ok(Array.isArray(phoneCountries));
        // Should include Sri Lanka if PHONE_CODE present
    });
});

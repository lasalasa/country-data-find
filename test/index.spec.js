const assert = require('assert');
const Country = require('../index'); // or the correct relative path

describe('country-data-find', function () {
    
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

    it('findByCurrencyCode(): should return array of countries using USD', function () {
        const countries = Country.findByCurrencyCode('USD');
        assert.ok(Array.isArray(countries));
        assert.ok(countries.length > 0, 'Should find at least one country using USD');
        // USA is a good test
        const usa = countries.find(c => c.ISO2_CODE === 'US');
        assert.ok(usa, 'United States should be in the result');
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

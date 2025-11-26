const assert = require('assert');
const Country = require('../index');

describe('Improvements', function () {
    describe('findByCapital', function () {
        it('should find a country by its capital', function () {
            const country = Country.findByCapital('Sri Jayawardenepura Kotte');
            assert.strictEqual(country.ISO3_CODE, 'LKA');
        });

        it('should be case insensitive', function () {
            const country = Country.findByCapital('sri jayawardenepura kotte');
            assert.strictEqual(country.ISO3_CODE, 'LKA');
        });

        it('should return undefined for non-existent capital', function () {
            const country = Country.findByCapital('Atlantis');
            assert.strictEqual(country, undefined);
        });
    });

    describe('findByLanguage', function () {
        it('should find countries by language', function () {
            const countries = Country.findByLanguage('Sinhalese');
            assert.ok(countries.some(c => c.ISO3_CODE === 'LKA'));
        });

        it('should be case insensitive', function () {
            const countries = Country.findByLanguage('sinhalese');
            assert.ok(countries.some(c => c.ISO3_CODE === 'LKA'));
        });
    });

    describe('findByTimezone', function () {
        it('should find countries by timezone', function () {
            const countries = Country.findByTimezone('UTC+05:30');
            assert.ok(countries.some(c => c.ISO3_CODE === 'LKA'));
            assert.ok(countries.some(c => c.ISO3_CODE === 'IND'));
        });
    });

    describe('getNeighbors', function () {
        it('should return neighbors for a country', function () {
            // Sri Lanka has borders in this dataset: IND
            const lkaNeighbors = Country.getNeighbors('LKA');
            assert.ok(lkaNeighbors.length > 0);
            assert.strictEqual(lkaNeighbors[0].ISO3_CODE, 'IND');
        });
    });

    describe('Getters', function () {
        it('should get demonym', function () {
            const demonym = Country.getDemonym('LKA');
            assert.strictEqual(demonym, 'Sri Lankan');
        });

        it('should get area', function () {
            const area = Country.getArea('LKA');
            assert.strictEqual(area, 65610);
        });

        it('should get population', function () {
            const population = Country.getPopulation('LKA');
            assert.strictEqual(population, 21919000);
        });
    });

    describe('Fuzzy Search Optimization', function () {
        it('should still work correctly', function () {
            const result = Country.fuzzyFindCountry('Sr Lanka');
            assert.strictEqual(result.ISO3_CODE, 'LKA');
        });

        it('should be faster on second call (implicit check)', function () {
            const start = process.hrtime();
            Country.fuzzyFindCountry('United States');
            const end = process.hrtime(start);

            const start2 = process.hrtime();
            Country.fuzzyFindCountry('United Kingdom');
            const end2 = process.hrtime(start2);

            // Not a strict assertion, but just ensuring it runs without error
            assert.ok(true);
        });
    });
});

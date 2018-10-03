'use strict';

const CountryJSON = require('./data/Country.json');

const CountryArray = Object.values(CountryJSON);

const Country = {

    JSON : () => {
        return CountryJSON;
    },

    Array : () => {
        return CountryArray;
    },

    findCountry: (filterValue, filterLanguage="ENG") => {
        
        let rc = CountryArray.find( c => {
            
            let nameList = c.LIST_OF_NAME[filterLanguage];

            let name = nameList.find( name => { return name === filterValue });

            if(name) return c;
            
        });

        return rc;
    },

    findISO2Code : (filterValue, filterLanguage="ENG") => {
        
        let rc = Country.findCountry(filterValue, filterLanguage);

        return rc ? rc.ISO2_CODE : null;
    }
}

module.exports = Country;
// ==UserScript==
// @name         TNT Collection Dev
// @version      1.0.0
// @namespace    tnt.collection.dev
// @author       Ronny Jespersen
// @description  TNT Collection Development - Simplified architecture
// @license      MIT
// @include      http*s*.ikariam.*/*
// @exclude      http*support*.ikariam.*/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// ==/UserScript==

// Now we can use the exact same structure as core!
const tnt = {
    version: "1.0.0-dev",

    // Same settings structure as core (with dev prefix for storage)
    settings: {
        get(key, defaultValue = null) {
            return GM_getValue('dev_' + key, defaultValue);
        },
        set(key, value) {
            GM_setValue('dev_' + key, value);
        }
    },

    // Copy core's get functions exactly (no more duplicated code!)
    get: {
        cityId() {
            const urlParams = new URLSearchParams(window.location.search);
            let cityId = urlParams.get('cityId');
            
            if (!cityId) {
                const cities = Object.keys(this.cityList());
                cityId = cities.length > 0 ? cities[0] : null;
            }
            
            return cityId;
        },

        cityList() {
            const cities = {};
            $('#dropDown_js_citySelectContainer li[selectValue]').each(function() {
                const $this = $(this);
                const cityId = $this.attr('selectValue');
                const cityName = $this.text().trim();
                cities[cityId] = cityName;
            });
            return cities;
        }
    },

    // New experimental features can be added here
    experimentalFeature: {
        init() {
            console.log('[TNT-Dev] Experimental feature ready');
        }
    }
};

$(document).ready(() => {
    if (typeof ikariam === 'undefined') {
        console.log('[TNT-Dev] Not in Ikariam, skipping');
        return;
    }

    console.log('[TNT-Dev] Simplified architecture initialized');
    tnt.experimentalFeature.init();
});

// ==UserScript==
// @name         TNT Collection Dev
// @version      1.0.0
// @namespace    tnt.collection.dev
// @author       Ronny Jespersen
// @description  TNT Collection Development - Clean slate for new features
// @license      MIT
// @include      http*s*.ikariam.*/*
// @exclude      http*support*.ikariam.*/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// ==/UserScript==

// ===== AI-NOTICE: IMPORTANT FOR AI TOOLS - HUMAN SUPERVISION REQUIRED FOR THIS SECTION =====
// This is an extension of the TNT Collection core script (tnt.collection.core.user.js).
// It provides a simplified architecture for development purposes.
// The script initializes a simplified version of the TNT Collection with a focus on development features.
// It includes a settings object for managing user settings, a get object for retrieving city information,
// and an experimental feature section for testing new functionalities.
// Things to be aware of:
// - The settings object uses GM_getValue and GM_setValue with a 'dev_' prefix to avoid conflicts with the core script.
// - The get object provides methods to retrieve the current city ID and list of cities.
// !!! It is important to keep both tnt.settings and tnt.get in sync with the core script.
// =============================================================

// Clean slate - ready for next development project
const tnt = {
    version: "1.0.0-dev",

    settings: {
        get(key, defaultValue = null) {
            return GM_getValue('dev_' + key, defaultValue);
        },
        set(key, value) {
            GM_setValue('dev_' + key, value);
        }
    },

    // Ready for new features to be added here
    init() {
        console.log('[TNT-Dev] Initializing TNT Collection Development Environment');
        console.log('[TNT-Dev] Ready for development - add features here');
    }
};

$(document).ready(() => {
    if (typeof ikariam === 'undefined') {
        console.log('[TNT-Dev] Not in Ikariam, skipping');
        return;
    }

    console.log('[TNT-Dev] Simplified architecture initialized');
    tnt.init();
});
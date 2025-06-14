// ==UserScript==
// @name         TNT Collection Dev
// @version      1.0.2
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
    experimental: {
        // Next development project will go here

        // Placeholder for future features
        placeholder() {
            console.log('[TNT-Dev] Ready for next development project');
        },

        // Test Ikariam's tooltip system
        testTooltip() {
            console.log('[TNT-Dev] Testing Ikariam tooltip system...');

            // Check if Ikariam's tooltip controller exists
            if (typeof ikariam !== 'undefined' && ikariam.controller && ikariam.controller.tooltipController) {
                console.log('[TNT-Dev] Found ikariam.controller.tooltipController');
                console.log('[TNT-Dev] bindBubbleTip method:', typeof ikariam.controller.tooltipController.bindBubbleTip);

                // Find a test element (like first resource cell)
                const $testElement = $('.tnt_wood, .tnt_wine, .tnt_marble, .tnt_crystal, .tnt_sulfur').first();
                if ($testElement.length > 0) {
                    console.log('[TNT-Dev] Found test element:', $testElement[0]);

                    // Add a simple test tooltip using Ikariam's system
                    $testElement.off('mouseenter.tnt-tooltip-test').on('mouseenter.tnt-tooltip-test', function (event) {
                        try {
                            // Test Ikariam's bindBubbleTip function
                            // bindBubbleTip(offsetX, offsetY, content, event, element, isMinSize)
                            ikariam.controller.tooltipController.bindBubbleTip(
                                6,    // offsetX
                                13,   // offsetY
                                '<div style="color: white;">🧪 TNT Test Tooltip<br>This is using Ikariam\'s native tooltip system!</div>', // content
                                event, // mouse event
                                this,  // element
                                false  // isMinSize
                            );
                            console.log('[TNT-Dev] Successfully called bindBubbleTip!');
                        } catch (e) {
                            console.log('[TNT-Dev] Error calling bindBubbleTip:', e.message);
                        }
                    });

                    console.log('[TNT-Dev] Test tooltip added to first resource cell. Hover over it to test!');
                } else {
                    console.log('[TNT-Dev] No test elements found (resource cells)');
                }
            } else {
                console.log('[TNT-Dev] Ikariam tooltip controller not found');
            }
        },

    },

    init() {
        console.log('[TNT-Dev] Initializing TNT Collection Development Environment');
        console.log('[TNT-Dev] Version:', tntDev.version);
        console.log('[TNT-Dev] Core TNT Version:', typeof tnt !== 'undefined' ? tnt.version : 'Not loaded');

        // Initialize development tools
        tntDev.devTools.init();

        console.log('[TNT-Dev] Test functions available:');
        console.log('[TNT-Dev] - tntTestCityId() - Test city ID detection');
        console.log('[TNT-Dev] - tntTestConstruction() - Test construction detection');
        console.log('[TNT-Dev] - tntTestHighlight() - Test highlighting');
        console.log('[TNT-Dev] - tntTestTooltip() - Test Ikariam\'s tooltip system');
    }
};

// Extend the existing tnt object with development features
// Wait for tnt to be available, then add dev features
$(document).ready(() => {
    // Wait a bit for the core script to initialize
    setTimeout(() => {
        if (typeof tnt !== 'undefined') {
            console.log('[TNT-Dev] Extending TNT Collection with development features');

            // Add development tests to the existing tnt object
            tnt.dev = {
                version: GM_info.script.version,

                tests: {
                    cityId() {
                        console.log('[TNT-Dev] Testing city ID detection...');
                        console.log('[TNT-Dev] Current city ID:', tnt.get.cityId());
                        console.log('[TNT-Dev] URL params:', new URLSearchParams(window.location.search).get('cityId'));
                        console.log('[TNT-Dev] Ikariam model:', typeof ikariam !== 'undefined' ? ikariam.model?.relatedCityData?.selectedCity : 'Not available');
                    },

                    construction() {
                        console.log('[TNT-Dev] Testing construction detection...');
                        const constructionSites = $('.constructionSite');
                        console.log('[TNT-Dev] Construction sites found:', constructionSites.length);
                        if (constructionSites.length > 0) {
                            constructionSites.each(function (i) {
                                if (i < 3) { // Show first 3
                                    console.log(`[TNT-Dev] Construction ${i + 1}:`, this);
                                }
                            });
                        }
                    },

                    highlight() {
                        console.log('[TNT-Dev] Testing highlighting...');
                        $('.tnt_construction').css({
                            'background-color': '#ff000050 !important',
                            'border': '2px solid #ff0000 !important'
                        });
                        console.log('[TNT-Dev] Highlighted', $('.tnt_construction').length, 'construction elements');
                    },

                    // Test Ikariam's tooltip system
                    tooltip() {
                        console.log('[TNT-Dev] Testing Ikariam tooltip system...');

                        // Check if Ikariam's tooltip controller exists
                        if (typeof ikariam !== 'undefined' && ikariam.controller && ikariam.controller.tooltipController) {
                            console.log('[TNT-Dev] ✅ Found ikariam.controller.tooltipController');
                            console.log('[TNT-Dev] bindBubbleTip method:', typeof ikariam.controller.tooltipController.bindBubbleTip);

                            // Find a test element (like first resource cell)
                            const $testElement = $('.tnt_wood, .tnt_wine, .tnt_marble, .tnt_crystal, .tnt_sulfur').first();
                            if ($testElement.length > 0) {
                                console.log('[TNT-Dev] ✅ Found test element:', $testElement[0]);

                                // Add a simple test tooltip using Ikariam's system
                                $testElement.off('mouseenter.tnt-tooltip-test').on('mouseenter.tnt-tooltip-test', function (event) {
                                    try {
                                        // Test Ikariam's bindBubbleTip function
                                        // bindBubbleTip(offsetX, offsetY, content, event, element, isMinSize)
                                        ikariam.controller.tooltipController.bindBubbleTip(
                                            6,    // offsetX
                                            13,   // offsetY
                                            '<div style="color: white; padding: 5px;">🧪 <strong>TNT Test Tooltip</strong><br>This is using Ikariam\'s native tooltip system!<br><small>Hover away to hide</small></div>', // content
                                            event, // mouse event
                                            this,  // element
                                            false  // isMinSize
                                        );
                                        console.log('[TNT-Dev] ✅ Successfully called bindBubbleTip!');
                                    } catch (e) {
                                        console.log('[TNT-Dev] ❌ Error calling bindBubbleTip:', e.message);
                                    }
                                });

                                console.log('[TNT-Dev] ✅ Test tooltip added to first resource cell. Hover over it to test!');
                                return true;
                            } else {
                                console.log('[TNT-Dev] ❌ No test elements found (resource cells)');
                                return false;
                            }
                        } else {
                            console.log('[TNT-Dev] ❌ Ikariam tooltip controller not found');

                            // Log what we can find
                            console.log('[TNT-Dev] Available objects:');
                            console.log('[TNT-Dev] - ikariam:', typeof ikariam);
                            if (typeof ikariam !== 'undefined') {
                                console.log('[TNT-Dev] - ikariam.controller:', typeof ikariam.controller);
                                if (ikariam.controller) {
                                    console.log('[TNT-Dev] - available controllers:', Object.keys(ikariam.controller));
                                }
                            }
                            return false;
                        }
                    }
                },

                init() {
                    console.log('[TNT-Dev] Initializing TNT Collection Development Environment');
                    console.log('[TNT-Dev] Dev Version:', tnt.dev.version);
                    console.log('[TNT-Dev] Core TNT Version:', tnt.version);

                    console.log('[TNT-Dev] Test functions available:');
                    console.log('[TNT-Dev] - tntTestCityId() - Test city ID detection');
                    console.log('[TNT-Dev] - tntTestConstruction() - Test construction detection');
                    console.log('[TNT-Dev] - tntTestHighlight() - Test highlighting');
                    console.log('[TNT-Dev] - tntTestTooltip() - Test Ikariam\'s tooltip system');
                }
            };

            // Initialize dev features
            tnt.dev.init();

            // Make test functions globally accessible from console
            // IMPORTANT: These functions are attached to window so they can be called from browser console
            window.tntTestCityId = () => tnt.dev.tests.cityId();
            window.tntTestConstruction = () => tnt.dev.tests.construction();
            window.tntTestHighlight = () => tnt.dev.tests.highlight();
            window.tntTestTooltip = () => tnt.dev.tests.tooltip();

            console.log('[TNT-Dev] ✅ Development environment initialized');
        } else {
            console.log('[TNT-Dev] ❌ Core TNT object not found - Dev features disabled');
        }
    }, 1000); // Wait 1 second for core to load
});

// Global test functions for console access
window.tntTestCityId = () => tntDev.tests.cityId();
window.tntTestConstruction = () => tntDev.tests.construction();
window.tntTestHighlight = () => tntDev.tests.highlight();
window.tntTestTooltip = () => tntDev.tests.testTooltip();
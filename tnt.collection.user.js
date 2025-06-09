// ==UserScript==
// @name         TNT Collection
// @version      1.5.2
// @namespace    tnt.collection
// @author       Ronny Jespersen
// @description  TNT Collection of Ikariam enhancements to enhance the game
// @license      MIT
// @include      http*s*.ikariam.*/*
// @exclude      http*support*.ikariam.*/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @downloadURL  https://github.com/TheNorthman/ikariam.user.js/raw/refs/heads/main/tnt.collection.user.js
// @updateURL    https://github.com/TheNorthman/ikariam.user.js/raw/refs/heads/main/tnt.collection.user.js
// ==/UserScript==

const VERSION_URL = "http://ikariam.rjj-net.dk/scripts/tnt.Collection/version.php";
const UPDATE_URL = "http://ikariam.rjj-net.dk/scripts/tnt.Collection/update.php";
const UPDATE_HQ_URL = "http://lazy.rjj-net.dk/tnt/ikariam/hq/update";
let tnt_autoUpdateInterval = null;

const validBuildingTypes = [
    'townHall', 'palace', 'palaceColony', 'warehouse', 'wall', 'barracks',
    'shipyard', 'port', 'academy', 'museum', 'temple', 'embassy', 'branchOffice',
    'workshop', 'safehouse', 'carpentering', 'architect', 'vineyard', 'optician',
    'fireworker', 'forester', 'stonemason', 'winegrower', 'glassblowing', 'alchemist',
    'dump', 'tavern', 'blackMarket', 'pirateFortress', 'marineChartArchive',
    'dockyard', 'shrineOfOlympus', 'chronosForge'
];

const tnt = {
    version: GM_info.script.version,
    url: { versionUrl: VERSION_URL, updateUrl: UPDATE_URL, update: UPDATE_HQ_URL },
    console: { log: console.log, dir: console.dir },
    settings: {
        dev: true,
        debug: { enable: true, level: 5, timer: { enable: true } }
    },
    data: {
        test: {},
        ikariam: {
            subDomain: location.hostname.split('.')[0],
            url: {
                notification: (() => {
                    const sub = location.hostname.split('.')[0];
                    const base = `https://${sub}.ikariam.gameforge.com/cdn/all/both/layout/advisors/`;
                    return {
                        defaultPicture: base + "mayor_premium.png",
                        mayor: base + "mayor.png",
                        mayor_premium: base + "mayor_premium.png",
                        general: base + "general.png",
                        general_premium: base + "general_premium.png",
                        general_alert: base + "general_premium_alert.png",
                        scientist: base + "scientist.png",
                        scientist_premium: base + "scientist_premium.png",
                        diplomat: base + "diplomat.png",
                        diplomat_premium: base + "diplomat_premium.png"
                    };
                })()
            }
        },
        storage: {
            notification: {
                cities: false,
                military: false,
                militaryAlert: false,
                scientist: false,
                diplomat: false
            },
            ambrosia: 0,
            gold: 0,
            resources: {
                city: {}, // Each city will now have: buildings, military: {units, ships, movements}
            }
        }
    },
    core: {
        waitForElements: function (selector, callback, timeout = 10000) {
            const startTime = Date.now();
            let waitForLoad = true;

            const checkElements = () => {
                // First wait for #locations to appear
                const $locations = $('#locations');
                if (!$locations.length) {
                    if (Date.now() - startTime > timeout) {
                        tnt.core.debug.log(`Timeout waiting for #locations`, 1);
                        callback(null);
                        return;
                    }
                    setTimeout(checkElements, 200);
                    return;
                }

                // Then wait for loading to complete
                if (waitForLoad && $locations.hasClass('loading')) {
                    if (Date.now() - startTime > timeout) {
                        tnt.core.debug.log(`Timeout waiting for #locations loading to complete`, 1);
                        callback(null);
                        return;
                    }
                    setTimeout(checkElements, 200);
                    return;
                }
                waitForLoad = false;

                // Finally check for the actual elements
                const elements = $(selector);
                if (elements.length > 0) {
                    // Add extra delay for elements to finish rendering
                    setTimeout(() => callback(elements), 500);
                    return;
                }

                if (Date.now() - startTime > timeout) {
                    tnt.core.debug.log(`Timeout waiting for elements: ${selector}`, 1);
                    // Try one last time with js_CityPosition* selector
                    const positions = $('div[id^="js_CityPosition"]');
                    if (positions.length > 0) {
                        setTimeout(() => callback(positions), 500);
                    } else {
                        callback(null);
                    }
                    return;
                }

                setTimeout(checkElements, 200);
            };

            checkElements();
        },

        init() {
            tnt.core.debug.log(`TNT Collection v${tnt.version} - Init...`);

            // Add debug flag to track reloads
            window.TNT_RELOAD_DEBUG = true;
            window.TNT_LAST_RELOAD = Date.now();
            tnt.core.debug.log('Init called at: ' + new Date().toISOString());

            // Check if we're in a reload loop
            const lastReload = parseInt(localStorage.getItem('tnt_debug_last_reload') || '0');
            const now = Date.now();
            if (now - lastReload < 5000) {
                tnt.core.debug.log('WARNING: Rapid reloads detected!');
                // Clear any pending update state
                localStorage.removeItem('tnt_city_update_list');
                localStorage.removeItem('tnt_city_update_index');
                localStorage.removeItem('tnt_city_update_start');
                localStorage.removeItem('tnt_city_update_lastReload');
                // Exit early
                return;
            }
            localStorage.setItem('tnt_debug_last_reload', now.toString());

            // Wait for page load before continuing initialization
            tnt.core.waitForElements('#locations', ($locations) => {
                if (!$locations) {
                    tnt.core.debug.log('Failed to find #locations element', 1);
                    return;
                }

                // Continue with rest of init after locations are loaded
                tnt.core.storage.init();
                tnt.resource.update();
                tnt.core.notification.init();
                tnt.core.events.init();
                tnt.core.options.init();
                tnt.all();

                switch ($("body").attr("id")) {
                    case "island": tnt.island(); break;
                    case "city": tnt.city(); break;
                    case "worldmap_iso": tnt.world(); break;
                }

                // Only continue updates if explicitly requested
                const forceUpdate = localStorage.getItem('tnt_force_update');
                if (forceUpdate) {
                    localStorage.removeItem('tnt_force_update');
                    if (localStorage.getItem('tnt_city_update_list')) {
                        setTimeout(() => tnt.citySwitcher.gotoNextCityForUpdate(), 1000);
                    }
                }

                // Remove existing interval if any
                if (tnt_autoUpdateInterval) {
                    clearInterval(tnt_autoUpdateInterval);
                    tnt_autoUpdateInterval = null;
                }

                // Only start auto-update interval if enabled in options
                if (GM_getValue("cityAutoUpdate", false)) {
                    tnt_autoUpdateInterval = setInterval(() => tnt.citySwitcher.updateAllCitiesResources(), 3600000);
                }
            });
        },
        ajax: {
            send(data, url = tnt.url.update, callback = null) {
                tnt.core.debug.log('Data length: ' + JSON.stringify(data).length, 3);
                GM_xmlhttpRequest({
                    url, method: 'POST',
                    data: "data=" + encodeURIComponent(JSON.stringify(data)),
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    onload: resp => { tnt.core.debug.dir(resp.responseText, 5); if (callback) callback(); }
                });
            }
        },
        debug: {
            log(val, lvl = 1) { if (tnt.settings.debug.enable && tnt.settings.debug.level > lvl) GM_log(val); },
            dir(val, lvl = 1) { if (tnt.settings.debug.enable && tnt.settings.debug.level > lvl) GM_dir(val); },
            timer: {
                start(label) { if (tnt.settings.debug.timer.enable && tnt.settings.debug.enable) console.time(label); },
                end(label) { if (tnt.settings.debug.timer.enable && tnt.settings.debug.enable) console.timeEnd(label); }
            }
        },
        utils: {
            index(obj, path, value) {
                if (typeof path === 'string') return tnt.core.utils.index(obj, path.split('.'), value);
                if (path.length === 1) return value !== undefined ? (obj[path[0]] = value) : obj[path[0]];
                return tnt.core.utils.index(obj[path[0]], path.slice(1), value);
            },
            delay: ms => new Promise(res => setTimeout(res, ms)),
            getGradientColor(v1, v2, c1 = "#ff0000", c2 = "#00FF00") {
                if (v1 > v2) [v1, v2] = [v2, v1];
                const hexToRgb = hex => {
                    const b = parseInt(hex.substring(1), 16);
                    return { r: (b >> 16) & 255, g: (b >> 8) & 255, b: b & 255 };
                };
                const rgbToHex = (r, g, b) => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
                const c1Rgb = hexToRgb(c1), c2Rgb = hexToRgb(c2), ratio = v1 / v2;
                return rgbToHex(
                    Math.round(c1Rgb.r * ratio + c2Rgb.r * (1 - ratio)),
                    Math.round(c1Rgb.g * ratio + c2Rgb.g * (1 - ratio)),
                    Math.round(c1Rgb.b * ratio + c2Rgb.b * (1 - ratio))
                );
            },
            getHighestValue(key, obj) {
                let highest = -Infinity;
                for (let city in obj) if (obj[city][key] > highest) highest = obj[city][key];
                return highest;
            }
        },
        storage: {
            init() {
                tnt.data.storage = $.extend(true, {}, tnt.data.storage, JSON.parse(localStorage.getItem("tnt_storage")));
                tnt.data.ikaTweaks = JSON.parse(localStorage.getItem("ikaTweaks_")) || {};
            },
            get(group, name) { return tnt.data.storage[group][name]; },
            set(group, name, value) { tnt.data.storage[group][name] = value; tnt.core.storage.save(); },
            save() { localStorage.setItem("tnt_storage", JSON.stringify(tnt.data.storage)); }
        },
        notification: {
            init() { if (Notification && Notification.permission !== "granted") Notification.requestPermission(); },
            notifyMe(title, message, picture) {
                // Disabled for now
                return;
            },
            check() {
                // cities advisor
                if (!tnt.core.storage.get('notification', 'cities')) {
                    var normal = $('li#advCities a.normalactive');
                    var premium = $('li#advCities a.premiumactive');
                    var el, img;
                    if (normal) {
                        el = normal;
                        img = normal.css("background-image");
                    } else if (premium) {
                        el = premium;
                        img = premium.css("background-image");
                    }
                    // console.dir(el);
                    // console.dir("img: " + img);

                    if (el && $(el).data("notification") !== true); {
                        tnt.core.notification.notifyMe(
                            "Ikariam",
                            "Something happened in one of your towns!",
                            tnt.data.ikariam.url.notification.mayor_premium
                        );
                        $(el).data("notification", true);
                    }

                    tnt.core.storage.set('notification', 'cities', true);
                } else {
                    tnt.core.storage.set('notification', 'cities', false);
                }

                // diplomacy advisor
                if ($('#js_GlobalMenu_diplomacy').is(".normalactive, .premiumactive") && !tnt.core.storage.get('notification', 'diplomat')) {
                    tnt.core.notification.notifyMe(
                        "Ikariam",
                        "Someone sent you a message!",
                        tnt.data.ikariam.url.notification.diplomat_premium
                    );
                    tnt.core.storage.set('notification', 'diplomat', true);
                } else {
                    tnt.core.storage.set('notification', 'diplomat', false);
                }

                // military advisor
                if ($('#js_GlobalMenu_military').is(".normalactive, .premiumactive") && !tnt.core.storage.get('notification', 'military')) {

                    // console.dir("military", $('li#advMilitary a'));

                    tnt.core.notification.notifyMe(
                        "Ikariam",
                        "Your military advisor is trying to tell you something!",
                        tnt.data.ikariam.url.notification.general_premium
                    );
                    tnt.core.storage.set('notification', 'military', true);
                } else {
                    tnt.core.storage.set('notification', 'military', false);
                }
                // military alerts
                if ($('#js_GlobalMenu_military').is(".normalalert, .premiumalert") && !tnt.core.storage.get('notification', 'militaryAlert')) {
                    tnt.core.notification.notifyMe(
                        "Ikariam",
                        "One of your towns is being attacked!",
                        tnt.data.ikariam.url.notification.general_premium
                    );
                    tnt.core.storage.set('notification', 'militaryAlert', true);
                } else {
                    tnt.core.storage.set('notification', 'militaryAlert', false);
                }

                // scientist advisor
                if ($('#js_GlobalMenu_research').is(".normalactive, .premiumactive") && !tnt.core.storage.get('notification', 'scientist')) {
                    tnt.core.notification.notifyMe(
                        "Ikariam",
                        "New research available!",
                        tnt.data.ikariam.url.notification.scientist_premium
                    );
                    tnt.core.storage.set('notification', 'scientist', true);
                } else {
                    tnt.core.storage.set('notification', 'scientist', false);
                }
            }
        },
        events: {
            init() { tnt.core.events.ikariam.override(); },
            ikariam: {
                override() {

                    // updateGlobalData
                    ajax.Responder.tntUpdateGlobalData = ajax.Responder.updateGlobalData;
                    ajax.Responder.updateGlobalData = function (response) {
                        var view = $('body').attr('id');
                        tnt.core.debug.log("updateGlobalData (View: " + view + ")", 3);

                        // Let Ikariam do its stuff
                        ajax.Responder.tntUpdateGlobalData(response);

                        // Check notifications
                        tnt.core.notification.check();

                        // Collect resource data
                        tnt.resource.update();
                    }

                    // updateBackgroundData
                    ajax.Responder.tntUpdateBackgroundData = ajax.Responder.updateBackgroundData;
                    ajax.Responder.updateBackgroundData = function (response) {
                        var view = $('body').attr('id');
                        tnt.core.debug.log("updateBackgroundData (View: " + view + ")", 3);

                        // Let Ikariam do its stuff
                        ajax.Responder.tntUpdateBackgroundData(response);

                        // Check notifications
                        tnt.core.notification.check();

                        switch (view) {
                            case "worldmap_iso":
                                tnt.core.debug.log($('worldmap_iso: div.islandTile div.cities'), 3);
                                var totalCities = 0;
                                $('div.islandTile div.cities').each(function () {
                                    totalCities += parseInt($(this).text());
                                });
                                tnt.core.debug.log(totalCities, 3);
                                break
                            case "city":
                                break;
                            case "plunder":
                                // Select all units when pillaging
                                tnt.core.utils.delay(1000).then(() => $('#selectArmy .assignUnits .setMax').trigger("click"));
                                break;
                            case 'tradeAdvisor':
                                tnt.core.debug.log("tradeAdvisor", 3);
                                break;
                        }
                    }

                    // changeView
                    ajax.Responder.tntChangeView = ajax.Responder.changeView;
                    ajax.Responder.changeView = function (response) {
                        var view = $('body').attr('id');
                        tnt.core.debug.log("changeView (View: " + view + ")", 3);

                        // Let Ikariam do its stuff
                        ajax.Responder.tntChangeView(response);

                        // Check notifications
                        tnt.core.notification.check();

                        tnt.core.debug.log("ikariam.templateView.id: '" + ikariam.templateView.id + "'", 3);
                        switch (ikariam.templateView.id) {
                            case "townHall":
                                if (!ikariam.backgroundView.screen.data.isCapital && $('#sidebarWidget .indicator').length > 1) {
                                    $('#sidebarWidget .indicator').last().trigger("click");
                                }
                                // tnt.
                                break;
                            // TODO one of the contentBox01h dosn't work with the Embassy -> Allians dialog
                            case "tradeAdvisor":
                                $("#tradeAdvisor").children('div.contentBox01h').eq(1).hide(); // Seen in tradeAdvisor
                                break;
                            case "militaryAdvisor":
                                $("#militaryAdvisor").find('div.contentBox01h').eq(0).hide(); // Seen in researchAdvisor
                                break;
                            case "researchAdvisor":
                                $("#researchAdvisor").find('div.contentBox01h').eq(1).hide(); // Seen in researchAdvisor
                                break;
                            case "diplomacyAdvisor":
                                $("#tab_diplomacyAdvisor").find('div.contentBox01h').eq(2).hide(); // Seen in diplomacyAdvisor
                                break;
                            case "transport":
                                // Remove Trition engine on transport dialog
                                $('#setPremiumJetPropulsion').hide().prev().hide();
                                break;
                            case "resource":
                                $('#sidebarWidget .indicator').eq(1).trigger("click");
                                break;
                            case "merchantNavy":
                                // Show cargo content on the ship transport view
                                setTimeout(function () {
                                    pulldownAll();
                                }, 500);
                                break;
                            case "deployment":
                            case "plunder":
                                // Select all units when moving army
                                tnt.core.utils.delay(1000).then(() => $('#selectArmy .assignUnits .setMax').trigger("click"));
                                break;
                        }
                    }

                    // Add military data collection to view changes
                    ajax.Responder.tntUpdateView = ajax.Responder.updateView;
                    ajax.Responder.updateView = function (response) {
                        const view = ikariam.templateView.id;

                        // Let Ikariam handle the update
                        ajax.Responder.tntUpdateView(response);

                        // Collect military data after view updates
                        if (view === 'militaryAdvisor' || view === 'townHall' || view === 'port') {
                            tnt.resource.update();
                        }
                    };

                    // Add handler for city changes in military view
                    $(document).on('click', '#js_citySelectContainer li', function () {
                        setTimeout(() => tnt.resource.update(), 500);
                    });
                }
            }
        },
        options: {
            init() {
                if (GM_getValue("version") != tnt.version) tnt.core.options.setup();

                // Add to options UI
                const cityOptions = `
                    <div class="tnt_left" style="padding-left:20px;">
                        <legend>Cities:</legend>
                        <input id="tntCityAutoUpdate" type="checkbox"${GM_getValue("cityAutoUpdate") ? ' checked="checked"' : ''} /> Enable hourly auto-updates<br/>
                    </div>
                `;
                $("#tntOptions > div").append(cityOptions);

                /* Add option link, option box and eventlisteners */
                // $("#GF_toolbar ul").append('\
                $('\
                    <li>\
                        <a id="tntOptionsLink" href="javascript:void(0);">TNT Options v' + tnt.version + '</a>\
                        <div id="tntOptions" class="tntBox" style="display:none;">\
                            <div id="tntUpdateLine" align="center" style="padding-bottom:5px;">\
                                <a id="tntColUpgradeLink" href="" style="display:none;color:blue;font-size:12px;">Version <span id="tntColVersion"></span> is available. Click here to update now!</a>\
                            </div>\
                            <div>\
                                <div class="tnt_left" style="float:left;width:50%;">\
                                    <legend>All:</legend>\
                                    <input id="tntAllRemovePremiumOffers" type="checkbox"' + (GM_getValue("allRemovePremiumOffers") ? ' checked="checked"' : '') + ' /> Remove Premium Offers<br/>\
                                    <input id="tntAllRemoveFooterNavigation" type="checkbox"' + (GM_getValue("allRemoveFooterNavigation") ? ' checked="checked"' : '') + ' /> Remove footer navigation<br/>\
                                    <input id="tntAllChangeNavigationCoord" type="checkbox"' + (GM_getValue("allChangeNavigationCoord") ? ' checked="checked"' : '') + ' /> Make footer navigation coord input a number<br/>\
                                </div>\
                                <div class="tnt_left" style="float:left;width:50%;">\
                                    <legend>Notifications:</legend>\
                                    <input id="tntNotificationAdvisors" type="checkbox"' + (GM_getValue("notificationAdvisors") ? ' checked="checked"' : '') + ' /> Show notifications from Advisors<br/>\
                                    <input id="tntNotificationSound" type="checkbox"' + (GM_getValue("notificationSound") ? ' checked="checked"' : '') + ' /> Play sound with notifications from Advisors<br/>\
                                </div>\
                                <div class="tnt_left" style="float:left;width:50%;">\
                                    <legend>Islands:</legend>\
                                    <input id="tntIslandShowCityLvl" type="checkbox"' + (GM_getValue("islandShowCityLvl") ? ' checked="checked"' : '') + ' /> Show Town Levels on Islands<br/>\
                                </div>\
                                <div class="tnt_left" style="float:left;width:50%;">\
                                    <legend>City:</legend>\
                                    <input id="tntCityRemoveFlyingShop" type="checkbox"' + (GM_getValue("cityRemoveFlyingShop") ? ' checked="checked"' : '') + ' /> Remove flying shop<br/>\
                                    <input id="tntCityShowResources" type="checkbox"' + (GM_getValue("cityShowResources") ? ' checked="checked"' : '') + ' /> Show resources<br/>\
                                    <div class="tnt_left" style="padding-left:20px;">\
                                        <input id="tntCityShowResourcesPorpulation" type="checkbox"' + (GM_getValue("cityShowResourcesPorpulation") ? ' checked="checked"' : '') + ' /> Show porpulation<br/>\
                                        <input id="tntCityShowResourcesCitizens" type="checkbox"' + (GM_getValue("cityShowResourcesCitizens") ? ' checked="checked"' : '') + ' /> Show citizens<br/>\
                                        <input id="tntCityShowResourcesWoods" type="checkbox"' + (GM_getValue("cityShowResourcesWoods") ? ' checked="checked"' : '') + ' /> Show wood<br/>\
                                        <input id="tntCityShowResourcesWine" type="checkbox"' + (GM_getValue("cityShowResourcesWine") ? ' checked="checked"' : '') + ' /> Show Wine<br/>\
                                        <input id="tntCityShowResourcesMarble" type="checkbox"' + (GM_getValue("cityShowResourcesMarble") ? ' checked="checked"' : '') + ' /> Show Marble<br/>\
                                        <input id="tntCityShowResourcesCrystal" type="checkbox"' + (GM_getValue("cityShowResourcesCrystal") ? ' checked="checked"' : '') + ' /> Show Crystal<br/>\
                                        <input id="tntCityShowResourcesSulfur" type="checkbox"' + (GM_getValue("cityShowResourcesSulfur") ? ' checked="checked"' : '') + ' /> Show Sulfur<br/>\
                                    </div>\
                                </div>\
                                <div class="tnt_left" style="float:left;width:50%;">\
                                    <legend>World Map:</legend>\
                                </div>\
                            </div>\
                            <div align="center" style="clear:both;">\
                                <input id="tntOptionsClose" type="button" class="button" value="Close and refresh" />\
                            </div>\
                        </div>\
                    </li>\
                ').insertBefore('li.serverTime'); //.attr('style', 'width:1200px;');

                // Open close option dialog
                $("#tntOptionsLink").bind("click", function () {
                    $("#tntOptions").slideToggle();
                });
                $("#tntOptionsClose").bind("click", function () {
                    $("#tntOptions").slideToggle();
                    location.reload();
                });

                // Option checkboxes bind change event
                $("#tntAllRemovePremiumOffers").bind("change", function () {
                    GM_setValue("allRemovePremiumOffers", (GM_getValue("allRemovePremiumOffers") ? false : true));
                });
                $("#tntAllRemoveFooterNavigation").bind("change", function () {
                    GM_setValue("allRemoveFooterNavigation", (GM_getValue("allRemoveFooterNavigation") ? false : true));
                });
                $("#tntAllChangeNavigationCoord").bind("change", function () {
                    GM_setValue("allChangeNavigationCoord", (GM_getValue("allChangeNavigationCoord") ? false : true));
                });
                $("#tntIslandShowCityLvl").bind("change", function () {
                    GM_setValue("islandShowCityLvl", (GM_getValue("islandShowCityLvl") ? false : true));
                });
                // City options
                $("#tntCityRemoveFlyingShop").bind("change", function () {
                    GM_setValue("cityRemoveFlyingShop", (GM_getValue("cityRemoveFlyingShop") ? false : true));
                });
                // Resources
                $("#tntCityShowResources").bind("change", function () {
                    GM_setValue("cityShowResources", (GM_getValue("cityShowResources") ? false : true));
                });
                $("#tntCityShowResourcesPorpulation").bind("change", function () {
                    GM_setValue("cityShowResourcesPorpulation", (GM_getValue("cityShowResourcesPorpulation") ? false : true));
                });
                $("#tntCityShowResourcesCitizens").bind("change", function () {
                    GM_setValue("cityShowResourcesCitizens", (GM_getValue("cityShowResourcesCitizens") ? false : true));
                });
                $("#tntCityShowResourcesWoods").bind("change", function () {
                    GM_setValue("cityShowResourcesWoods", (GM_getValue("cityShowResourcesWoods") ? false : true));
                });
                $("#tntCityShowResourcesWine").bind("change", function () {
                    GM_setValue("cityShowResourcesWine", (GM_getValue("cityShowResourcesWine") ? false : true));
                });
                $("#tntCityShowResourcesMarble").bind("change", function () {
                    GM_setValue("cityShowResourcesMarble", (GM_getValue("cityShowResourcesMarble") ? false : true));
                });
                $("#tntCityShowResourcesCrystal").bind("change", function () {
                    GM_setValue("cityShowResourcesCrystal", (GM_getValue("cityShowResourcesCrystal") ? false : true));
                });
                $("#tntCityShowResourcesSulfur").bind("change", function () {
                    GM_setValue("cityShowResourcesSulfur", (GM_getValue("cityShowResourcesSulfur") ? false : true));
                });

                // Notification Advisor
                $("#tntNotificationAdvisors").bind("change", function () {
                    GM_setValue("notificationAdvisors", (GM_getValue("notificationAdvisors") ? false : true));
                });
                // Notification Sound
                $("#tntNotificationSound").bind("change", function () {
                    GM_setValue("notificationSound", !GM_getValue("notificationSound"));
                });
            },
            setup() {
                /* Set/Upgrade default values */
                GM_setValue("allRemovePremiumOffers", GM_getValue("allRemovePremiumOffers", true));
                GM_setValue("allRemoveFooterNavigation", GM_getValue("allRemoveFooterNavigation", true));
                GM_setValue("allChangeNavigationCoord", GM_getValue("allChangeNavigationCoord", true));
                GM_setValue("islandShowCityLvl", GM_getValue("islandShowCityLvl", true));
                GM_setValue("cityRemoveFlyingShop", GM_getValue("cityRemoveFlyingShop", true));
                GM_setValue("cityShowResources", GM_getValue("cityShowResources", true));
                GM_setValue("notificationAdvisors", GM_getValue("notificationAdvisors", true));
                GM_setValue("notificationSound", GM_getValue("notificationSound", true));
                GM_setValue("cityAutoUpdate", GM_getValue("cityAutoUpdate", false));
                GM_setValue("version", tnt.version);
            }
        },
        info: {
            init() {
                $('body').append('\
                    <ul id="tntInfoWidget">\
                        <li class="accordionItem">\
                            <a class="accordionTitle active">TNT Info<span class="indicator"></span></a>\
                            <div class="scroll_area scroll_disabled">\
                                <div class="scroll_arrow_top"></div>\
                                <div class="scroller" style="width: 5px; top: 0px; left: 0px;"></div>\
                                <div class="scroll_arrow_bottom"></div>\
                            </div>\
                            <div class="accordionContent" style="height:400px;">\
                                Player ID: <span id="playerId"></span>\
                            </div>\
                        </li>\
                    </ul>\
                ');
            }
        },
        checkVersion() {
            GM_xmlhttpRequest({
                url: tnt.url.version,
                method: 'POST',
                data: JSON.stringify({ "currentVersion": tnt.version }),
                headers: { "Content-Type": "application/json" },
                onload: function (response) { // TODO make this check work again. Response from server not correct
                    if (response.version != tnt.version) {
                        $("#tntOptionsLink").css("color", "darkred");
                        $("#tntColVersion").html(response.responseText.split("&")[0].split("=")[1]);
                        $("#tntColUpgradeLink").attr("href", response.responseText.split("&")[1].split("=")[1]).show();
                    }
                }
            });
        }
    },
    template: {
        resources: `
            <div id="tnt_info_resources">
                <div id="tnt_info_resources_content"></div>
                <div id="tnt_info_buildings_content" style="display:none;"></div>
            </div>
        `
    },
    all() {
        if (GM_getValue("allRemovePremiumOffers")) {
            GM_addStyle("#premium_btn,.premiumOfferBox,.premiumOffer,.expandable.resourceShop,.expandable.slot1,#transport .premiumTransporters,#transport .buildingDescription{display:none!important;height:0!important;}#resource #setWorkers .content,#tradegood #setWorkers .content{min-height:180px;}");
            $("form#ambrosiaDonateForm").closest('li').hide();
        }
        if (GM_getValue("allRemoveFooterNavigation")) $('#footer').hide();
    },
    island() {
        if (GM_getValue("islandShowCityLvl")) {
            $(".cityLocation").each(function () {
                var levelMatch = $(this).attr('class').match(/level(\d+)/);
                if (levelMatch) $("#" + this.id + " > a").append('<span class="tntLvl" style="top:35px; left:25px;">' + levelMatch[1] + '</span>');
            });
        }
    },
    city() {
        if (GM_getValue("cityRemoveFlyingShop")) GM_addStyle("#cityFlyingShopContainer{display:none;};");
    },
    world() { },
    resource: {
        update() {
            const cityId = tnt.get.cityId();
            const prev = $.extend(true, {}, tnt.data.storage.resources.city[cityId] || {});

            // Initialize city data with military property
            const military = {
                units: {},
                ships: {},
                movements: []
            };

            // Initialize city data
            const cityData = {
                ...prev,
                military, // Add missing comma here
                buildings: {},
                cityIslandCoords: tnt.get.cityIslandCoords(),
                producedTradegood: parseInt(tnt.get.producedTradegood()),
                population: tnt.get.population(),
                citizens: tnt.get.citizens(),
                max: ikariam.model.maxResources.resource,
                wood: tnt.get.resources.wood(),
                wine: tnt.get.resources.wine(),
                marble: tnt.get.resources.marble(),
                crystal: tnt.get.resources.crystal(),
                sulfur: tnt.get.resources.sulfur(),
                hasConstruction: $("body").attr("id") == "city" ? tnt.has.construction() : (prev.hasConstruction || false),
                resourceProduction: tnt.get.resourceProduction(),
                tradegoodProduction: tnt.get.tradegoodProduction(),
                lastUpdate: Date.now()
            };

            // Extract building data when in city view
            if ($("body").attr("id") === "city") {
                const detectBuildings = () => {
                    // Wait for locations container and loading to complete
                    const $locations = $('#locations');
                    if (!$locations.length || $locations.hasClass('loading')) {
                        setTimeout(detectBuildings, 500);
                        return;
                    }

                    // Get all building positions using both selectors to ensure compatibility
                    const $positions = $('div[id^="position"].building, div[id^="js_CityPosition"].building');
                    const foundBuildings = {};

                    $positions.each(function () {
                        const $pos = $(this);
                        const posId = $pos.attr('id');
                        if (!posId) return;

                        // Get position number from either format (position0 or js_CityPosition0)
                        const position = posId.match(/\d+$/)?.[0];
                        if (!position) return;

                        const classes = ($pos.attr('class') || '').split(/\s+/);

                        // Find building type from class list
                        const buildingType = classes.find(c => validBuildingTypes.includes(c));
                        if (!buildingType) return;

                        // Get level from level class (e.g. "level23")
                        const levelMatch = classes.find(c => c.startsWith('level'))?.match(/\d+$/);
                        const level = levelMatch ? parseInt(levelMatch[0]) : 0;
                        if (!level) return;

                        // Store building data
                        foundBuildings[buildingType] = foundBuildings[buildingType] || [];
                        foundBuildings[buildingType].push({
                            position,
                            level,
                            name: buildingType
                        });
                    });

                    if (Object.keys(foundBuildings).length > 0) {
                        cityData.buildings = foundBuildings;
                        tnt.data.storage.resources.city[cityId] = cityData;
                        tnt.core.storage.save();
                        tnt.resource.show();
                    } else if (prev.buildings && Object.keys(prev.buildings).length > 0) {
                        cityData.buildings = prev.buildings;
                        tnt.data.storage.resources.city[cityId] = cityData;
                        tnt.core.storage.save();
                        tnt.resource.show();
                    }
                };

                detectBuildings();
            } else {
                // Use previous building data for non-city views
                cityData.buildings = prev.buildings || {};
                tnt.data.storage.resources.city[cityId] = cityData;
                tnt.core.storage.save();
                tnt.resource.show();
            }

            tnt.core.debug.log('Scanning for military units...', 3);

            // Scan for units in cityMilitary view
            if ($('#tabUnits').length) {
                $('#tabUnits .militaryList').each(function () {
                    const $table = $(this);
                    const $headers = $table.find('tr.title_img_row th:not(:first)');
                    const $counts = $table.find('tr.count td:not(:first)');

                    $headers.each(function (index) {
                        const $div = $(this).find('div.army');
                        if ($div.length) {
                            const tooltip = $div.find('.tooltip').text().trim();
                            const unitClass = $div.attr('class');
                            const unitMatch = unitClass?.match(/s(\d+)/);
                            if (unitMatch) {
                                const unitId = `unit${unitMatch[1]}`;
                                const count = parseInt($counts.eq(index).text()) || 0;
                                if (count > 0) {
                                    cityData.military.units[unitId] = count; // Fix property access
                                    tnt.core.debug.log(`Found ${count} ${unitId} (${tooltip})`, 3);
                                }
                            }
                        }
                    });
                });
            }

            // Scan for ships in cityMilitary view
            if ($('#tabShips').length) {
                $('#tabShips .militaryList').each(function () {
                    const $table = $(this);
                    const $headers = $table.find('tr.title_img_row th:not(:first)');
                    const $counts = $table.find('tr.count td:not(:first)');

                    $headers.each(function (index) {
                        const $div = $(this).find('div.fleet');
                        if ($div.length) {
                            const tooltip = $div.find('.tooltip').text().trim();
                            const shipClass = $div.attr('class');
                            const shipMatch = shipClass?.match(/s(\d+)/);
                            if (shipMatch) {
                                const shipId = `ship${shipMatch[1]}`;
                                const count = parseInt($counts.eq(index).text()) || 0;
                                if (count > 0) {
                                    cityData.military.ships[shipId] = count;
                                    tnt.core.debug.log(`Found ${count} ${shipId} (${tooltip})`, 3);
                                }
                            }
                        }
                    });
                });
            }

            // Store all data in one update
            cityData.lastUpdate = Date.now();

            // Update storage
            tnt.data.storage.resources.city[cityId] = cityData;

            // Force save to localStorage immediately
            tnt.core.storage.save();

            // Verify storage
            const stored = JSON.parse(localStorage.getItem("tnt_storage"));
            tnt.core.debug.log('Stored data for city ' + cityId + ':', 3);
            tnt.core.debug.log(stored.resources.city[cityId], 3);

            // Update template
            tnt.resource.show();
        },
        show() {
            if (GM_getValue("cityShowResources") && $("body").attr("id") == "city") {
                // Only append the widget if it doesn't exist
                if ($('#tnt_info_resources').length === 0) {
                    $('body').append(
                        tnt.template.resources.replace('<span class="tnt_panel_minimize_btn tnt_back"></span>', '')
                    );
                }

                $('#tnt_info_resources_content').empty();

                // Only one set of buttons in the header cell
                var table = '<table id="tnt_resource_table" border="1">\
                    <tr>\
                        <th class="tnt_center tnt_bold" style="position:relative;">\
                            <span class="tnt_panel_minimize_btn tnt_back" id="tnt_panel_minimize_btn_header" style="float:left;"></span>\
                            City <span class="tnt_table_toggle_btn" title="Show buildings/resources"></span>\
                        </th>\
                        <th class="tnt_center tnt_bold">Lvl</th>\
                        <th class="tnt_center"' + (GM_getValue("cityShowResourcesPorpulation") ? '' : ' style="display:none;"') + '>' + tnt.resource.getIcon('population') + '</th>\
                        <th class="tnt_center"' + (GM_getValue("cityShowResourcesCitizens") ? '' : ' style="display:none;"') + '>' + tnt.resource.getIcon('citizens') + '</th>\
                        <th class="tnt_center"' + (GM_getValue("cityShowResourcesWoods") ? '' : ' style="display:none;"') + '>' + tnt.resource.getIcon(0) + '</th>\
                        <th class="tnt_center"' + (GM_getValue("cityShowResourcesWine") ? '' : ' style="display:none;"') + '>' + tnt.resource.getIcon(1) + '</th>\
                        <th class="tnt_center"' + (GM_getValue("cityShowResourcesMarble") ? '' : ' style="display:none;"') + '>' + tnt.resource.getIcon(2) + '</th>\
                        <th class="tnt_center"' + (GM_getValue("cityShowResourcesCrystal") ? '' : ' style="display:none;"') + '>' + tnt.resource.getIcon(3) + '</th>\
                        <th class="tnt_center"' + (GM_getValue("cityShowResourcesSulfur") ? '' : ' style="display:none;"') + '>' + tnt.resource.getIcon(4) + '</th>\
                    </tr>';

                // Add city rows (no panel/minimize button in city rows)
                $.each(tnt.resource.sortCities(), function (index, cityID) {
                    var value = tnt.data.storage.resources.city[cityID];
                    table += '<tr' + (cityID == tnt.get.cityId() ? ' class="tnt_selected"' : '') + '>\
                        <td class="tnt_city tnt_left' + (value.hasConstruction ? ' tnt_construction' : '') + '" title="' + value.cityIslandCoords + '">\
                            <a onclick=\'$("#dropDown_js_citySelectContainer li[selectValue=\\"' + cityID + '\\"]").trigger("click"); return false;\'>' + tnt.resource.getIcon(value.producedTradegood) + ' ' + tnt.get.cityName(cityID) + '</a>\
                        </td>\
                        <td>' + (value.cityLvl ? value.cityLvl : '-') + '</td>\
                        <td class="tnt_population"' + (GM_getValue("cityShowResourcesPorpulation") ? '' : ' style="display:none;"') + '>' + parseInt(Math.round(value.population)).toLocaleString() + '</td>\
                        <td class="tnt_citizens"' + (GM_getValue("cityShowResourcesCitizens") ? '' : ' style="display:none;"') + '>' + parseInt(Math.round(value.citizens)).toLocaleString() + '</td>\
                        <td class="tnt_wood' + tnt.resource.checkMinMax(value, 0) + '"' + (GM_getValue("cityShowResourcesWoods") ? '' : ' style="display:none;"') + '><span title="' + tnt.calc.production(cityID, 24).wood + '">' + value.wood.toLocaleString() + '</span></td>\
                        <td class="tnt_wine' + tnt.resource.checkMinMax(value, 1) + (value.producedTradegood == 1 ? ' tnt_bold' : '') + '"' + (GM_getValue("cityShowResourcesWine") ? '' : ' style="display:none;"') + '><span title="' + tnt.calc.production(cityID, 24).wine + '">' + value.wine.toLocaleString() + '</span></td>\
                        <td class="tnt_marble' + tnt.resource.checkMinMax(value, 2) + (value.producedTradegood == 2 ? ' tnt_bold' : '') + '"' + (GM_getValue("cityShowResourcesMarble") ? '' : ' style="display:none;"') + '><span title="' + tnt.calc.production(cityID, 24).marble + '">' + value.marble.toLocaleString() + '</span></td>\
                        <td class="tnt_crystal' + tnt.resource.checkMinMax(value, 3) + (value.producedTradegood == 3 ? ' tnt_bold' : '') + '"' + (GM_getValue("cityShowResourcesCrystal") ? '' : ' style="display:none;"') + '><span title="' + tnt.calc.production(cityID, 24).crystal + '">' + value.crystal.toLocaleString() + '</span></td>\
                        <td class="tnt_sulfur' + tnt.resource.checkMinMax(value, 4) + (value.producedTradegood == 4 ? ' tnt_bold' : '') + '"' + (GM_getValue("cityShowResourcesSulfur") ? '' : ' style="display:none;"') + '><span title="' + tnt.calc.production(cityID, 24).sulfur + '">' + value.sulfur.toLocaleString() + '</span></td>\
                    </tr>';
                });

                // Add total row
                var total = tnt.data.storage.resources.total;
                table += '<tr>\
                    <td class="tnt_total">\
                        Total\
                    </td>\
                    <td><span class="tnt_refresh"></span></td>\
                    <td class="tnt_population"' + (GM_getValue("cityShowResourcesPorpulation") ? '' : ' style="display:none;"') + '>' + parseInt(total.population).toLocaleString() + '</td>\
                    <td class="tnt_citizens"' + (GM_getValue("cityShowResourcesCitizens") ? '' : ' style="display:none;"') + '>' + parseInt(total.citizens).toLocaleString() + '</td>\
                    <td class="tnt_wood"' + (GM_getValue("cityShowResourcesWoods") ? '' : ' style="display:none;"') + '>' + total.wood.toLocaleString() + '</td>\
                    <td class="tnt_wine"' + (GM_getValue("cityShowResourcesWine") ? '' : ' style="display:none;"') + '>' + total.wine.toLocaleString() + '</td>\
                    <td class="tnt_marble"' + (GM_getValue("cityShowResourcesMarble") ? '' : ' style="display:none;"') + '>' + total.marble.toLocaleString() + '</td>\
                    <td class="tnt_crystal"' + (GM_getValue("cityShowResourcesCrystal") ? '' : ' style="display:none;"') + '>' + total.crystal.toLocaleString() + '</td>\
                    <td class="tnt_sulfur"' + (GM_getValue("cityShowResourcesSulfur") ? '' : ' style="display:none;"') + '>' + total.sulfur.toLocaleString() + '</td>\
                </tr>';
                table += '</table>';
                $('#tnt_info_resources_content').html(table);

                // --- Building Table Structure ---
                var buildingColumns = [
                    // Government
                    { key: 'townHall', name: 'Town Hall', icon: '/cdn/all/both/img/city/townhall_l.png', buildingId: 0, helpId: 1 },
                    { key: 'palace', name: 'Palace', icon: '/cdn/all/both/img/city/palace_l.png', buildingId: 11, helpId: 1 },
                    { key: 'palaceColony', name: 'Governor\'s Residence', icon: '/cdn/all/both/img/city/palaceColony_l.png', buildingId: 17, helpId: 1 },

                    // Resource reducers
                    { key: 'carpentering', name: 'Carpenter', icon: '/cdn/all/both/img/city/carpentering_l.png', buildingId: 23, helpId: 1 },
                    { key: 'architect', name: 'Architect\'s Office', icon: '/cdn/all/both/img/city/architect_l.png', buildingId: 24, helpId: 1 },
                    { key: 'vineyard', name: 'Wine Press', icon: '/cdn/all/both/img/city/vineyard_l.png', buildingId: 26, helpId: 1 },
                    { key: 'optician', name: 'Optician', icon: '/cdn/all/both/img/city/optician_l.png', buildingId: 25, helpId: 1 },
                    { key: 'fireworker', name: 'Firework Test Area', icon: '/cdn/all/both/img/city/fireworker_l.png', buildingId: 27, helpId: 1 },

                    // Resource enhancers
                    { key: 'forester', name: 'Forester\'s House', icon: '/cdn/all/both/img/city/forester_l.png', buildingId: 18, helpId: 1 },
                    { key: 'stonemason', name: 'Stonemason', icon: '/cdn/all/both/img/city/stonemason_l.png', buildingId: 19, helpId: 1 },
                    { key: 'winegrower', name: 'Winegrower', icon: '/cdn/all/both/img/city/winegrower_l.png', buildingId: 21, helpId: 1 },
                    { key: 'glassblowing', name: 'Glassblower', icon: '/cdn/all/both/img/city/glassblowing_l.png', buildingId: 20, helpId: 1 },
                    { key: 'alchemist', name: 'Alchemist\'s Tower', icon: '/cdn/all/both/img/city/alchemist_l.png', buildingId: 22, helpId: 1 },

                    // Resource storage
                    { key: 'warehouse', name: 'Warehouse', icon: '/cdn/all/both/img/city/warehouse_l.png', buildingId: 7, helpId: 1 },
                    { key: 'dump', name: 'Depot', icon: '/cdn/all/both/img/city/dump_l.png', buildingId: 29, helpId: 1 },

                    // Military
                    { key: 'wall', name: 'Wall', icon: '/cdn/all/both/img/city/wall.png', buildingId: 8, helpId: 1 },
                    { key: 'barracks', name: 'Barracks', icon: '/cdn/all/both/img/city/barracks_l.png', buildingId: 6, helpId: 1 },
                    { key: 'shipyard', name: 'Shipyard', icon: '/cdn/all/both/img/city/shipyard_l.png', buildingId: 5, helpId: 1 },

                    // Trade & Diplomacy
                    { key: 'port', name: 'Trading Port', icon: '/cdn/all/both/img/city/port_l.png', buildingId: 3, helpId: 1 },
                    { key: 'branchOffice', name: 'Trading Post', icon: '/cdn/all/both/img/city/branchoffice_l.png', buildingId: 13, helpId: 1 },
                    { key: 'embassy', name: 'Embassy', icon: '/cdn/all/both/img/city/embassy_l.png', buildingId: 12, helpId: 1 },

                    // Culture & Research
                    { key: 'academy', name: 'Academy', icon: '/cdn/all/both/img/city/academy_l.png', buildingId: 4, helpId: 1 },
                    { key: 'museum', name: 'Museum', icon: '/cdn/all/both/img/city/museum_l.png', buildingId: 10, helpId: 1 },
                    { key: 'temple', name: 'Temple', icon: '/cdn/all/both/img/city/temple_l.png', buildingId: 28, helpId: 1 },
                    { key: 'tavern', name: 'Tavern', icon: '/cdn/all/both/img/city/taverne_l.png', buildingId: 9, helpId: 1 },

                    // Special buildings
                    { key: 'workshop', name: 'Workshop', icon: '/cdn/all/both/img/city/workshop_l.png', buildingId: 15, helpId: 1 },
                    { key: 'safehouse', name: 'Hideout', icon: '/cdn/all/both/img/city/safehouse_l.png', buildingId: 16, helpId: 1 },
                    { key: 'pirateFortress', name: 'Pirate Fortress', icon: '/cdn/all/both/img/city/pirateFortress_l.png', buildingId: 30, helpId: 1 },
                    { key: 'blackMarket', name: 'Black Market', icon: '/cdn/all/both/img/city/blackmarket_l.png', buildingId: 31, helpId: 1 },
                    { key: 'marineChartArchive', name: 'Sea Chart Archive', icon: '/cdn/all/both/img/city/marinechartarchive_l.png', buildingId: 32, helpId: 1 },
                    { key: 'dockyard', name: 'Dockyard', icon: '/cdn/all/both/img/city/dockyard_l.png', buildingId: 33, helpId: 1 },
                    { key: 'shrineOfOlympus', name: 'Gods\' Shrine', icon: '/cdn/all/both/img/city/shrineOfOlympus_l.png', buildingId: 34, helpId: 1 },
                    { key: 'chronosForge', name: 'Chronos\' Forge', icon: '/cdn/all/both/img/city/chronosForge_l.png', buildingId: 35, helpId: 1 }
                ];

                // Determine which building columns are used in any city
                var usedColumns = buildingColumns.filter(function (col) {
                    const cities = Object.values(tnt.data.storage.resources.city);
                    if (col.key === 'palace' || col.key === 'palaceColony') {
                        return cities.some(city =>
                            (city.buildings?.['palace']?.length > 0) ||
                            (city.buildings?.['palaceColony']?.length > 0)
                        );
                    }
                    return cities.some(city => city.buildings?.[col.key]?.length > 0);
                });

                // Merge palace/palaceColony into a single column for display
                var mergedColumns = [];
                var seenPalace = false;
                usedColumns.forEach(function (col) {
                    if ((col.key === 'palace' || col.key === 'palaceColony') && !seenPalace) {
                        mergedColumns.push({
                            key: 'palaceOrColony',
                            name: 'Palace / Governor\'s Residence',
                            icon: '/cdn/all/both/img/city/palace_l.png',
                            icon2: '/cdn/all/both/img/city/palaceColony_l.png',
                            buildingId: 11,
                            helpId: 1
                        });
                        seenPalace = true;
                    } else if (col.key !== 'palace' && col.key !== 'palaceColony') {
                        mergedColumns.push(col);
                    }
                });

                var buildingTable = '<table id="tnt_building_table" border="1">\
                    <tr>\
                        <th class="tnt_center tnt_bold" style="position:relative; text-align:center;">\
                            <div style="position:relative; min-width:120px; text-align:center;">\
                                <span class="tnt_panel_minimize_btn tnt_back" id="tnt_panel_minimize_btn_building_header" style="position:absolute; left:2px; top:2px;"></span>\
                                <span id="tnt_toggle_table" class="tnt_table_toggle_btn active" title="Show Resources" style="position:absolute; right:2px; top:2px;"></span>\
                                <span style="display:inline-block; text-align:center; min-width:60px;">City</span>\
                            </div>\
                        </th>';

                mergedColumns.forEach(function (b) {
                    if (b.key === 'palaceOrColony') {
                        buildingTable += '<th class="tnt_center tnt_bold">' +
                            '<a href="#" onclick="ajaxHandlerCall(\'?view=buildingDetail&amp;buildingId=11&amp;helpId=1\');return false;" title="Learn more about Palace...">' +
                            '<img class="tnt_resource_icon tnt_building_icon" title="Palace" src="' + b.icon + '">' +
                            '</a>' +
                            '<a href="#" onclick="ajaxHandlerCall(\'?view=buildingDetail&amp;buildingId=17&amp;helpId=1\');return false;" title="Learn more about Governor\'s Residence...">' +
                            '<img class="tnt_resource_icon tnt_building_icon" title="Governor\'s Residence" src="' + b.icon2 + '">' +
                            '</a></th>';
                    } else {
                        buildingTable += '<th class="tnt_center tnt_bold">' +
                            '<a href="#" onclick="ajaxHandlerCall(\'?view=buildingDetail&amp;buildingId=' + b.buildingId + '&amp;helpId=' + b.helpId + '\');return false;" title="Learn more about ' + b.name + '...">' +
                            '<img class="tnt_resource_icon tnt_building_icon" title="' + b.name + '" src="' + b.icon + '">' +
                            '</a></th>';
                    }
                });

                buildingTable += '</tr>';

                // Add city rows (now with resource icon in first column)
                $.each(tnt.resource.sortCities(), function (index, cityID) {
                    var value = tnt.data.storage.resources.city[cityID];
                    buildingTable += '<tr' + (cityID == tnt.get.cityId() ? ' class="tnt_selected"' : '') + '>\
                        <td class="tnt_city tnt_left" style="text-align:left;">' +
                        '<a onclick=\'$("#dropDown_js_citySelectContainer li[selectValue=\\"' + cityID + '\\"]").trigger("click"); return false;\'>' +
                        tnt.resource.getIcon(value.producedTradegood) + ' ' + tnt.get.cityName(cityID) +
                        '</a></td>';
                    // Print building levels for this city
                    var cityBuildings = value.buildings || {};
                    mergedColumns.forEach(function (col) {
                        if (col.key === 'palaceOrColony') {
                            var palaceArr = Array.isArray(cityBuildings['palace']) ? cityBuildings['palace'] : [];
                            var colonyArr = Array.isArray(cityBuildings['palaceColony']) ? cityBuildings['palaceColony'] : [];

                            // Combine palace and colony data
                            var buildingData = palaceArr.concat(colonyArr);

                            if (buildingData.length > 0) {
                                var sumLevel = buildingData.reduce((acc, b) => acc + (parseInt(b.level) || 0), 0);
                                var tooltip = buildingData.map(b =>
                                    (b.name === 'palace' ? 'Palace' : "Governor's Residence") +
                                    ' (Pos ' + b.position + '): lvl ' + b.level
                                ).join('\n');
                                buildingTable += '<td class="tnt_building_level" style="text-align:center;" title="' + tooltip.replace(/"/g, '&quot;') + '">' + sumLevel + '</td>';
                            } else {
                                buildingTable += '<td class="tnt_building_level" style="text-align:center;">-</td>';
                            }
                        } else {
                            var arr = cityBuildings[col.key];
                            if (Array.isArray(arr) && arr.length > 0) {
                                var sumLevel = arr.reduce((acc, b) => acc + (b.level || 0), 0);
                                var tooltip = arr.map(b => 'Pos ' + b.position + ': lvl ' + b.level).join('\n');
                                buildingTable += '<td class="tnt_building_level" style="text-align:center;" title="' + tooltip.replace(/"/g, '&quot;') + '">' + sumLevel + '</td>';
                            } else {
                                buildingTable += '<td class="tnt_building_level" style="text-align:center;"></td>';
                            }
                        }
                    });
                    buildingTable += '</tr>';
                });

                // Add total row (empty, for future use or visual consistency)
                buildingTable += '<tr>\
                    <td class="tnt_total">Total</td>';
                mergedColumns.forEach(function () {
                    buildingTable += '<td class="tnt_building_level"></td>';
                });
                buildingTable += '</tr>';

                buildingTable += '</table>';

                $('#tnt_info_buildings_content').html(buildingTable);

                // Add handlers after tables are created
                // Panel minimize/maximize
                $('.tnt_panel_minimize_btn').off('click').on('click', function () {
                    const $panel = $('#tnt_info_resources');
                    const $btn = $(this);

                    if ($panel.hasClass('minimized')) {
                        $panel.removeClass('minimized');
                        $btn.removeClass('tnt_foreward').addClass('tnt_back');
                    } else {
                        $panel.addClass('minimized');
                        $btn.removeClass('tnt_back').addClass('tnt_foreward');
                    }
                });

                // Toggle between resources/buildings tables
                $('.tnt_table_toggle_btn').off('click').on('click', function () {
                    const $resourceContent = $('#tnt_info_resources_content');
                    const $buildingContent = $('#tnt_info_buildings_content');

                    if ($resourceContent.is(':visible')) {
                        $resourceContent.hide();
                        $buildingContent.show();
                        $(this).addClass('active');
                    } else {
                        $buildingContent.hide();
                        $resourceContent.show();
                        $(this).removeClass('active');
                    }
                });

                // Refresh button in totals row
                $('.tnt_refresh').off('click').on('click', function () {
                    tnt.citySwitcher.updateAllCitiesResources();
                });
            }
        },
        toggle(el) {
            // No longer used, logic moved to .tnt_toggle_panel_btn click handler
        },
        sortCities() {
            var list = {};
            $.each(tnt.data.storage.resources.city, (cityID, value) => list[cityID] = value.producedTradegood);
            var order = { 2: 0, 1: 1, 3: 2, 4: 3 };
            return Object.keys(list).sort((a, b) => order[list[a]] - order[list[b]]);
        },
        checkMinMax(city, resource) {
            if (!GM_getValue("cityShowResources")) return '';
            var max = city.max, txt = '';
            switch (resource) {
                case 0: if (city.wood > max * .8) txt += ' storage_danger'; if (city.wood < 100000) txt += ' storage_min'; break;
                case 1: if (city.wine > max * .8) txt += ' storage_danger'; if (city.wine < 100000) txt += ' storage_min'; break;
                case 2: if (city.marble > max * .8) txt += ' storage_danger'; if (city.marble < 50000) txt += ' storage_min'; break;
                case 3: if (city.crystal > max * .8) txt += ' storage_danger'; if (city.crystal < 50000) txt += ' storage_min'; break;
                case 4: if (city.sulfur > max * .8) txt += ' storage_danger'; if (city.sulfur < 50000) txt += ' storage_min'; break;
            }
            return txt;
        },
        getIcon(resource) {
            switch (resource) {
                case 0: return '<img class="tnt_resource_icon" title="Wood" src="/cdn/all/both/resources/icon_wood.png">';
                case 1: return '<img class="tnt_resource_icon" title="Wine" src="/cdn/all/both/resources/icon_wine.png">';
                case 2: return '<img class="tnt_resource_icon" title="Marble" src="/cdn/all/both/resources/icon_marble.png">';
                case 3: return '<img class="tnt_resource_icon" title="Crystal" src="/cdn/all/both/resources/icon_crystal.png">';
                case 4: return '<img class="tnt_resource_icon" title="Sulfur" src="/cdn/all/both/resources/icon_sulfur.png">';
                case 'population': return '<img class="tnt_resource_icon" title="Population" src="//gf3.geo.gfsrv.net/cdn2f/6d077d68d9ae22f9095515f282a112.png" style="width: 10px;">';
                case 'citizens': return '<img class="tnt_resource_icon" title="Citizens" src="/cdn/all/both/resources/icon_population.png">';
            }
        }
    },
    citySwitcher: {
        updateAllCitiesResources() {
            // Check for existing update process
            const updateState = this.getUpdateState();
            if (updateState.inProgress) {
                const now = Date.now();
                const staleTimeout = 300000; // 5 minutes
                const recentCutoff = now - 3600000; // 1 hour

                // If update is recent (within last hour) and not stale (last action within 5 min)
                if (updateState.lastReload > recentCutoff &&
                    now - updateState.lastReload < staleTimeout) {
                    tnt.core.debug.log('Update already in progress and active, waiting...', 1);
                    return;
                }

                // Clear stale update state and restart
                tnt.core.debug.log('Clearing stale update state...', 1);
                this.clearUpdateState();
            }

            // Get and validate city list
            const cityList = Object.keys(tnt.get.cityList());
            if (!cityList.length) {
                tnt.core.debug.log('No cities found to update', 1);
                return;
            }

            // Initialize new update process
            const updateData = {
                cityList: cityList,
                index: 0,
                startCity: tnt.get.cityId(),
                lastReload: Date.now(),
                startTime: Date.now()
            };

            this.setUpdateState(updateData);
            localStorage.setItem('tnt_force_update', 'true');

            tnt.core.debug.log(`Starting update of ${cityList.length} cities...`, 1);
            setTimeout(() => this.gotoNextCityForUpdate(), 500);
        },

        getUpdateState() {
            const cityList = localStorage.getItem('tnt_city_update_list');
            const index = localStorage.getItem('tnt_city_update_index');
            const lastReload = localStorage.getItem('tnt_city_update_lastReload');
            const startTime = localStorage.getItem('tnt_update_start_time');

            return {
                inProgress: !!cityList,
                cityList: cityList ? JSON.parse(cityList) : [],
                index: parseInt(index || '0', 10),
                lastReload: parseInt(lastReload || '0', 10),
                startTime: parseInt(startTime || '0', 10)
            };
        },

        setUpdateState(state) {
            localStorage.setItem('tnt_city_update_list', JSON.stringify(state.cityList));
            localStorage.setItem('tnt_city_update_index', state.index.toString());
            localStorage.setItem('tnt_city_update_start', state.startCity || '');
            localStorage.setItem('tnt_city_update_lastReload', state.lastReload.toString());
            localStorage.setItem('tnt_update_start_time', state.startTime.toString());
        },

        updateCurrentState(updates) {
            const state = this.getUpdateState();
            this.setUpdateState({ ...state, ...updates });
        },

        clearUpdateState() {
            localStorage.removeItem('tnt_city_update_list');
            localStorage.removeItem('tnt_city_update_index');
            localStorage.removeItem('tnt_city_update_start');
            localStorage.removeItem('tnt_city_update_lastReload');
            localStorage.removeItem('tnt_force_update');
            localStorage.removeItem('tnt_update_start_time');
        },

        gotoNextCityForUpdate() {
            const state = this.getUpdateState();
            if (!state.inProgress) {
                tnt.core.debug.log('No update in progress', 1);
                return;
            }

            const now = Date.now();
            const timeout = 600000; // 10 minutes total timeout

            // Check for overall timeout
            if (now - state.startTime > timeout) {
                tnt.core.debug.log('Update process exceeded time limit, aborting...', 1);
                this.clearUpdateState();
                return;
            }

            // Check for individual city timeout
            if (now - state.lastReload > 60000) { // 1 minute per city timeout
                tnt.core.debug.log('City update timed out, moving to next...', 1);
                this.updateCurrentState({
                    index: state.index + 1,
                    lastReload: now
                });
                state.index++;
            }

            // Check if we're done
            if (state.index >= state.cityList.length) {
                this.finishUpdate();
                return;
            }

            const expectedCityId = state.cityList[state.index];
            const currentCityId = tnt.get.cityId();

            tnt.core.debug.log(`Processing city ${expectedCityId} (${state.index + 1}/${state.cityList.length})`, 1);

            if (currentCityId != expectedCityId) {
                this.navigateToCity(expectedCityId);
                return;
            }

            this.processCityUpdate(state.index, state.cityList);
        },

        navigateToCity(cityId) {
            tnt.core.debug.log(`Navigating to city ${cityId}...`, 1);
            localStorage.setItem('tnt_city_update_lastReload', Date.now().toString());

            setTimeout(() => {
                const url = new URL(window.location.href);
                url.searchParams.set('view', 'city');
                url.searchParams.set('cityId', cityId);
                window.location.href = url.toString();
            }, 1000);
        },

        processCityUpdate(index, cityList) {
            tnt.core.debug.log('Waiting for city to load...', 1);

            const waitForCity = (attempt = 0) => {
                // First check if page is still loading
                if ($("#locations").hasClass("loading")) {
                    if (attempt >= 30) { // 30 * 500ms = 15 seconds max wait
                        tnt.core.debug.log('City load timeout, moving to next...', 1);
                        this.moveToNextCity(index, cityList);
                        return;
                    }
                    setTimeout(() => waitForCity(attempt + 1), 500);
                    return;
                }

                // Now wait for city data to be available
                const cityId = tnt.get.cityId();
                if (!cityId || !ikariam.model.currentResources) {
                    if (attempt >= 30) {
                        tnt.core.debug.log('City data timeout, moving to next...', 1);
                        this.moveToNextCity(index, cityList);
                        return;
                    }
                    setTimeout(() => waitForCity(attempt + 1), 500);
                    return;
                }

                // Finally wait for buildings
                this.waitForBuildings(index, cityList);
            };

            waitForCity();
        },

        waitForBuildings(index, cityList, attempt = 0) {
            const $positions = $("div[id^='js_CityPosition']").filter(function () {
                return $(this).find('.level').length > 0;
            });

            const hasTownHall = $positions.toArray().some(el => {
                const classes = $(el).attr('class')?.split(/\s+/) || [];
                return classes.includes('townHall');
            });

            if ($positions.length > 0 && hasTownHall) {
                tnt.core.debug.log('Buildings detected, collecting data...', 1);
                this.handleCityData(index, cityList);
            } else if (attempt < 30) { // 30 * 500ms = 15 seconds max wait
                setTimeout(() => this.waitForBuildings(index, cityList, attempt + 1), 500);
            } else {
                tnt.core.debug.log('Building detection timeout, moving to next...', 1);
                this.moveToNextCity(index, cityList);
            }
        },

        handleCityData(index, cityList) {
            // Add delay before updating to ensure all data is loaded
            setTimeout(() => {
                tnt.resource.update();

                // Add extra delay after update to ensure data is saved
                setTimeout(() => {
                    index++;
                    if (index >= cityList.length) {
                        this.finishUpdate();
                        return;
                    }
                    this.moveToNextCity(index, cityList);
                }, 1500);
            }, 1000);
        },

        moveToNextCity(index, cityList) {
            localStorage.setItem('tnt_city_update_index', index.toString());
            localStorage.setItem('tnt_city_update_lastReload', Date.now().toString());

            // Add delay before navigation
            setTimeout(() => {
                const nextCityId = cityList[index];
                this.navigateToCity(nextCityId);
            }, 1000);
        },

        finishUpdate() {
            tnt.core.debug.log('Update complete, returning to start city...', 1);
            const startCityId = localStorage.getItem('tnt_city_update_start');
            const currentCityId = tnt.get.cityId();

            this.clearUpdateState();

            if (startCityId && currentCityId != startCityId) {
                this.navigateToCity(startCityId);
            }
        }
    },

    waitForCityBuildings: function (callback, maxAttempts = 20) {
        // Only run on city view
        if ($("body").attr("id") !== "city") return callback();

        let attempts = 0;

        const checkBuildings = () => {
            // Check for any city position divs
            const $positions = $("div[id^='js_CityPosition']");
            if ($positions.length) {
                // Get all building classes
                const buildingClasses = $positions.map(function () {
                    return $(this).attr('class') || '';
                }).get();

                // Check if we found any actual building classes
                const hasBuildings = buildingClasses.some(classes =>
                    classes.split(/\s+/).some(c =>
                        !c.startsWith('position') &&
                        !c.startsWith('level') &&
                        !c.startsWith('buildingGround') &&
                        !c.startsWith('constructionSite') &&
                        c !== 'building'
                    )
                );

                if (hasBuildings) {

                    callback();
                    return;
                }
            }

            attempts++;
            if (attempts >= maxAttempts) {
                tnt.core.debug.log('Max attempts reached waiting for buildings, continuing anyway...', 1);
                callback();
                return;
            }

            // Try again faster - reduce delay to 200ms
            setTimeout(checkBuildings, 200);
        };

        checkBuildings();
    },
    get: {
        playerId: function () { return parseInt(ikariam.model.avatarId); },
        cityId: function () { return ikariam.model.relatedCityData.selectedCity.replace(/[^\d-]+/g, ""); },
        cityLvl: function () { return $("#js_CityPosition0Level").text(); },
        cityIslandCoords: function () { return $("#js_islandBreadCoords").text(); },
        cityName: function (id) {
            return id ? ikariam.model.relatedCityData["city_" + id].name : $("#citySelect option:selected").text().split("] ")[1];
        },
        alliance: {

            Id: function () { return parseInt(ikariam.model.avatarAllyId); }
        },

        tradeShips: {
            free: function () { return $("#globalResources .transporters a span:eq(1)").text().split(" ")[0]; }
        },
        resources: {
            wood: function () { return ikariam.model.currentResources.resource; },
            wine: function () { return ikariam.model.currentResources[1]; },
            marble: function () { return ikariam.model.currentResources[2]; },
            crystal: function () { return ikariam.model.currentResources[3]; },
            sulfur: function () { return ikariam.model.currentResources[4]; }
        },
        population: function () { return ikariam.model.currentResources.population; },
        citizens: function () { return ikariam.model.currentResources.citizens; },
        producedTradegood: function () { return ikariam.model.producedTradegood; },
        tradegoodProduction: function () { return ikariam.model.tradegoodProduction; },
        resourceProduction: function () { return ikariam.model.resourceProduction; },
        ambrosia: function () { return ikariam.model.ambrosia; },
        gold: function () { return parseInt(ikariam.model.gold); },
        godGoldResult: function () { return ikariam.model.godGoldResult; },
        income: function () { return ikariam.model.income; },
        upkeep: function () { return ikariam.model.upkeep; },
        sciencetistsUpkeep: function () { return ikariam.model.sciencetistsUpkeep; },
        hasAlly: function () { return ikariam.model.hasAlly; },
        isOwnCity: function () { return ikariam.model.isOwnCity; },
        maxCapacity: function () { return ikariam.model.maxResources.resource; },
        wineSpending: function () { return ikariam.model.wineSpending; },
        cityList: function () {
            const cityList = {};
            for (const key in ikariam.model.relatedCityData) {
                if (key.startsWith("city_")) {
                    const cityId = key.replace("city_", "");
                    cityList[cityId] = {
                        name: ikariam.model.relatedCityData[key].name,
                        coordinates: ikariam.model.relatedCityData[key].coords
                    };
                }
            }
            return cityList;
        }
    },

    has: {
        construction: function () { return $('.constructionSite').length > 0; }
    },

    calc: {
        production: function (cityID, hours) {
            var city = tnt.data.storage.resources.city[cityID];
            if (city) {
                return {
                    wood: (city.resourceProduction * hours * 3600).toLocaleString(2),
                    wine: city.producedTradegood == 1 ? (city.tradegoodProduction * hours * 3600).toLocaleString(2) : 0,
                    marble: city.producedTradegood == 2 ? (city.tradegoodProduction * hours * 3600).toLocaleString(2) : 0,
                    crystal: city.producedTradegood == 3 ? (city.tradegoodProduction * hours * 3600).toLocaleString(2) : 0,
                    sulfur: city.producedTradegood == 4 ? (city.tradegoodProduction * hours * 3600).toLocaleString(2) : 0
                };
            } else {
                tnt.core.debug.log("City ID " + cityID + " not found in storage", 3);
                return { wood: 0, wine: 0, marble: 0, crystal: 0, sulfur: 0 };
            }
        }
    }
};

$(document).ready(() => tnt.core.init());

GM_addStyle(
    "/* Show level styles */\
    .tntLvl{\
        position:relative;\
        top:10px;\
        left:10px;\
        color:black;\
        line-height:13px;\
        background:gold;\
        font-size:9px;\
        font-weight:bold;\
        text-align:center;\
        vertical-align:middle;\
        height: 14px;\
        width: 14px;\
        border-radius: 50%;\
        border: 1px solid #000;\
        display: inline-block;\
    }\
    #tnt_resource_table{\
        border-collapse:collapse;\
        font: 12px Arial, Helvetica, sans-serif;\
    }\
    #tnt_resource_table td{\
        border:1px #000000 solid;\
        padding:2px!important;\
    }\
    #tnt_resource_table th{\
        border:1px #000000 solid;\
        padding:2px!important;\
        text-align:center;\
    }\
    #tnt_building_table{\
        border-collapse:collapse;\
        font: 12px Arial, Helvetica, sans-serif;\
    }\
    #tnt_building_table td{\
        border:1px #000000 solid;\
        padding:2px!important;\
    }\
    #tnt_building_table th{\
        border:1px #000000 solid;\
        padding:2px!important;\
        text-align:center;\
    }\
    .storage_min{\
        background-color: #FF000050;\
    }\
    .tnt_construction{\
        background-color: #80404050;\
    }\
    #tnt_resource_table tr.tnt_selected{\
        border:2px #000000 solid!important;\
    }\
    .tnt_resource_icon{\
        vertical-align:middle;\
        width:18px;\
        height:16px;\
        display:inline-block;\
    }\
    .tnt_building_icon {\
        width: 36px !important;\
        height: 32px !important;\
    }\
    img[src*='/city/wall.png'].tnt_building_icon {\
        transform: scale(0.8) !important;\
        transform-origin: 0 0;\
        margin-right: -8px;\
    }\
    .tnt_population{ text-align:right; }\
    .tnt_citizens{ text-align:right; }\
    .tnt_wood{ text-align:right; }\
    .tnt_marble{ text-align:right; }\
    .tnt_wine{ text-align:right; }\
    .tnt_crystal{ text-align:right; }\
    .tnt_sulfur{ text-align:right; }\
    #mainview a:hover{ text-decoration:none; }\
    #tntOptions {\
        position:absolute;\
        top:40px;\
        left:380px;\
        width:620px;\
        border:1px #755931 solid;\
        border-top:none;\
        background-color: #FEE8C3;\
        padding:10px 10px 0px 10px;\
    }\
    #tntOptions legend{ font-weight:bold; }\
    .tntHide, #infocontainer .tntLvl, #actioncontainer .tntLvl{ display:none; }\
    #tntInfoWidget {\
        position:fixed;\
        bottom:0px;\
        left:0px;\
        width:716px;\
        background-color: #DBBE8C;\
        z-index:100000000;\
    }\
    #tntInfoWidget .accordionTitle {\
        background: url(/cdn/all/both/layout/bg_maincontentbox_header.jpg) no-repeat;\
        padding: 6px 0 0;\
        width: 728px;\
    }\
    #tntInfoWidget .accordionContent {\
        background: url(/cdn/all/both/layout/bg_maincontentbox_left.png) left center repeat-y #FAF3D7;\
        overflow: hidden;\
        padding: 0;\
        position: relative;\
        width: 725px;\
    }\
    #tntInfoWidget .scroll_disabled {\
        background: url(/cdn/all/both/layout/bg_maincontentbox_left.png) repeat-y scroll left center transparent;\
        width: 9px;\
    }\
    #tntInfoWidget .scroll_area {\
        background: url(/cdn/all/both/interface/scroll_bg.png) right top repeat-y transparent;\
        display: block;\
        height: 100%;\
        overflow: hidden;\
        position: absolute;\
        right: -3px;\
        width: 24px;\
        z-index: 100000;\
    }\
    .txtCenter{ text-align:center; }\
    .tnt_center{ text-align:center; white-space:nowrap; }\
    .tnt_right{ text-align:right; white-space:nowrap; }\
    .tnt_left{ text-align:left; white-space:nowrap; }\
    .tnt_bold{ font-weight:bold; }\
    #tnt_info_resources{\
        position:fixed;\
        bottom:20px;\
        left:0px;\
        width:auto;\
        height:auto;\
        background-color: #DBBE8C;\
        z-index:100000000;\
    }\
    #tnt_info_resources .tnt_back, #tnt_info_resources .tnt_foreward {\
        background: url(/cdn/all/both/interface/window_control_sprite.png) no-repeat scroll transparent;\
        cursor: pointer;\
        display: block!important;\
        height: 18px;\
        width: 18px;\
    }\
    #tnt_info_resources .tnt_back {\
        left: 2px;\
        position: absolute;\
        top: 2px;\
        background-position: -197px 0;\
    }\
    #tnt_info_resources .tnt_back:hover {\
        background-position: -197px -18px;\
    }\
    #tnt_info_resources .tnt_foreward {\
        left: 2px;\
        position: absolute;\
        top: 3px;\
        background-position: -197px 0;\
        transform: rotate(180deg);\
    }\
    #tnt_info_resources .tnt_foreward:hover {\
        background-position: -197px -18px;\
    }\
    #tnt_info_updateCities {\
        position:fixed;\
        bottom:20px;\
        right:0px;\
        width:auto;\
        height:auto;\
        background-color: #DBBE8C;\
        z-index:100000000;\
    }\
    #tnt_info_resources .tnt_refresh {\
        background: url(/cdn/all/both/interface/window_control_sprite.png) no-repeat scroll transparent;\
        cursor: pointer;\
        display: block!important;\
        height: 18px;\
        width: 18px;\
        background-position: -179px 0;\
        background-color: #DBBE8C;\
    }\
    #tnt_info_resources .tnt_refresh:hover {\
        background-position: -179px -18px;\
    }\
    .tnt_panel_minimize_btn {\
        background: url(/cdn/all/both/interface/window_control_sprite.png) no-repeat scroll transparent;\
        cursor: pointer;\
        display: block!important;\
        height: 18px;\
        width: 18px;\
        position: absolute;\
        left: 2px;\
        top: 2px;\
        z-index: 10;\
    }\
    .tnt_panel_minimize_btn.tnt_back { background-position: -197px 0; }\
    .tnt_panel_minimize_btn.tnt_back:hover { background-position: -197px -18px; }\
    .tnt_panel_minimize_btn.tnt_foreward { background-position: -197px 0; transform: rotate(180deg); top: 3px; }\
    .tnt_panel_minimize_btn.tnt_foreward:hover { background-position: -197px -18px; }\
    .tnt_table_toggle_btn {\
        background: url(/cdn/all/both/interface/window_control_sprite.png) no-repeat scroll transparent;\
        cursor: pointer;\
        display: inline-block;\
        height: 18px;\
        width: 18px;\
        vertical-align: middle;\
        float: right;\
        margin-left: 6px;\
        background-position: -179px 0;\
    }\
    .tnt_table_toggle_btn:hover { background-position: -179px -18px; }\
    .tnt_city .tnt_panel_minimize_btn { float: left; margin-right: 2px; }\
    #tnt_info_resources.minimized {\
        width: 20px!important;\
        min-width: 20px!important;\
        max-width: 20px!important;\
        overflow: hidden!important;\
    }\
    #tnt_military_overview {\
        position: fixed;\
        top: 20px;\
        right: 0px;\
        width: auto;\
        background-color: #DBBE8C;\
        z-index: 100000000;\
    }\
    #tnt_military_header {\
        padding: 5px;\
        cursor: pointer;\
        font-weight: bold;\
    }\
    #tnt_military_table {\
        border-collapse: collapse;\
        font: 12px Arial, Helvetica, sans-serif;\
    }\
    #tnt_military_table td, #tnt_military_table th {\
        border: 1px #000000 solid;\
        padding: 2px !important;\
    }\
    .movement {\
        padding: 3px;\
        margin: 2px 0;\
    }\
    .movement.attack {\
        background-color: rgba(255,0,0,0.2);\
    }\
");
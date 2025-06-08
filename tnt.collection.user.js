// ==UserScript==
// @name         TNT Collection
// @version      1.4.176
// @namespace    tnt.collection
// @author       Ronny Jespersen
// @description  TNT Collection of Ikariam enhancements to enhance the game
// @license      MIT
// @include		 http*s*.ikariam.*/*
// @exclude		 http*support*.ikariam.*/*
// @require	     https://code.jquery.com/jquery-1.12.4.min.js
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_log
// @grant GM_xmlhttpRequest
// @downloadURL https://github.com/TheNorthman/ikariam.user.js/raw/refs/heads/main/tnt.collection.user.js
// @updateURL https://github.com/TheNorthman/ikariam.user.js/raw/refs/heads/main/tnt.collection.user.js
// ==/UserScript==

// Define constants for URLs
const VERSION_URL = "http://ikariam.rjj-net.dk/scripts/tnt.Collection/version.php";
const UPDATE_URL = "http://ikariam.rjj-net.dk/scripts/tnt.Collection/update.php";
const UPDATE_HQ_URL = "http://lazy.rjj-net.dk/tnt/ikariam/hq/update";

let tnt_autoUpdateInterval = null;

// Used to select all units when pillaging
// function delay(time) {
//     return new Promise(resolve => setTimeout(resolve, time));
// }

var tnt = {

    version: GM_info.script.version,

    url: {
        versionUrl: VERSION_URL,
        updateUrl: UPDATE_URL,
        update: UPDATE_HQ_URL
    },

    console: {
        log: console.log,
        dir: console.dir
    },

    settings: {
        dev: true,
        debug: {
            enable: true,
            level: 5,
            timer: {
                enable: true
            }
        }
    },

    data: {
        test: {},

        ikariam: {
            subDomain: location.toString().split('.')[0].split('//')[1],

            url: {
                notification: {
                    defaultPicture: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/mayor_premium.png",
                    mayor: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/mayor.png",
                    mayor_premium: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/mayor_premium.png",
                    general: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/general.png",
                    general_premium: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/general_premium.png",
                    general_alert: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/general_premium_alert.png",
                    scientist: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/scientist.png",
                    scientist_premium: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/scientist_premium.png",
                    diplomat: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/diplomat.png",
                    diplomat_premium: "https://" + location.toString().split('.')[0].split('//')[1] + ".ikariam.gameforge.com/cdn/all/both/layout/advisors/diplomat_premium.png"
                }
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
                city: {}
            }
        },
    },

    images: {},

    core: {

        init: function () {
            tnt.core.debug.log("TNT Collection v" + tnt.version + " - Init...");

            // Init Storage as the first thing
            tnt.core.storage.init();

            // Resource
            tnt.resource.update();
            tnt.resource.events();

            // Notification
            tnt.core.notification.init();

            // Events
            tnt.core.events.init();

            // Options
            tnt.core.options.init();

            // Version check // TODO: JSON don't work
            // tnt.checkVersion();

            // Info box // TODO: Not Used
            // tnt.core.info.init();

            // Do ALL the items that needs to be done on every page
            tnt.all();

            // Do the items regarding the current page
            switch ($("body").attr("id")) {
                case "island": tnt.island(); break;
                case "city": tnt.city(); break;
                case "worldmap_iso": tnt.world(); break;
            }


            // Continue city switching if needed (for updateAllCitiesResources)
            if (localStorage.getItem('tnt_city_update_list')) {
                setTimeout(() => {
                    // Optionally call tnt.resource.update(); here if needed
                    setTimeout(() => {
                        tnt.citySwitcher.gotoNextCityForUpdate();
                    }, 100);
                }, 200);
            }

            // --- Auto-update all city resources every hour ---
            if (tnt_autoUpdateInterval) {
                clearInterval(tnt_autoUpdateInterval);
            }
            tnt_autoUpdateInterval = setInterval(() => {
                tnt.citySwitcher.updateAllCitiesResources();
            }, 60 * 60 * 1000); // 1 hour in milliseconds

            // TODO Don't work. Try to append script tag witht the code and see if that will work
            // tnt.alrtSound.play();
        },

        ajax: {
            send: function (data, url = tnt.url.update, callback = null) {
                tnt.core.debug.log('Data length: ' + JSON.stringify(data).length, 3);
                GM_xmlhttpRequest({
                    url: url,
                    method: 'POST',
                    data: "data=" + encodeURIComponent(JSON.stringify(data)),
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    onload: function (response) {
                        tnt.core.debug.dir(response.responseText, 5);
                        if (callback) {
                            callback();
                        }
                    }
                });
            }
        },

        debug: {

            log: function (value, level = 1) {
                if (tnt.settings.debug.enable && tnt.settings.debug.level > level) { GM_log(value); }
            },

            dir: function (value, level = 1) {
                if (tnt.settings.debug.enable && tnt.settings.debug.level > level) { GM_dir(value); }
            },

            timer: {

                start: function (label) {
                    if (tnt.settings.debug.timerenable && tnt.settings.debug.enable) { console.time(label); }
                },

                end: function (label) {
                    if (tnt.settings.debug.timerenable && tnt.settings.debug.enable) { console.timeEnd(label); }
                }
            }
        },

        utils: {
            index: function (obj, path, value = undefined) {
                if (typeof path === 'string') {
                    return tnt.core.utils.index(obj, path.split('.'), value);
                }

                if (path.length === 1) {
                    return value !== undefined ? (obj[path[0]] = value) : obj[path[0]];
                }

                return tnt.core.utils.index(obj[path[0]], path.slice(1), value);
            },
            index2: function (obj, is, value) {
                if (typeof is == 'string') {
                    return tnt.core.utils.index(obj, is.split('.'), value);
                } else if (is.length == 1 && value !== undefined) {
                    return obj[is[0]] = value;
                } else if (is.length == 0) {
                    return obj;
                } else {
                    return tnt.core.utils.index(obj[is[0]], is.slice(1), value);
                }
            },

            delay: function (time) {
                return new Promise(resolve => setTimeout(resolve, time));
            },

            getGradientColor: function (value1, value2, color1, color2) {
                // Defaults colors if not set
                color1 = color1 || "#ff0000";
                color2 = color2 || "#00FF00";

                // Ensure value1 is not greater than value2
                if (value1 > value2) {
                    [value1, value2] = [value2, value1];
                }

                // Convert hex colors to RGB
                function hexToRgb(hex) {
                    const bigint = parseInt(hex.substring(1), 16);
                    return {
                        r: (bigint >> 16) & 255,
                        g: (bigint >> 8) & 255,
                        b: bigint & 255
                    };
                }

                // Convert RGB back to hex
                function rgbToHex(r, g, b) {
                    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
                }

                const color1Rgb = hexToRgb(color1);
                const color2Rgb = hexToRgb(color2);
                const ratio = value1 / value2;
                const r = Math.round(color1Rgb.r * ratio + color2Rgb.r * (1 - ratio));
                const g = Math.round(color1Rgb.g * ratio + color2Rgb.g * (1 - ratio));
                const b = Math.round(color1Rgb.b * ratio + color2Rgb.b * (1 - ratio));

                return rgbToHex(r, g, b);
            },

                        getHighestValue: function (key, obj) {
                            let highest = Number.NEGATIVE_INFINITY;

                            for (let city in obj) {
                                if (obj[city][key] > highest) {
                                    highest = obj[city][key];
                                }
                            }

                            return highest;
                        }

        },

        storage: {

            init: function () {
                // Merge storage
                tnt.data.storage = $.extend(true, {}, tnt.data.storage, JSON.parse(localStorage.getItem("tnt_storage")));
                var ikaTweaks = JSON.parse(localStorage.getItem("ikaTweaks_"));
                tnt.data.ikaTweaks = ikaTweaks ? ikaTweaks : {};
                //console.dir(tnt.data.ikaTweaks);
            },

            get: function (group, name) {
                return tnt.data.storage[group][name];
            },

            set: function (group, name, value) {
                tnt.data.storage[group][name] = value;
                tnt.core.storage.save();
            },

            save: function () {
                localStorage.setItem("tnt_storage", JSON.stringify(tnt.data.storage));
            }
        },

        notification: {
            init: function () {
                if (Notification && Notification.permission !== "granted") {
                    Notification.requestPermission();
                }
            },

            notifyMe: function (title, message, picture) {
                // TODO: Make it work again
                return;

                // Play sound ?
                if (GM_getValue("notificationSound", true)) {
                    tnt.core.debug.log('Play sound!', 5);
                    // tnt.sounds.snd.play();
                }

                // Do we have Notification
                if (!Notification) {
                    // TODO something to show in tntInfo when that is up  and running
                    alert("This browser don't support desktop notifications. Update to a modern browser or disable the notifications.");
                    return;
                }

                picture = picture ? picture : tnt.settings.notification.defaultPicture;

                // ask for permission to speak
                if (Notification.permission !== "granted") {
                    Notification.requestPermission();
                } else {
                    var notification = new Notification(title, {
                        // notification icon, should be replaced with the correct advisor later
                        icon: picture,
                        body: message,
                    });
                    // kill notifications 700 ms after their birth
                    setTimeout(function () { notification.close(); }, 7000);
                    // if user shows affection for notify, let notify do them a last service before it dies prematurely.
                    notification.onclick = function () {
                        window.open("http://" + tnt.data.ikariam.subDomain + ".ikariam.gameforge.com/index.php");
                    }

                    tnt.core.debug.log("Notification send: " + title, 3);
                }
            },

            check: function () {
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

            init: function () {
                tnt.core.events.ikariam.override();
            },

            ikariam: {

                override: function () {

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
                }
            }
        },

        options: {

            init: function () {

                if (GM_getValue("version") != tnt.version) { tnt.core.options.setup(); }

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

            setup: function () {
                /* Set/Upgrade default values */
                GM_setValue("allRemovePremiumOffers", GM_getValue("allRemovePremiumOffers", true));
                GM_setValue("allRemoveFooterNavigation", GM_getValue("allRemoveFooterNavigation", true));
                GM_setValue("allChangeNavigationCoord", GM_getValue("allChangeNavigationCoord", true));
                GM_setValue("islandShowCityLvl", GM_getValue("islandShowCityLvl", true));
                GM_setValue("cityRemoveFlyingShop", GM_getValue("cityRemoveFlyingShop", true));
                GM_setValue("cityShowResources", GM_getValue("cityShowResources", true));
                GM_setValue("notificationAdvisors", GM_getValue("notificationAdvisors", true));
                GM_setValue("notificationSound", GM_getValue("notificationSound", true));
                GM_setValue("version", tnt.version);
            }
        },

        info: {
            // TODO: Not used!
            init: function () {
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

        checkVersion: function () {
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

    all: function () {
        // Remove premium offers
        if (GM_getValue("allRemovePremiumOffers")) {
            tnt.core.debug.log("Adding allRemovePremiumOffers styles...", 5);
            GM_addStyle("\
                #premium_btn,\
                .premiumOfferBox,\
                .premiumOffer,\
                .expandable.resourceShop,\
                .expandable.slot1,\
                #transport .premiumTransporters, #transport .buildingDescription\
                {\
                    display:none!important;\
                    height:0!important;\
                }\
                #resource #setWorkers .content,\
                #tradegood #setWorkers .content\
                {min-height:180px;}\
            ");

            // Need to be done after loading event of dialogs to be finished
            $("form#ambrosiaDonateForm").closest('li').hide();
        }

        if (GM_getValue("allRemoveFooterNavigation")) {
            $('#footer').hide();
        }
    },

    island: function () {
        // Show level for cities on Island
        if (GM_getValue("islandShowCityLvl")) {
            tnt.core.debug.log("Show level for cities on island view", 5);
            $(".cityLocation").each(function () {
                // Extract the level number using a regular expression
                var classList = $(this).attr('class');
                var levelMatch = classList.match(/level(\d+)/);
                if (levelMatch) {
                    var levelNumber = levelMatch[1];
                    // Append the level number to the corresponding element
                    $("#" + this.id + " > a").append('<span class="tntLvl" style="top:35px; left:25px;">' + levelNumber + '</span>');
                }
            });
        }
    },

    city: function () {
        // Remove Flying Shop
        if (GM_getValue("cityRemoveFlyingShop")) {
            tnt.core.debug.log("Remove flying shop on city view", 5);
            GM_addStyle("#cityFlyingShopContainer{display:none;};");
        }
    },

    world: function () { },

    resource: {
        events: function () {
            $('#tnt_info_resources .tnt_back').on('click', function () {
                tnt.resource.toggle(this);
            });
            $('#tnt_info_resources .tnt_refresh').on('click', function () {
                tnt.citySwitcher.updateAllCitiesResources();
            });

            // Remove previous click handlers to avoid duplicates
            $('#tnt_toggle_table').off('click').on('click', function () {
                // Toggle between resource and building tables
                var $buildings = $('#tnt_info_buildings_content');
                var $resources = $('#tnt_resource_table').closest('div'); // resource table is inside #tnt_info_resources_content
                var $btn = $(this);

                if ($buildings.is(':visible')) {
                    $buildings.hide();
                    $resources.show();
                    $btn.removeClass('active');
                } else {
                    $resources.hide();
                    $buildings.show();
                    $btn.addClass('active');
                }
            });

            // Also bind the toggle button in the building table (since it is re-rendered)
            $(document).on('click', '#tnt_building_table #tnt_toggle_table', function () {
                var $buildings = $('#tnt_info_buildings_content');
                var $resources = $('#tnt_resource_table').closest('div');
                var $btn = $(this);

                if ($resources.is(':visible')) {
                    $resources.hide();
                    $buildings.show();
                    $btn.addClass('active');
                    // Fix: Show the minimize button in the building table header
                    $('#tnt_panel_minimize_btn_building_header').show();
                } else {
                    $buildings.hide();
                    $resources.show();
                    $btn.removeClass('active');
                    // Fix: Show the minimize button in the resource table header
                    $('#tnt_panel_minimize_btn_header').show();
                }
            });

            // Simplified minimize panel logic
            $(document).off('click', '.tnt_panel_minimize_btn').on('click', '.tnt_panel_minimize_btn', function () {
                var $panel = $('#tnt_info_resources');
                var $btn = $(this);
                if ($btn.hasClass('tnt_back')) {
                    $btn.removeClass('tnt_back').addClass('tnt_foreward');
                    $panel.css({
                        width: '20px',
                        minWidth: '20px',
                        maxWidth: '20px',
                        overflow: 'hidden'
                    });
                    // Only hide the content, not set display:none (so the button stays visible)
                    $panel.find('#tnt_info_resources_content, #tnt_info_buildings_content').css('visibility', 'hidden');
                } else {
                    $btn.removeClass('tnt_foreward').addClass('tnt_back');
                    $panel.css({
                        width: '',
                        minWidth: '',
                        maxWidth: '',
                        overflow: ''
                    });
                    $panel.find('#tnt_info_resources_content, #tnt_info_buildings_content').css('visibility', 'visible');
                    // Show the correct table after reopening
                    if ($('#tnt_toggle_table').hasClass('active')) {
                        $('#tnt_info_buildings_content').show();
                        $('#tnt_info_resources_content').hide();
                    } else {
                        $('#tnt_info_resources_content').show();
                        $('#tnt_info_buildings_content').hide();
                    }
                }
            });

            // Remove previous click handlers for panel toggle and add new
            $(document).off('click', '.tnt_panel_minimize_btn').on('click', '.tnt_panel_minimize_btn', function () {
                var $btn = $(this);
                var $content = $('#tnt_info_resources_content');
                var $buildings = $('#tnt_info_buildings_content');
                var $resources = $('#tnt_resource_table').closest('div');
                // If panel is open, close it
                if ($btn.hasClass('tnt_back')) {
                    $btn.removeClass('tnt_back').addClass('tnt_foreward');
                    $content.css({
                        width: '25px',
                        overflow: 'hidden',
                        minHeight: '30px',
                        minWidth: '25px'
                    });
                    $buildings.hide();
                    $resources.hide();
                    // Keep the minimize button visible by ensuring it is not hidden
                } else {
                    // If panel is closed or not set, open it
                    $btn.removeClass('tnt_foreward').addClass('tnt_back');
                    $content.css({
                        width: 'auto',
                        overflow: 'auto',
                        minHeight: '',
                        minWidth: ''
                    });
                    // Show the correct table after reopening
                    if ($('#tnt_toggle_table').hasClass('active')) {
                        $buildings.show();
                        $resources.hide();
                    } else {
                        $buildings.hide();
                        $resources.show();
                    }
                }
            });

            // Table toggle (right side, in table header)
            $(document).off('click', '.tnt_table_toggle_btn').on('click', '.tnt_table_toggle_btn', function () {
                var $buildings = $('#tnt_info_buildings_content');
                var $resources = $('#tnt_resource_table').closest('div');
                var $btn = $(this);

                if ($buildings.is(':visible')) {
                    $buildings.hide();
                    $resources.show();
                } else {
                    $resources.hide();
                    $buildings.show();
                    $btn.addClass('active');
                }
            });

            // Always set correct class for toggle button after render
            // REMOVE this block: it incorrectly adds tnt_back/tnt_foreward to the toggle button
            /*
            setTimeout(function () {
                var $btn = $('.tnt_table_toggle_btn');
                var $content = $('#tnt_info_resources_content');
                if ($btn.length) {
                    if ($content.width() <= 30) {
                        $btn.removeClass('tnt_back').addClass('tnt_foreward');
                    } else {
                        $btn.removeClass('tnt_foreward').addClass('tnt_back');
                    }
                }
            }, 0);
            */
            // Refresh button
            $('#tnt_info_resources .tnt_refresh').on('click', function () {
                tnt.citySwitcher.updateAllCitiesResources();
            });
        },

        update: function () {
            tnt.data.storage.resources.city[tnt.get.cityId()] = {
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
                hasConstruction: $("body").attr("id") == "city" ? tnt.has.construction() : tnt.data.storage.resources.city[tnt.get.cityId()].hasConstruction,
                resourceProduction: tnt.get.resourceProduction(),
                tradegoodProduction: tnt.get.tradegoodProduction()
            };
            if (tnt.get.cityLvl().length) {
                tnt.data.storage.resources.city[tnt.get.cityId()].cityLvl = tnt.get.cityLvl();
            } else if ($("body").attr("id") == "city" && tnt.data.storage.resources.city[tnt.get.cityId()].hasConstruction) {
                tnt.data.storage.resources.city[tnt.get.cityId()].cityLvl = $('#js_CityPosition0Link').attr('title').replace(/[^\d-]+/g, "");
            } else {
                tnt.data.storage.resources.city[tnt.get.cityId()].cityLvl = tnt.data.storage.resources.city[tnt.get.cityId()].cityLvl;
            };

            var total = {
                population: 0,
                citizens: 0,
                wood: 0,
                wine: 0,
                marble: 0,
                crystal: 0,
                sulfur: 0,
            };

            // Calculate the total resources
            $.each(tnt.data.storage.resources.city, function (index, value) {
                total.population += value.population;
                total.citizens += value.citizens;
                total.wood += value.wood;
                total.wine += value.wine;
                total.marble += value.marble;
                total.crystal += value.crystal;
                total.sulfur += value.sulfur;
            });

            tnt.data.storage.resources.total = total;

            // Save storage
            tnt.core.storage.save();

            // Update template
            tnt.resource.show();
        },

        show: function () {
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
                $.each(tnt.resource.sortCities(), function (index,cityID) {
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
                    { key: 'townHall', name: 'Town Hall', icon: '/cdn/all/both/img/city/townhall_l.png' },
                    { key: 'palace', name: 'Palace', icon: '/cdn/all/both/img/city/palace_l.png' },
                    { key: 'palaceColony', name: 'Governor\'s Residence', icon: '/cdn/all/both/img/city/palaceColony_l.png' },
                    { key: 'museum', name: 'Museum', icon: '/cdn/all/both/img/city/museum_l.png' },
                    { key: 'tavern', name: 'Tavern', icon: '/cdn/all/both/img/city/taverne_l.png' },
                    { key: 'academy', name: 'Academy', icon: '/cdn/all/both/img/city/academy_l.png' },
                    { key: 'workshop', name: 'Workshop', icon: '/cdn/all/both/img/city/workshop_l.png' },
                    { key: 'temple', name: 'Temple', icon: '/cdn/all/both/img/city/temple_l.png' },
                    { key: 'warehouse', name: 'Warehouse', icon: '/cdn/all/both/img/city/warehouse_l.png' },
                    { key: 'dump', name: 'Dump', icon: '/cdn/all/both/img/city/dump_l.png' },
                    { key: 'port', name: 'Trading Port', icon: '/cdn/all/both/img/city/port_l.png' },
                    { key: 'tradingPost', name: 'Trading Post', icon: '/cdn/all/both/img/city/branchoffice_l.png' },
                    { key: 'shipyard', name: 'Shipyard', icon: '/cdn/all/both/img/city/shipyard_l.png' },
                    { key: 'barracks', name: 'Barracks', icon: '/cdn/all/both/img/city/barracks_l.png' },
                    { key: 'wall', name: 'Wall', icon: '/cdn/all/both/img/city/wall.png' }, // Fixed: wall.png
                    { key: 'embassy', name: 'Embassy', icon: '/cdn/all/both/img/city/embassy_l.png' },
                    // Branch Office and Trading Post are the same building in Ikariam, so only one is needed.
                    // { key: 'branchOffice', name: 'Branch Office', icon: '/cdn/all/both/img/city/branchoffice_l.png' },
                    { key: 'safehouse', name: 'Safehouse', icon: '/cdn/all/both/img/city/safehouse_l.png' },
                    { key: 'carpentering', name: 'Carpenter', icon: '/cdn/all/both/img/city/carpentering_l.png' },
                    { key: 'forester', name: 'Forester', icon: '/cdn/all/both/img/city/forester_l.png' },
                    { key: 'stonemason', name: 'Stonemason', icon: '/cdn/all/both/img/city/stonemason_l.png' },
                    { key: 'glassblowing', name: 'Glassblower', icon: '/cdn/all/both/img/city/glassblowing_l.png' },
                    { key: 'winegrower', name: 'Winegrower', icon: '/cdn/all/both/img/city/winegrower_l.png' },
                    { key: 'alchemist', name: 'Alchemist', icon: '/cdn/all/both/img/city/alchemist_l.png' },
                    { key: 'fireworker', name: 'Firework Test Area', icon: '/cdn/all/both/img/city/fireworker_l.png' }
                    // Add more if needed
                ];

                var buildingTable = '<table id="tnt_building_table" border="1">\
                    <tr>\
                        <th class="tnt_center tnt_bold">\
                            <span class="tnt_panel_minimize_btn tnt_back" id="tnt_panel_minimize_btn_building_header" style="float:left;"></span>\
                            <span id="tnt_toggle_table" class="tnt_table_toggle_btn active" title="Show Resources"></span> City\
                        </th>';

                buildingColumns.forEach(function (b) {
                    buildingTable += '<th class="tnt_center tnt_bold"><img class="tnt_resource_icon tnt_building_icon" title="' + b.name + '" src="' + b.icon + '"></th>';
                });

                buildingTable += '</tr>';

                // Add city rows (no panel/minimize button in city rows)
                $.each(tnt.resource.sortCities(), function (index, cityID) {
                    buildingTable += '<tr>\
                        <td class="tnt_city tnt_left">' + tnt.get.cityName(cityID) + '</td>';
                    buildingColumns.forEach(function () {
                        buildingTable += '<td class="tnt_building_level"></td>';
                    });
                    buildingTable += '</tr>';
                });

                buildingTable += '</table>';

                $('#tnt_info_buildings_content').html(buildingTable);
            }
        },

        toggle: function (el) {
            // No longer used, logic moved to .tnt_toggle_panel_btn click handler
        },

        sortCities: function () {
            var list = {};
            $.each(tnt.data.storage.resources.city, function (cityID, value) {
                list[cityID] = value.producedTradegood;
            });

            // Define the custom order for producedTradegood
            var order = { 2: 0, 1: 1, 3: 2, 4: 3 };

            // Sort list by producedTradegood with custom order
            var sortedList = Object.keys(list).sort(function (a, b) {
                return order[list[a]] - order[list[b]];
            });

            return sortedList;
        },

        checkMinMax: function (city, resource) {
            if (GM_getValue("cityShowResources")) {
                //var city = tnt.data.storage.resources.city[cityID];
                var max = city.max;
                var txt = '';

                switch (resource) {
                    case 0:
                        // Wood
                        if (city.wood > (max*.8)) { txt += ' storage_danger'; }
                        if (city.wood < 100000) { txt += ' storage_min'; }
                        break;
                    case 1:
                        // Wine
                        if (city.wine > (max*.8)) { txt += ' storage_danger'; }
                        if (city.wine < 100000) { txt += ' storage_min'; }
                        break;
                    case 2:
                        // Marble
                        if (city.marble > (max*.8)) { txt += ' storage_danger'; }
                        if (city.marble < 50000) { txt += ' storage_min'; }
                        break;
                    case 3:
                        // Crystal
                        if (city.crystal > (max*.8)) { txt += ' storage_danger'; }
                        if (city.crystal < 50000) { txt += ' storage_min'; }
                        break;
                    case 4:
                        // Sulfur
                        if (city.sulfur > (max*.8)) { txt += ' storage_danger'; }
                        if (city.sulfur < 50000) { txt += ' storage_min'; }
                        break;
                }

                return txt;
            }
        },

        getIcon: function (resource) {
            switch (resource) {
                case 0:
                    return '<img class="tnt_resource_icon" title="Wood" src="/cdn/all/both/resources/icon_wood.png">';
                case 1:
                    return '<img class="tnt_resource_icon" title="Wine" src="/cdn/all/both/resources/icon_wine.png">';
                case 2:
                    return '<img class="tnt_resource_icon" title="Marble" src="/cdn/all/both/resources/icon_marble.png">';
                case 3:
                    return '<img class="tnt_resource_icon" title="Crystal" src="/cdn/all/both/resources/icon_crystal.png">';
                case 4:
                    return '<img class="tnt_resource_icon" title="Sulfur" src="/cdn/all/both/resources/icon_sulfur.png">';
                case 'population':
                    return '<img class="tnt_resource_icon" title="Population" src="//gf3.geo.gfsrv.net/cdn2f/6d077d68d9ae22f9095515f282a112.png" style="width: 10px;">';
                case 'citizens':
                    return '<img class="tnt_resource_icon" title="Citizens" src="/cdn/all/both/resources/icon_population.png">';
            }
        }
    },

    citySwitcher: {
        updateAllCitiesResources: function () {
            const cityList = Object.keys(tnt.get.cityList());
            if (!cityList.length) return;
            localStorage.setItem('tnt_city_update_list', JSON.stringify(cityList));
            localStorage.setItem('tnt_city_update_index', '0');
            // Store the starting city ID
            localStorage.setItem('tnt_city_update_start', tnt.get.cityId());
            // Immediately go to the first city (if not already there)
            if (cityList[0] !== tnt.get.cityId()) {
                const url = new URL(window.location.href);
                url.searchParams.set('view', 'city');
                url.searchParams.set('cityId', cityList[0]);
                window.location.href = url.toString();
            } else {
                tnt.citySwitcher.gotoNextCityForUpdate();
            }
        },

        gotoNextCityForUpdate: function () {
            const cityList = JSON.parse(localStorage.getItem('tnt_city_update_list') || '[]');
            let index = parseInt(localStorage.getItem('tnt_city_update_index') || '0', 10);

            if (!cityList.length) return;

            // If we're not on the correct city, switch to it and return
            const expectedCityId = cityList[index];
            if (tnt.get.cityId() != expectedCityId) {
                const url = new URL(window.location.href);
                url.searchParams.set('view', 'city');
                url.searchParams.set('cityId', expectedCityId);
                window.location.href = url.toString();
                return;
            }

            // Update index for next city
            index++;
            localStorage.setItem('tnt_city_update_index', index.toString());

            if (index >= cityList.length) {
                // Get the starting city ID
                const startCityId = localStorage.getItem('tnt_city_update_start');
                // Clean up
                localStorage.removeItem('tnt_city_update_list');
                localStorage.removeItem('tnt_city_update_index');
                localStorage.removeItem('tnt_city_update_start');
                // Go back to the starting city if available
                if (startCityId && tnt.get.cityId() != startCityId) {
                    const url = new URL(window.location.href);
                    url.searchParams.set('view', 'city');
                    url.searchParams.set('cityId', startCityId);
                    window.location.href = url.toString();
                }
                return;
            }

            // Go to the next city
            const nextCityId = cityList[index];
            if (nextCityId && tnt.get.cityId() != nextCityId) {
                const url = new URL(window.location.href);
                url.searchParams.set('view', 'city');
                url.searchParams.set('cityId', nextCityId);
                window.location.href = url.toString();
            }
        },
    },

    get: {
        playerId: function () { return parseInt(ikariam.model.avatarId); },
        // islandId: function () { return $("#changeCityForm .viewIsland a").attr("href").split("=")[2]; },
        cityId: function () { return ikariam.model.relatedCityData.selectedCity.replace(/[^\d-]+/g, "") },
        cityLvl: function () { return $("#js_CityPosition0Level").text(); },
        cityIslandCoords: function () { return $("#js_islandBreadCoords").text(); },
        cityName: function (id) { return id ? ikariam.model.relatedCityData["city_" + id].name : $("#citySelect option:selected").text().split("] ")[1]; },
        alliance: {
            Id: function () { return parseInt(ikariam.model.avatarAllyId); },
        },
        tradeShips: {
            free: function () { return $("#globalResources .transporters a span:eq(1)").text().split(" ")[0]; },
            // all: function () { return $("#globalResources .transporters a span:eq(1)").text().split(" ")[1].replace(/[^\d-]+/g, ""); }
        },
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
        resources: {
            wood: function () { return ikariam.model.currentResources.resource },
            wine: function () { return ikariam.model.currentResources[1]; },
            marble: function () { return ikariam.model.currentResources[2]; },
            crystal: function () { return ikariam.model.currentResources[3]; },
            sulfur: function () { return ikariam.model.currentResources[4]; }
        },
        // data: {
        //     townHall: function () {
        //         var townHall = {
        //         };
        //     },
        // }.
        // actionPoints: function () { return $("#value_maxActionPoints").text(); },
        population: function () { return ikariam.model.currentResources.population; },
        citizens: function () { return ikariam.model.currentResources.citizens; },
        producedTradegood: function () { return ikariam.model.producedTradegood; },
        tradegoodProduction: function () { return ikariam.model.tradegoodProduction; },
        resourceProduction: function () { return ikariam.model.resourceProduction; },
        realHour: function () { return ikariam.model.realHour; },
        serverName: function () { return ikariam.model.serverName; },
        serverTime: function () { return ikariam.model.serverTime; },
        nextETA: function () { return ikariam.model.nextETA; },

        // cityList: function () {
        //     get.tmp = { cityList: {} };
        //     $("#citySelect option").each(function () {
        //         var _v1 = $(this).attr("value");
        //         get.tmp.cityList[_v1] = {
        //             name: $(this).text().split("] ")[1],
        //             coords: tnt.getXY($(this).text())
        //         };
        //     });
        //     return get.tmp.cityList;
        // },
        cityList: function () {
            const cityList = {};
            for (const key in ikariam.model.relatedCityData) {
                if (key.startsWith("city_")) {
                    const cityId = key.replace("city_", "");
                    cityList[cityId] = {
                        name: ikariam.model.relatedCityData[key].name,
                        coordinates: ikariam.model.relatedCityData[key].coords // or .coordinates if that's the property
                    };
                }
            }
            return cityList;
        },

        p: {
            options: {
                playerId: function () { return $("#options_debug table td:eq(0)").text().replace(/[^\d-]+/g, ""); },
                playerName: function () { return $('#options_userData input[name="name"]').val(); }
            },
            island: {
                islandId: function () {
                    var islandCoords = tnt.getXY($("#breadcrumbs span.island").text());
                    return tnt.data.map[islandCoords.x][islandCoords.y][0];
                },
                playerId: function (el) { return $(".cityinfo .owner a.messageSend", el).length ? parseInt($(".cityinfo .owner a.messageSend", el).attr("href").split("&")[1].split("=")[1]) : get.playerId(); },
                playerName: function (el) { return $(".cityinfo .owner", el).text().split(" ")[1]; },
                alliance: function (el) { return $(".cityinfo .ally a:eq(0)", el).text(); },
                cityId: function (el) { return $("a:eq(0)", el).attr("id").replace(/[^\d-]+/g, ""); },
                cityName: function (el) { return $(".cityinfo .name:eq(0)", el).text().split(": ")[1]; },
                cityLevel: function (el) { return $(".cityinfo .citylevel", el).text().replace(/[^\d-]+/g, ""); },
                totalScore: function (el) { return $(".cityinfo .name:eq(1)", el).text().replace(/[^\d-]+/g, ""); }
            }
        }
    },

    has: {
        construction: function (el) {
            return $('.constructionSite').length > 0 ? true : false;
        }
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
                return {
                    wood: 0,
                    wine: 0,
                    marble: 0,
                    crystal: 0,
                    sulfur: 0
                };
            }
        }
    },

    view: {
        city: function (cityID) {
            $('div#dropDown_js_citySelectContainer li[selectValue="' + cityID + '"]').trigger('click');
        }
    },

    template: {
        resources: '<div id="tnt_info_resources">\
                        <div id="tnt_info_resources_content"></div>\
                        <div id="tnt_info_buildings_content" style="display:none;"></div>\
                    </div>'
    }
};

$(document).ready(function () {
    tnt.core.init();
});

// General styles
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
    }\
    #tnt_info_resources .tnt_refresh {\
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
    .tnt_city .tnt_panel_minimize_btn { float:left; margin-right:2px; }\
    #tnt_info_resources.minimized {\
        width: 20px !important;\
        min-width: 20px !important;\
        max-width: 20px !important;\
        overflow: hidden !important;\
    }\
"
);

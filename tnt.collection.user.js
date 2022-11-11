// ==UserScript==
// @name         TNT Collection
// @version      1.2
// @namespace    tnt.collection
// @author       Ronny Jespersen
// @description  TNT Collection of Ikariam enhancements to enhance the game
// @include		 http*s*.ikariam.*/*
// @exclude		 http*support*.ikariam.*/*
// @require	     https://code.jquery.com/jquery-1.12.4.min.js
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// ==/UserScript==
//
// Features:
//   Shortcut to mills and mines from the city resources
//   Show building levels in city
//   Show city, mill and mine levels on island view
//   Remove the horizontal scrollbar
//   Automatic search for upgrades

var tnt = {

    version: "1.2",
    versionUrl: "http://ikariam.rjj-net.dk/scripts/tnt.Collection/version.php",
    debug: false,

    init: function () {

        tnt.debug("log", "TNT Collection - Init...");
        tnt.debug("log", tnt.versionUrl);

        if (GM_getValue("version") != tnt.version) { tnt.setup(); }

        tnt.options();
        //tnt.checkVersion();
        tnt.all();

        switch ($("body").attr("id")) {
            case "island": tnt.island(); break;
            case "city": tnt.city(); break;
            case "tavern": tnt.tavern(); break;
            case "resource": tnt.resource(); break;
            case "tradegood": tnt.tradegood(); break;
            case "academy": tnt.academy(); break;
            case "changeResearch": tnt.changeResearch(); break;
            case "barracks": tnt.barracks(); break;
            case "shipyard": tnt.shipyard(); break;
        }

    },

    debug: function (type, value) {
        if (tnt.debug) {
            switch (type) {
                case "log": console.log(value); break;
                case "dir": console.dir(value); break;
            }
        }
    },

    setup: function () {
        /* Set/Upgrade default values */
        GM_setValue("allRemoveScrollbar", GM_getValue("allRemoveScrollbar", true));
        GM_setValue("allResourceShortcuts", GM_getValue("allResourceShortcuts", true));
        GM_setValue("allRemoveAdBanners", GM_getValue("allRemoveAdBanners", true));
        GM_setValue("islandShowResourceLvl", GM_getValue("islandShowResourceLvl", true));
        GM_setValue("islandShowCityLvl", GM_getValue("islandShowCityLvl", true));
        GM_setValue("cityShowBuildingLvl", GM_getValue("cityShowBuildingLvl", true));
        GM_setValue("version", tnt.version);

    },

    options: function () {
        /* Add option link, option box and eventlisteners */
        $("#GF_toolbar ul").append('\
            <li>\
                <a id="tntOptionsLink" href="javascript:void(0);">TNT Options v' + tnt.version + '</a>\
                <div id="tntOptions" class="tntBox" style="display:none;">\
                    <div id="tntUpdateLine" align="center" style="padding-bottom:5px;">\
                        <a id="tntColUpgradeLink" class="tntHide" href="" style="color:blue;font-size:12px;">Version <span id="tntColVersion"></span> is available. Click here to update now!</a>\
                    </div>\
                    <div>\
                        <div style="float:left;width:50%;">\
                            <legend>All:</legend>\
                            <input id="tntAllRemoveAdBanners" type="checkbox"' + (GM_getValue("allRemoveAdBanners") ? ' checked="checked"' : '') + ' /> Remove Ad Banners<br/>\
                        </div>\
                        <div style="float:left;width:50%;">\
                            <legend>Islands:</legend>\
                            <input id="tntIslandShowCityLvl" type="checkbox"' + (GM_getValue("islandShowCityLvl") ? ' checked="checked"' : '') + ' /> Show Town Levels on Islands<br/>\
                        </div>\
                    </div>\
                    <div align="center">\
                        <input id="tntOptionsClose" type="button" class="button" value="Close" />\
                    </div>\
                </div>\
            </li>\
		');
        $("#tntOptionsLink").bind("click", function () {
            $("#tntOptions").slideToggle();
        });
        $("#tntAllRemoveAdBanners").bind("change", function () {
            GM_setValue("allRemoveAdBanners", (GM_getValue("allRemoveAdBanners") ? false : true));
        });
        $("#tntIslandShowCityLvl").bind("change", function () {
            GM_setValue("islandShowCityLvl", (GM_getValue("islandShowCityLvl") ? false : true));
        });
        $("#tntOptionsClose").bind("click", function () {
            $("#tntOptions").slideToggle();
        });
    },

    checkVersion: function () {
        GM_xmlhttpRequest({
            url: tnt.versionUrl,
            method: 'GET',
            headers: { 'Content-type': 'application/x-www-form-urlencoded' },
            onload: function (response) {
                console.dir(response);
                if (response.responseText.split("&")[0].split("=")[1] != tnt.version) {
                    $("#tntOptionsLink").css("color", "darkred");
                    $("#tntColVersion").html(response.responseText.split("&")[0].split("=")[1]);
                    $("#tntColUpgradeLink").attr("href", response.responseText.split("&")[1].split("=")[1]).removeClass("tntHide");
                }
            }
        });
    },

    all: function () {
        // Remove ad banners
        if (GM_getValue("allRemoveAdBanners")) {
            GM_addStyle(".mainContent div.center{display:none;}");
        }
    },

    island: function () {
        /** Show level for cities on Island */
        if (GM_getValue("islandShowCityLvl")) {
            $(".cityLocation").each(
                function () {
                    if (this.classList[2].replace(/[^\d-]+/g, "")) {
                        $("#" + this.id + " > a").append('<span class="tntLvl" style="top:35px; left:25px;">' + this.classList[2].replace(/[^\d-]+/g, "") + '</span>');
                    }
                }
            );
        }

    },

    city: function () {
        // Remove Flying Shop
        GM_addStyle("#cityFlyingShopContainer{display:none;};");
    },

};

tnt.init();

// General styles
GM_addStyle("\
        /* Show level styles */\
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
        .tnt_wood{\
            top:19px;\
            left:12px;\
        }\
        .tnt_marble{\
            top:25px;\
            left:30px;\
        }\
        .tnt_wine{\
            top:15px;\
            left:40px\
        }\
        .tnt_crystal{\
            top:17px;\
            left:18px;\
        }\
        .tnt_sulfur{\
            top:20px;\
            left:34px;\
        }\
        #mainview a:hover{\
            text-decoration:none;\
        }\
        .tntHide,\
            #infocontainer .tntLvl, #actioncontainer .tntLvl{\
            display:none;\
        }\
        #tntOptions {\
            position:absolute;\
            top:40px;\
            left:380px;\
            width:620px;\
            border:1px #755931 solid;\
            border-top:none;\
            background-color:#FEE8C3;\
            background:#DBBE8C url(/skin/layout/bg_stone.jpg) repeat scroll center top;\
            padding:10px 10px 0px 10px;\
        }\
        #tntOptions legend{\
            font-weight:bold;\
        }\
        .txtCenter{\
            text-align:center;\
        }\
    ");
// General styles - END
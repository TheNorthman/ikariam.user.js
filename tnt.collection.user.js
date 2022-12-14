// ==UserScript==
// @name         TNT Collection
// @version      1.3.1
// @namespace    tnt.collection
// @author       Ronny Jespersen
// @description  TNT Collection of Ikariam enhancements to enhance the game
// @include		 http*s*.ikariam.*/*
// @exclude		 http*support*.ikariam.*/*
// @require	     https://code.jquery.com/jquery-1.12.4.min.js
// @grant GM_info
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_xmlhttpRequest
// ==/UserScript==

var ik = ikariam;
var cc = ik.currentCity;
// var re = cc.resources;

var tnt = {

    version: GM_info.script.version,

    url: {
        versionUrl: "http://ikariam.rjj-net.dk/scripts/tnt.Collection/version.php",
        updateUrl: "http://ikariam.rjj-net.dk/scripts/tnt.Collection/update.php",
        update: "http://lazy.rjj-net.dk/tnt/ikariam/hq/update"
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
            }
        }
    },

    sounds: {
        alertSound: new Audio("data:audio/mp3;base64,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/XQ0F5IZ02SDoNlsXoeUtnOLbFEXPeZyydac5R4ySMgFRpZijAjMEkby8yvS9fsyJVr8bzaHFxIkF0O9NftowAAG2uAwICBf/96y9dX//f////tv7e/+/9W/b9vovRv//r/+1nnrkVMjMzVFIgmgHTwRdQIlAAyUDA5pbQ+V2HSjkOppxxr7OYFZdMwI9A0xjAbYgFQApwAAiFgGTFHBs6HHAs4sYN3CGhlg4GKSBhfQhAwCRMcZoXCkLmUQw2JlEvmlNNkqDmK5eeyLMkhNWWmbIoLdkGRQW7XuzKX+hbbdKr2UdmzXPrUgaVCgAAUC0UAADf//p//Tr////Sn////97//p/2////////uSZEwAA8VDVcViQAIyTXidoIgAW60vPvm9gABsgCODACAA///pbb89r0MikIjvGBqdRZ1ETgQAAAAAAAADhnMGRtyGYweHciRtAUcKNGGGgsPrDm7rAjBAgGLsJPmMhgqFFwVUzGQAyVyMGBDeZAGGJhxAb2jiVQZ8VmDQJEvGpRYFPTERBQUyUOL1DSuCQoaMDHhMlDkdDBwctGXoL5EIit1nLdV2gIcCCYcB1TszTtTe0+DjVmuSFsinTCVUGGs+aekMvGM3PjsPOSzGGX/k8itdaQuloUGu9ZjcFVuxavjjrs1jqzOSiP3pTupUqy6bpN3Zmr//VjjWZuig/v///8thqJz3////0s1dd/pU3/u6f////////+v2f//+XMfA6H/F1pN//hYSf/jzygAAYAAAImCEhz0feHViByqpZUsyg6zqBqru2XRcFL1IlLD5DUjhVONqVDYZyqGAhyqLqBdAIRxJEekhJ0sr1Wq2NBTqGoay0Yk891bf9rWrr+2/mvrX4tv1/9t+sF7aJQVBUGgaiUFn/lg5wad8SgqCo//7kmQ5D/OLLctnYeAAMMAYjeAIAIAAAaQAAAAgAAA0gAAABOt21ttt0CYKwoDQlBUFQVOlQViXxYGj3EQNA0e1A19YK1/EQNf/lf//5Y9wa//+CtVMQU1FMy45OS4zVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU="),
        snd: new Audio("data:audio/mp3;base64,//twxAAAApgBJvQAACQeQig/N0AAMALwgABhhYOBj/9HKO//rP////+poeCChCTJxBRDqeKhViMBG5NphGYEhIOmsib8o0yAygkLQnmx8G9MQBk+Aclq7KI+AMUMBQIBggIBoAcA7CaD5wMkAEIQDgYhOAuEJwiC4NjYGSDAYQMAwIBtmfAzIAAKi50nyJnQMKJAUHiFAMWBEfA1HgYQGBjDIocDDBSfImg5fUAMMChcAAIA0AFJBiQUomOEWcTpXqRNyuzni4OQJ0AyoUScnCJmQhECFgBlzA1RmU99WKmK0HYICCcDMcBiX2QJpRsXlJJa121bJ3pmm6jXj06h9f//y4iXyQHLHGVSLoDjD8AsoAKDixmKCUySTU6yiVADRYNtiS////9NZmb////qUoxV78cARkYopP/7YMQDgA1JjWX9hQAhvzHr/ZS1pK7anGYiDqr1UxQhjpcCoh6idFnGnsvpvWPDT2NTnnDRmU182ANJTTUOuUNH7foYaN/eeQGETZ2rsT+hxEEklNf6Zkz2Kj5SRPup1aexy22dDjTjjTqLrnL72uyf///800WX5TvxyBrekwvel0KqDmNnTlcBF1RIqgtZWKNoSFvp20BJooqyMHJLNz31apKtL3tTLC5P+kZIore11qJYb1JP1spHr1omR6i2s1CANnNlt9FR/frXSb/TWyfqdR7mXfU+UnzrpP6C2Q/1v/1V/1VEfxa85QBIeSwnsbZLoIbvK1MSIB2b5D07Th1QKyxJ0f/7UMQOgA0ZjVXstVKhhyiqPaZBXJVVkle5lWbaK1b1a35iMhFSCeqwDhbbWgjsqq+qCyBEaxraxcIAmyDqgim+cC2wzJP9R831NkZb/Ne39+Rt/qSdP60N/7f9P+rSTlozFEDZ5VC+eLB4mUMHUUEIUEIkdwUEoEA5+wy3wwQYkGK7bY8reosf1rM0fzi0grn9Vq0jJNkT7KSdA2W9/pNzP0S6ztWkaBvJFzUuo2+tFv9aP/1f/R/6iK6Sn/NjDP/+tWqzACZVRBaLgCXt1vP/+1DEBoAMQY9J7Q5u4ZQx6D3GTWR6gOMcDa8HIS9IIcnunIasSf2mhmYpWwTjMrky4NW7JOEkUQFQGro6SKqHdA+ip2QU6/dFuUP/WgTYt5eTb+6SLJdJbOaoW/6//q/9//t/////6RQQSXAAA4ckDkukGyw01RHtOQEgdpAcA08jAA6OIH0ODAVnj6yNw4PwqQN9q2039dPdBjIbY+gPNTJFukgyTVF4wQU11XW//Kf/qUYiok43/Wt1sh7JIt/7P/6bf60P/r/////9ZZZY//tgxACADQmNQe4ybOF4saj9o0mVcQAVR2AFU6IfJ/3VfZkJfZuKAIHAIwOTDg5DDAstVxpaOx29PFPWyqVpSisfXwvboITo9EeBg0RVk+ya12VNi+z2u//zD/pGhKFkNCD6ls67p2XrX71TD2/1f/Rb/Wv/7/////+YlhaogBFiCIXryQapNO2uxIsxARyxIQrCKqzkwGdswguYFnWTCQhOE0k7KrS63nT5cCcsvWt0aLugPE4kpTTJ7+3WTf/UkdHSKRHNL697/+90////7/+r///////siaqKf6AOlIAkX0DpSGgeFRwqFVSWFL+nCpzQMCwdWtAsuh1UdjCzAWMzSWbW//tAxBUADcWPP6xxSelMoym9kbYU8rP4fzf8tXI7TQaCQ52/3VizlEqOMeaWtnI515irURH/YlFULkbhAcvnM1KbqYpIh3/6t/xeII//kxb///////i8oay9YoAewxkP6/MSWQ0kXUsBybaDU7bEKRhRwZBdy6jwypun5tl3oMmzbvf4yMwAdN1qUpJDQaWGxUpO13/9Rv/1OiXxihwIr9v/2////zz+v///5Ko4cwAFVQADK7T/+1DEBIAMuY0/7HJpKWux6H2pHhwbrhBrPFFxhBKMREeIBbDzGRCJzJFZc6hp6unct1cYfnZ1GdRQqRMp08O4BmxXPOtVSFJTnWMzpr5t/+r/zQmj4XPEgWl+vvXdnpG9L///6mf/Ut///////9ayBDUmQABVTIhZLointyNsykyIRRo0BgULXTQYFHX2ma0Aw1utZi3KLqoJTrqqdJzrGoI4KqcxWQ1jLqVQaEjND2t/1/9xxQAR8yj539e5d////7v/0///////9hq1SJQA//tQxAGADA2PQezySKFlHCf9tE2kBDQiFW/UJJbfRkYgEBMIoUYYsfMoI5cCSgMOdRX5NI6RayZdM8i1M1nTI0eg5gtEmAD7Sear0e60kTExVzXX/0P+pNMiozo7092/9mrUr///9aj/+r///////6jyJPIAAESAALp4xU+lk6TIkRQKTB4OGjA3Q4OZLnNZjVKHSwrBJ5mnY/kXIvgxBaBoBwEVJz2q1G6Bgz623QrSbqL//UaD7MR7FvP7etL1+eM2f+G/EP///xRCOHAABP/7UMQCAAt4uT3s8mkhdDGn/bHKFFUQBq+iKWo0tORDMAILzLsKwGbyd9KwYM2aT9hr8C09rTl2N2OV6bVnVI3PMkiOcBxes0fU+10CYL5dU7Vn222fzD/0yiVByCefpStmlNzf+T8h///8RkjihAANkMAf3xijxh5yS2xig20oMFQUImFLJ+EEDhlp0ZpodtYxK67NokopEkp1O2kbD7AhCdf/UiYFg0tu3s3yZ/8wIwWoRoQw9/V31d1K////Tf/V///////9zqYngAADRhD/+1DEAwAKdRk97HInIXexp72eQSQNa+YwzfxnZaQ1xawDriwSCxqOAKsFAxy6SvGJ+pU6+GjVCaKWa1v1prUdKABHQN1aq/lpAzf//6v/WZFIvv/7t69tD///5ih6P///oNlDEAAbIAC+fkFnTZVHFOyqIVAwKkhsbMB5khiRGWa/Uth6cv7qP/YsayxslW60c+6SSAB8Txotalb9ycmDIVdrdT6k//SWUhYTdP7X2X6qm9X//+tv9bf///////MaBYAAAzIQFOdIP+RvILA8//tQxAeADMGPN+4abuFnsWe9njUlWHjUx4mGKAOYMYJmipCgPUOcGGoBpps7BLQqKas5ffPSZ2RYUKAew6aJZYQSoWMTU+n/2WpjI9SMEGT/1oniSJx/1Wrf1VL+j//+p2/1///////+ozOLN4AAATUmJ6vsLW30YGDBDDhXgAQVRmZ0eMNIsNF7xS3OdwqZzH0kpq39KdNlpUj2cNQEmimtBzjJU3Y6kcLje3+2pf/1GBKDw//uhv////7/+r///////zMfNnAAAYMoDteAP//7UMQFAAqUvT3uPU1hXDGnvbYpdClsNLlBoCaSHAoDBowqYDqKjAQqVy/UZZq7b08XpKb3bVJYvlfzX+5r5kbgYES2O2mo3MH9P/20Mr/yAWgK4EJb0dR6z//////xITwAAKsxo298AcwdtiBacxAQZ2EDgsMhWBP/vAEFgAEM4E0qGZPdC1nnOvkSqdf+Z2Gm28DLrupU3GexeSf/1ZqLb/qVDMY/r/7p7a/////////////YsieQAAJnRiaTgD9wE1UqAwqDFjSDJb0w4Lz/+0DEDIAK2Y097j1LoT8XZ722NWT1AwEiKI0jVU6d6hZMC01GuN4T23zanrH+dNYzolflTcyyDrl79//0/+VJAMK/6/2RF/T////////////+XJ6AAA4YyHdeAM+vk24kMBy2+RERgYiAsAZbqiECAqSko9O2oghmPkH3inWt13besyRBQFjvrX9R9Ro3//qR/9bCyC+Ek7uncmAP//////k6XwADthG9vAGWnTWgmmFilgzAAf/7UMQJgAqguTus8ilhgRcmdZ7Q3Kwadp784CRHW5C5yB7FPT6fXdzGtzV2K60611JutAgQF6QV7JsV03z5w+Yl9C9X/9D/5gbC3kKY+dFdtf//////FBMAAFABP7QBhjLoZSGMItOY4hTDIFTDgzTi5MDDoES3yxXelsuxUiR01OmSdjbNrUlrUVSTBFPGUPajxut9RxJRozLpIqsvrTW8ze39ReGNImKOY25ePKE2v//////4omoFgAABZSIf9oAx6/jOzBAIMRiVQADEMIH/+1DEDAALnLs17iZNIdAx5SntKXyRgJYHdpCYWBCx4YlZARqBgnJzM24ytZml3+vUGnB/CDiRa6Bk19lmhmW1K02dVegp2agn7fMyYHOGE3FE7v//////6jZoAWATwoAZ3HxaM1UsAAEADIBAwMDsCgwiQyDUXCbMJ0AYHNQwMr1vopPzdyU9yz+9+8vksP73+pzOpKxUAdwaLGYXhUrySerZbwzgsFBgmjkeOyqUoa1DTppt1P/mjIGBO/9fddbV/////////////yIdLw2A//tgxAEADIWPK67RUqF9lyV1rs0cAvkAPGkBa5A7yL3GgARLJioMVgZMFl1MZogMDArEIDJotycGPTLQ3MVSyv1eR+s1j+Sb62YyHyI+Co4QoaPs/yomlXORc1zDW+bp/6sIMFRZ/p/p6f//+31f////////8oYFgADrAF6mALG4g+4MIGFbiIYZsuIwJ0JB+QeoYaAkC6tDfvJPyx0JXRyFJ3ZZoOdGuPT51aluEhgZ6BiU0Wmxs3sWVGtdNSbqSS3dXrW6n/yNICe75+P1o//////8SuUGgAK2ET1gAWe42mIgoBJemJwMY3ChjN5H9ZyYrCheFYzkhUc2ZVArHNr2lMt4//tAxBcADHmNLa4yjSGfsaX1wrcUgkb9nY6BKhogCpQFgBE0DAzMHZVbEaV6Oqp0VJWVVTW2/q9R4UYt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")
    },

    images: {

    },

    core: {

        init: function () {

            // var data = JSON.parse(JSON.stringify('{ "work": true, "send": function (value) { tnt.core.debug.dir(tnt); } }'));
            // console.dir(data);
            // tnt.data.storage.dc = JSON.parse(data);
            // console.dir(tnt.data.storage);
            // console.dir(tnt.data.test);
            // tnt.data.test.send("Hello");
            tnt.core.debug.log("TNT Collection v" + tnt.version + " - Init...");

            // Storage
            tnt.core.storage.init();


            // Notification
            tnt.core.notification.init();

            // Events
            tnt.core.events.init();

            // Options
            tnt.core.options.init();

            // Version check // TODO: JSON don't work
            // tnt.checkVersion();

            // Info box // TODO: Needs a lot of work done on this
            // tnt.core.info.init();

            // Do ALL the items that needs to be done on every page
            tnt.all();

            // Do the items regarding the current page
            switch ($("body").attr("id")) {
                case "island": tnt.island(); break;
                case "city": tnt.city(); break;
                case "worldmap_iso": tnt.world(); break;
            }

            // TODO Don't work. Try to append script tag witht the code and see if that will work
            // tnt.alrtSound.play();

            var data = { "notification": { "cities": false, "military": false }, "dc": { "send": function () { alert("tnt"); } } };
            // localStorage.setItem("tnt.test", JSON.stringify(data));
            // tnt.test = $.JSON.parse(localStorage.getItem("tnt.test"));
            // tnt.test = $.parseJSON (data);
            // console.dir(tnt.test);
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
                if (tnt.settings.debug.enable && tnt.settings.debug.level > level) { console.log(value); }
            },

            dir: function (value, level = 1) {
                if (tnt.settings.debug.enable && tnt.settings.debug.level > level) { console.dir(value); }
            },

            timer: {

                start: function (label) {
                    if (tnt.settings.debug.timerenable && tnt.settings.debug.enable) { console.time(label); }
                },

                end: function () {
                    if (tnt.settings.debug.timerenable && tnt.settings.debug.enable) { console.timeEnd(label); }
                }
            }
        },

        utils: {
            index: function (obj, is, value) {
                if (typeof is == 'string')
                    return tnt.core.utils.index(obj, is.split('.'), value);
                else if (is.length == 1 && value !== undefined)
                    return obj[is[0]] = value;
                else if (is.length == 0)
                    return obj;
                else
                    return tnt.core.utils.index(obj[is[0]], is.slice(1), value);
            }
        },

        storage: {

            init: function () {
                tnt.data.storage = JSON.parse(GM_getValue("tntStorage", JSON.stringify(tnt.data.storage)));
            },

            get: function (group, name) {
                return tnt.data.storage[group][name];
            },

            set: function (group, name, value) {
                tnt.data.storage[group][name] = value;
                GM_setValue("tntStorage", JSON.stringify(tnt.data.storage));
            }
        },

        notification: {
            init: function () {
                if (Notification && Notification.permission !== "granted") {
                    Notification.requestPermission();
                }
            },

            notifyMe: function (title, message, picture) {

                // Play sound ?
                if (GM_getValue("notificationSound", true)) {
                    tnt.core.debug.log('Play sound!', 5);
                    tnt.sounds.snd.play();
                }

                // Do we have Notification
                if (!Notification) {
                    // TODO something to show in tntInfo when that is up  and running
                    alert("This browser don't support desktop notifications. Update to a modern browser or disable the notifications.");
                    return;
                }

                picture = picture ? picture : tnt.settings.notification.defaultPicture;

                // ask for permission to speak
                if (Notification.permission !== "granted")
                    Notification.requestPermission();
                else {
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
                if ($('#js_GlobalMenu_cities').is(".normalactive, .premiumactive") && !tnt.core.storage.get('notification', 'cities')) {
                    tnt.core.notification.notifyMe(
                        "Ikariam",
                        "Something happened in one of your towns!",
                        tnt.data.ikariam.url.notification.mayor_premium
                    );
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
                    }

                    // updateBackgroundData
                    ajax.Responder.tntUpdateBackgroundData = ajax.Responder.updateBackgroundData;
                    ajax.Responder.updateBackgroundData = function (response) {
                        var view = $('body').attr('id');
                        tnt.core.debug.log("updateBackgroundData (View: " + view + ")");

                        // Let Ikariam do its stuff
                        ajax.Responder.tntUpdateBackgroundData(response);

                        // Check notifications
                        tnt.core.notification.check();

                        switch (view) {
                            case "worldmap_iso":
                                console.log($('div.islandTile div.cities'));
                                var totalCities = 0;
                                $('div.islandTile div.cities').each(function () {
                                    totalCities += parseInt($(this).text());
                                });
                                console.log(totalCities);
                                break
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
                                tnt.core.debug.log($('#merchantNavy .pulldown .btn'));
                                $('#merchantNavy .pulldown .btn').trigger("click");
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
                                <div style="float:left;width:50%;">\
                                    <legend>All:</legend>\
                                    <input id="tntAllRemovePremiumOffers" type="checkbox"' + (GM_getValue("allRemovePremiumOffers") ? ' checked="checked"' : '') + ' /> Remove Premium Offers<br/>\
                                    <input id="tntAllRemoveFooterNavigation" type="checkbox"' + (GM_getValue("allRemoveFooterNavigation") ? ' checked="checked"' : '') + ' /> Remove footer navigation<br/>\
                                    <input id="tntAllChangeNavigationCoord" type="checkbox"' + (GM_getValue("allChangeNavigationCoord") ? ' checked="checked"' : '') + ' /> Make footer navigation coord input a number<br/>\
                                </div>\
                                <div style="float:left;width:50%;">\
                                    <legend>Notifications:</legend>\
                                    <input id="tntNotificationAdvisors" type="checkbox"' + (GM_getValue("notificationAdvisors") ? ' checked="checked"' : '') + ' /> Show notifications from Advisors<br/>\
                                    <input id="tntNotificationSound" type="checkbox"' + (GM_getValue("notificationSound") ? ' checked="checked"' : '') + ' /> Play sound with notifications from Advisors<br/>\
                                </div>\
                                <div style="float:left;width:50%;">\
                                    <legend>Islands:</legend>\
                                    <input id="tntIslandShowCityLvl" type="checkbox"' + (GM_getValue("islandShowCityLvl") ? ' checked="checked"' : '') + ' /> Show Town Levels on Islands<br/>\
                                </div>\
                                <div style="float:left;width:50%;">\
                                    <legend>City:</legend>\
                                    <input id="tntCityRemoveFlyingShop" type="checkbox"' + (GM_getValue("cityRemoveFlyingShop") ? ' checked="checked"' : '') + ' /> Remove flying shop<br/>\
                                </div>\
                                <div style="float:left;width:50%;">\
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
                $("#tntCityRemoveFlyingShop").bind("change", function () {
                    GM_setValue("cityRemoveFlyingShop", (GM_getValue("cityRemoveFlyingShop") ? false : true));
                });
                $("#tntNotificationAdvisors").bind("change", function () {
                    GM_setValue("notificationAdvisors", (GM_getValue("notificationAdvisors") ? false : true));
                });
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
                GM_setValue("notificationAdvisors", GM_getValue("notificationAdvisors", true));
                GM_setValue("notificationSound", GM_getValue("notificationSound", true));
                GM_setValue("version", tnt.version);
            }
        },

        info: {

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
                .mainContent div.center,\
                #militaryAdvisor #militaryMovements + .contentBox01h,\
                #transport #setPremiumTransports\
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
                if (this.classList[2].replace(/[^\d-]+/g, "")) {
                    $("#" + this.id + " > a").append('<span class="tntLvl" style="top:35px; left:25px;">' + this.classList[2].replace(/[^\d-]+/g, "") + '</span>');
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

    get: {
        playerId: function () { return $.cookie("ikariam").split("_")[0]; },
        islandId: function () { return $("#changeCityForm .viewIsland a").attr("href").split("=")[2]; },
        cityId: function () { return $("#citySelect option:selected").attr("value").replace(/[^\d-]+/g, ""); },
        cityName: function () { return $("#citySelect option:selected").text().split("] ")[1]; }, /* TODO: Need to change this to handle pages where the coordinates aren't shown. */
        tradeShips: {
            free: function () { return $("#globalResources .transporters a span:eq(1)").text().split(" ")[0]; },
            all: function () { return $("#globalResources .transporters a span:eq(1)").text().split(" ")[1].replace(/[^\d-]+/g, ""); }
        },
        ambrosia: function () { return $("#globalResources .ambrosia a span:eq(1)").text().replace(/[^\d-]+/g, ""); },
        gold: function () { return $("#globalResources .gold").attr("title").replace(/[^\d-]+/g, ""); },
        maxCapacity: function () { return cc.maxCapacity.wood; },
        resources: {
            wood: function () { return re.wood; },
            wine: function () { return re.wine; },
            marble: function () { return re.marble; },
            crystal: function () { return re.crystal; },
            sulfur: function () { return re.sulfur; }
        },
        actionPoints: function () { return $("#value_maxActionPoints").text(); },
        population: {
            free: function () { return $("#value_inhabitants").text().split(" ")[0]; },
            all: function () { return $("#value_inhabitants").text().split(" ")[1].replace(/[^\d-]+/g, ""); }
        },
        cityList: function () {
            get.tmp = { cityList: {} };
            $("#citySelect option").each(function () {
                var _v1 = $(this).attr("value");
                get.tmp.cityList[_v1] = {
                    name: $(this).text().split("] ")[1],
                    coords: tnt.getXY($(this).text())
                };
            });
            return get.tmp.cityList;
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
    }
};

tnt.core.init();

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
    #tntOptions {\
        position:absolute;\
        top:40px;\
        left:380px;\
        width:620px;\
        border:1px #755931 solid;\
        border-top:none;\
        background-color:#FEE8C3;\
        //background:#DBBE8C url(/skin/layout/bg_stone.jpg) repeat scroll center top;\
        padding:10px 10px 0px 10px;\
    }\
    #tntOptions legend{\
        font-weight:bold;\
    }\
    .tntHide,\
    #infocontainer .tntLvl, #actioncontainer .tntLvl{\
        display:none;\
    }\
    #tntInfoWidget {\
        position:fixed;\
        bottom:0px;\
        left:0px;\
        width:716px;\
        background-color:#DBBE8C;\
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
    .txtCenter{\
        text-align:center;\
    }\
");
// General styles - END


// v3 (c) Yvonne P.
function LocalStorageHandler(tag) {
    var data = JSON.parse(localStorage.getItem(tag)) || {
        storedKeys: {},
    };
    function unsetItem(k1) {
        var s = {};
        forEach(data.storedKeys, (_, k) => {
            if (k1 !== k) {
                s[k] = data.storedKeys[k];
            }
        });
        if (data) {
            data.storedKeys = s;
        }
        localStorage.setItem(tag, JSON.stringify(data));
    }
    function setItem(k) {
        if (data) {
            data.storedKeys[tag] = Date.now();
            data.storedKeys[k] = Date.now();
        }
        localStorage.setItem(tag, JSON.stringify(data));
    }
    this.drop = function (key) {
        key = tag + key;
        localStorage.removeItem(key);
        unsetItem(key);
        return (typeof localStorage.getItem(key) == 'undefined');
    };
    this.save = function (key, val) {
        key = tag + key;
        localStorage.setItem(key, val);
        setItem(key);
        return (localStorage.getItem(key) == val);
    };
    this.load = function (key, dflt) {
        key = tag + key;
        var v = localStorage.getItem(key);
        return (v !== null) ? v : dflt;
    };
    this.data = function () {
        return JSON.parse(JSON.stringify(data));
    };
    this.clear = function (t) {
        var b = true;
        if (typeof t == 'string') {
            var s = [t];
            forEach(data.storedKeys, (_, k) => {
                s.push(' "' + k + '"');
            });
            b = confirm(s.join("\n"));
        }
        if (b) {
            forEach(data.storedKeys, (_, k) => {
                localStorage.removeItem(k);
            });
            data = null;
            return true;
        }
        return false;
    };
}
const LS = new LocalStorageHandler('tnt_');

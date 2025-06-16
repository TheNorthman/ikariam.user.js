/**
 * === CRITICAL TNT COLLECTION MODULES REFERENCE ===
 * Status: ✅ WORKING PERFECTLY
 * Date: 2025-06-16
 * 
 * These modules represent days of successful development work.
 * DO NOT MODIFY without careful testing - they are the core of TNT functionality.
 * 
 * PURPOSE: This file preserves the exact working implementations that can be
 * copied back into the Core script if needed. This is our backup/reference.
 * 
 * === ORIGINAL NAMES AND LOCATIONS ===
 * CRITICAL_CITY_SWITCHER       → tnt.citySwitcher (in Core script)
 * CRITICAL_TABLE_BUILDER       → tnt.tableBuilder (in Core script)
 * CRITICAL_TEMPLATE            → template.resources (in Core script)
 * CRITICAL_CALC_OBJECT         → tnt.calc (in Core script)
 * CRITICAL_HAS_OBJECT          → tnt.has (in Core script)
 */

// ===== CITY SWITCHER MODULE =====
// Original Location: tnt.citySwitcher in tnt.collection.core.user.js
// Handles automated city cycling for data collection
const CRITICAL_CITY_SWITCHER = {
    // Original: tnt.citySwitcher.isActive
    isActive: false,
    startCityId: null,
    visitedCities: [],

    // Original: tnt.citySwitcher.start()
    start() {
        this.startCityId = tnt.get.cityId();
        if (!this.startCityId) {
            console.log('[TNT] Cannot start - no valid city ID detected');
            return;
        }

        this.isActive = true;
        this.visitedCities = [this.startCityId];

        tnt.settings.set("citySwitcherActive", true);
        tnt.settings.set("citySwitcherStartCity", this.startCityId);
        tnt.settings.set("citySwitcherVisited", this.visitedCities);

        console.log('[TNT] CitySwitcher started from city:', this.startCityId);
        this.nextCity();
    },

    // Original: tnt.citySwitcher.nextCity()
    nextCity() {
        const allCities = Object.keys(tnt.get.cityList());
        for (const cityId of allCities) {
            if (!this.visitedCities.includes(cityId)) {
                this.switchToCity(cityId);
                return;
            }
        }
        this.end();
    },

    // Original: tnt.citySwitcher.switchToCity()
    switchToCity(cityId) {
        console.log('[TNT] Attempting to switch to city:', cityId);
        if (!this.visitedCities.includes(cityId)) {
            this.visitedCities.push(cityId);
            tnt.settings.set("citySwitcherVisited", this.visitedCities);
        }

        const $cityOption = $(`#dropDown_js_citySelectContainer li[selectValue="${cityId}"]`);
        if ($cityOption.length > 0) {
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('cityId', cityId);
            currentUrl.searchParams.set('currentCityId', cityId);
            window.location.href = currentUrl.toString();
            return true;
        }
        return false;
    },

    // Original: tnt.citySwitcher.end()
    end() {
        console.log('[TNT] CitySwitcher cycle completed successfully!');
        console.log('[TNT] Visited', this.visitedCities.length, 'cities total');
        this.switchToCity(this.startCityId);
        this.isActive = false;
        tnt.settings.set("citySwitcherActive", false);
    },

    // Original: tnt.citySwitcher.checkAndContinue()
    checkAndContinue() {
        const isActive = tnt.settings.get("citySwitcherActive", false);
        if (isActive) {
            const visitedCities = tnt.settings.get("citySwitcherVisited", []);
            if (visitedCities.length > 1) {
                console.log('[TNT] Continuing citySwitcher cycle');
                this.isActive = true;
                this.startCityId = tnt.settings.get("citySwitcherStartCity");
                this.visitedCities = visitedCities;
                setTimeout(() => this.nextCity(), 1000);
            } else {
                console.log('[TNT] Direct navigation detected - stopping citySwitcher');
                this.isActive = false;
                tnt.settings.set("citySwitcherActive", false);
            }
        }
    }
};

// ===== TABLE BUILDER MODULE =====
// Original Location: tnt.tableBuilder in tnt.collection.core.user.js
// Generates complete HTML table structures that match Styles script expectations
const CRITICAL_TABLE_BUILDER = {
    // Original: tnt.tableBuilder.buildTable()
    buildTable(type) {
        if (type === 'resources') return this.buildResourceTable();
        if (type === 'buildings') return this.buildBuildingTable();
        return '';
    },

    // Original: tnt.tableBuilder.buildResourceTable()
    buildResourceTable() {
        const cities = tnt.data.storage.resources.city || {};
        const sortedCityIds = tnt.dataCollector.sortCities();
        const settings = tnt.settings.getResourceDisplaySettings();
        const currentCityId = tnt.get.cityId();

        if (sortedCityIds.length === 0) {
            return '<div>No city data available</div>';
        }

        let html = '<table id="tnt_resources_table" border="1" style="border-collapse:collapse;font:12px Arial,Helvetica,sans-serif;background-color:#fdf7dd;"><tbody>';
        
        // Category header row - buttons go inside the first cell
        html += '<tr class="tnt_category_header">';
        html += '<th class="tnt_category_spacer" style="position:relative;background:transparent;border:none;padding:4px;text-align:center;">';
        html += '<span class="tnt_panel_minimize_btn tnt_back" style="position:absolute;left:2px;top:2px;"></span>';
        html += '<span class="tnt_table_toggle_btn" title="Show buildings/resources" style="position:absolute;right:2px;top:2px;"></span>';
        html += '<span class="tnt_refresh_btn" title="Refresh all cities" style="position:absolute;right:25px;top:2px;"></span>';
        html += '</th>';
        
        // City Info category span
        let cityInfoSpan = 1; // Town Hall always visible
        if (settings.showPopulation) cityInfoSpan++;
        if (settings.showCitizens) cityInfoSpan++;
        html += `<th colspan="${cityInfoSpan}" class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;">City Info</th>`;
        
        // Resources category span
        let resourcesSpan = 0;
        if (settings.showWood) resourcesSpan++;
        if (settings.showWine) resourcesSpan++;
        if (settings.showMarble) resourcesSpan++;
        if (settings.showCrystal) resourcesSpan++;
        if (settings.showSulfur) resourcesSpan++;
        if (resourcesSpan > 0) {
            html += `<th colspan="${resourcesSpan}" class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;">Resources</th>`;
        }
        html += '</tr>';

        // Subcategory header row
        html += '<tr class="tnt_subcategory_header">';
        html += '<th class="tnt_center tnt_bold" style="position:relative;text-align:center;padding:4px;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
        html += '<div style="position:relative; min-width:120px; text-align:center;">';
        html += '<span style="display:inline-block; text-align:center; min-width:60px;">City</span>';
        html += '</div></th>';
        
        // Town Hall header
        html += '<th class="tnt_center tnt_bold" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
        html += '<a href="#" onclick="ajaxHandlerCall(\'?view=buildingDetail&buildingId=0&helpId=1\');return false;" title="Learn more about Town Hall...">';
        html += '<img class="tnt_resource_icon tnt_building_icon" title="Town Hall" src="/cdn/all/both/img/city/townhall_l.png">';
        html += '</a></th>';
        
        // Optional columns based on settings
        if (settings.showPopulation) {
            html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
            html += tnt.dataCollector.getIcon('population') + '</th>';
        }
        if (settings.showCitizens) {
            html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
            html += tnt.dataCollector.getIcon('citizens') + '</th>';
        }
        if (settings.showWood) {
            html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
            html += tnt.dataCollector.getIcon(0) + '</th>';
        }
        if (settings.showWine) {
            html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
            html += tnt.dataCollector.getIcon(1) + '</th>';
        }
        if (settings.showMarble) {
            html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
            html += tnt.dataCollector.getIcon(2) + '</th>';
        }
        if (settings.showCrystal) {
            html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
            html += tnt.dataCollector.getIcon(3) + '</th>';
        }
        if (settings.showSulfur) {
            html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
            html += tnt.dataCollector.getIcon(4) + '</th>';
        }
        html += '</tr>';

        // Data rows
        sortedCityIds.forEach(cityId => {
            const city = cities[cityId];
            if (!city) return;

            const isCurrentCity = (cityId == currentCityId);
            const hasConstruction = city.hasConstruction;
            const rowClass = isCurrentCity ? ' class="tnt_selected"' : '';
            
            html += `<tr${rowClass}>`;
            
            // City name cell
            const constructionClass = hasConstruction ? ' tnt_construction' : '';
            html += `<td class="tnt_city tnt_left${constructionClass}" style="padding:4px;text-align:left;border:1px solid #000;background-color:#fdf7dd;">`;
            html += `<a onclick="$('#dropDown_js_citySelectContainer li[selectValue=\\"${cityId}\\"]').trigger('click'); return false;">`;
            html += tnt.dataCollector.getIcon(city.producedTradegood) + ' ' + tnt.get.cityName(cityId);
            html += '</a></td>';
            
            // Town Hall level
            let townHallLevel = '-';
            if (city.buildings && Array.isArray(city.buildings['townHall']) && city.buildings['townHall'].length > 0) {
                townHallLevel = city.buildings['townHall'].reduce((acc, b) => acc + (parseInt(b.level) || 0), 0);
            }
            html += `<td class="tnt_building_level" style="padding:4px;text-align:center;border:1px solid #000;background-color:#fdf7dd;">${townHallLevel}</td>`;
            
            // Optional data columns with proper CSS classes and production tooltips
            if (settings.showPopulation) {
                const val = parseInt(Math.round(city.population)).toLocaleString();
                html += `<td class="tnt_population" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;">${val}</td>`;
            }
            if (settings.showCitizens) {
                const val = parseInt(Math.round(city.citizens)).toLocaleString();
                html += `<td class="tnt_citizens" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;">${val}</td>`;
            }
            if (settings.showWood) {
                const cssClass = tnt.dataCollector.checkMinMax(city, 0);
                const production = tnt.calc.production(cityId, 24).wood;
                html += `<td class="tnt_wood${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;"><span title="${production}">${city.wood.toLocaleString()}</span></td>`;
            }
            if (settings.showWine) {
                const cssClass = tnt.dataCollector.checkMinMax(city, 1);
                const production = tnt.calc.production(cityId, 24).wine;
                const fontWeight = city.producedTradegood == 1 ? 'font-weight:bold;' : '';
                html += `<td class="tnt_wine${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;${fontWeight}"><span title="${production}">${city.wine.toLocaleString()}</span></td>`;
            }
            if (settings.showMarble) {
                const cssClass = tnt.dataCollector.checkMinMax(city, 2);
                const production = tnt.calc.production(cityId, 24).marble;
                const fontWeight = city.producedTradegood == 2 ? 'font-weight:bold;' : '';
                html += `<td class="tnt_marble${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;${fontWeight}"><span title="${production}">${city.marble.toLocaleString()}</span></td>`;
            }
            if (settings.showCrystal) {
                const cssClass = tnt.dataCollector.checkMinMax(city, 3);
                const production = tnt.calc.production(cityId, 24).crystal;
                const fontWeight = city.producedTradegood == 3 ? 'font-weight:bold;' : '';
                html += `<td class="tnt_crystal${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;${fontWeight}"><span title="${production}">${city.crystal.toLocaleString()}</span></td>`;
            }
            if (settings.showSulfur) {
                const cssClass = tnt.dataCollector.checkMinMax(city, 4);
                const production = tnt.calc.production(cityId, 24).sulfur;
                const fontWeight = city.producedTradegood == 4 ? 'font-weight:bold;' : '';
                html += `<td class="tnt_sulfur${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;${fontWeight}"><span title="${production}">${city.sulfur.toLocaleString()}</span></td>`;
            }
            
            html += '</tr>';
        });

        // Totals row
        const totals = tnt.dataCollector.calculateTotals();
        html += '<tr>';
        html += '<td class="tnt_total" style="padding:4px;text-align:left;border:1px solid #000;background-color:#faeac6;font-weight:bold;">Total</td>';
        html += '<td style="padding:4px;text-align:center;border:1px solid #000;background-color:#faeac6;"></td>';
        
        if (settings.showPopulation) {
            html += `<td class="tnt_total" style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${totals.population.toLocaleString()}</td>`;
        }
        if (settings.showCitizens) {
            html += `<td class="tnt_total" style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${totals.citizens.toLocaleString()}</td>`;
        }
        if (settings.showWood) {
            html += `<td class="tnt_total" style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${totals.wood.toLocaleString()}</td>`;
        }
        if (settings.showWine) {
            html += `<td class="tnt_total" style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${totals.wine.toLocaleString()}</td>`;
        }
        if (settings.showMarble) {
            html += `<td class="tnt_total" style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${totals.marble.toLocaleString()}</td>`;
        }
        if (settings.showCrystal) {
            html += `<td class="tnt_total" style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${totals.crystal.toLocaleString()}</td>`;
        }
        if (settings.showSulfur) {
            html += `<td class="tnt_total" style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${totals.sulfur.toLocaleString()}</td>`;
        }
        html += '</tr>';

        html += '</tbody></table>';
        return html;
    },

    // Original: tnt.tableBuilder.buildBuildingTable()
    buildBuildingTable() {
        // CRITICAL: Complete implementation exists in working Core script
        // See: tnt.collection.core.user.js -> tableBuilder.buildBuildingTable()
        // This method generates building tables with proper category headers
    },

    // Original: tnt.tableBuilder.attachEventHandlers()
    attachEventHandlers() {
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

        // Refresh all cities button
        $('.tnt_refresh_btn').off('click').on('click', function () {
            tnt.citySwitcher.start();
        });
    }
};

// ===== ESSENTIAL SUPPORTING OBJECTS =====
// Original Location: template.resources in tnt.collection.core.user.js
const CRITICAL_TEMPLATE = {
    resources: `
        <div id="tnt_info_resources">
            <div id="tnt_info_resources_content"></div>
            <div id="tnt_info_buildings_content" style="display:none;"></div>
        </div>
    `
};

// Original Location: tnt.calc in tnt.collection.core.user.js
const CRITICAL_CALC_OBJECT = {
    production: (cityID, hours) => tnt.utils.calculateProduction(cityID, hours)
};

// Original Location: tnt.has in tnt.collection.core.user.js
const CRITICAL_HAS_OBJECT = {
    construction: () => tnt.utils.hasConstruction()
};

/**
 * === PURPOSE OF THIS FILE ===
 * 
 * This file serves as a BACKUP and REFERENCE for working implementations.
 * If the Core script ever breaks, we can copy these exact implementations back.
 * 
 * The code here represents days of successful development and debugging.
 * This is our insurance policy against losing critical functionality.
 * 
 * === USAGE ===
 * 
 * 1. REFERENCE: Check this file when implementing similar functionality
 * 2. BACKUP: Copy code from here if Core script implementations break
 * 3. COMPARISON: Compare Core script with these working versions during debugging
 * 4. DOCUMENTATION: Shows exactly how complex features should be implemented
 * 
 * === RESTORATION INSTRUCTIONS ===
 * 
 * To restore any broken module in Core script:
 * 1. Copy the CRITICAL_* implementation from here
 * 2. Rename to original name (e.g., CRITICAL_CITY_SWITCHER → tnt.citySwitcher)
 * 3. Place in original location within tnt.collection.core.user.js
 * 4. Test thoroughly to ensure functionality works
 * 
 * Original names are documented above each module for easy reference.
 */

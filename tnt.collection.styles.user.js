// ==UserScript==
// @name         TNT Collection Styles
// @version      1.0.0
// @namespace    tnt.collection.styles
// @author       Ronny Jespersen
// @description  TNT Collection Styles - CSS styling extension for TNT Collection Core
// @license      MIT
// @include      http*s*.ikariam.*/*
// @exclude      http*support*.ikariam.*/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL  https://github.com/TheNorthman/ikariam.user.js/raw/refs/heads/main/tnt.collection.styles.user.js
// @updateURL    https://github.com/TheNorthman/ikariam.user.js/raw/refs/heads/main/tnt.collection.styles.user.js
// ==/UserScript==

// ===== AI-NOTICE: IMPORTANT FOR AI TOOLS - HUMAN SUPERVISION REQUIRED FOR THIS SECTION =====
// This is the styles extension for TNT Collection Core.
// It contains all CSS styling rules for the TNT Collection interface elements.
// This extension is designed to work alongside tnt.collection.core.user.js
// Things to be aware of:
// - This script only applies styles, no JavaScript logic
// - Styles are applied immediately when the script loads
// - All styles use high specificity to override Ikariam's default styles
// !!! Changes here affect the visual appearance of all TNT Collection elements
// =============================================================

GM_addStyle(`
    /* Show level styles */
    .tntLvl{
        position:relative;
        top:10px;
        left:10px;
        color:black;
        line-height:13px;
        background:gold;
        font-size:9px;
        font-weight:bold;
        text-align:center;
        vertical-align:middle;
        height: 14px;
        width: 14px;
        border-radius: 50%;
        border: 1px solid #000;
        display: inline-block;
    }
    /* TNT table styles with higher specificity - override Ikariam's .table01 styles */
    body #tnt_info_resources #tnt_resource_table,
    body #tnt_info_buildings_content #tnt_building_table{
        border-collapse:collapse !important;
        font: 12px Arial, Helvetica, sans-serif !important;
        background-color: #fdf7dd !important;
    }
    body #tnt_info_resources #tnt_resource_table td,
    body #tnt_info_buildings_content #tnt_building_table td{
        border:1px #000000 solid !important;
        padding:4px !important;
        text-align:center !important;
        vertical-align:middle !important;
        background-color: #fdf7dd !important;
    }
    /* Apply subcategory header height to table row instead of individual cells */
    body #tnt_info_resources #tnt_resource_table tr.tnt_subcategory_header,
    body #tnt_info_buildings_content #tnt_building_table tr.tnt_subcategory_header {
        height: 41px !important;
    }
    body #tnt_info_resources #tnt_resource_table th,
    body #tnt_info_buildings_content #tnt_building_table th{
        border:1px #000000 solid !important;
        padding:4px !important;
        text-align:center !important;
        vertical-align:middle !important;
        background-color: #faeac6 !important;
        font-weight: bold !important;
        height: auto !important;
    }
    body #tnt_info_resources #tnt_resource_table tr.tnt_subcategory_header th,
    body #tnt_info_buildings_content #tnt_building_table tr.tnt_subcategory_header th {
        height: 41px !important;
        line-height: 41px !important;
    }
    
    body #tnt_info_buildings_content #tnt_building_table th.tnt_category_spacer {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 4px !important;
        text-align:center !important;
    }
    body #tnt_info_buildings_content #tnt_building_table th.tnt_category_header {
        background-color: #DBBE8C !important;
        border: 1px solid #000 !important;
        padding: 4px !important;
        font-weight: bold !important;
        text-align: center !important;
        height: auto !important;
    }
    body #tnt_info_resources #tnt_resource_table td.tnt_total,
    body #tnt_info_buildings_content #tnt_building_table td.tnt_total {
        background-color: #faeac6 !important;
        font-weight: bold !important;
        height: auto !important;
    }
    .storage_min{
        background-color: #FF000050 !important;
    }
    .storage_danger{
        color: #FF000050 !important;
    }
    /* Construction status styling applies to the first cell in any row across all tables */
    .tnt_construction{
        background-color: #80404050 !important;
    }
    /* Current city highlighting with 2px black border - no background change */
    body #tnt_info_resources .tnt_selected,
    body #tnt_info_buildings_content .tnt_selected {
        border: 2px solid black !important;
    }
    body #tnt_info_resources .tnt_selected td,
    body #tnt_info_buildings_content .tnt_selected td {
        border-top: 2px solid black !important;
        border-bottom: 2px solid black !important;
        color: #000 !important;
    }
    body #tnt_info_resources .tnt_selected td:first-child,
    body #tnt_info_buildings_content .tnt_selected td:first-child {
        border-left: 2px solid black !important;
    }
    body #tnt_info_resources .tnt_selected td:last-child,
    body #tnt_info_buildings_content .tnt_selected td:last-child {
        border-right: 2px solid black !important;
    }
    /* Make tradegood production more visible with dark grey text color */
    body #tnt_info_resources .tnt_bold,
    body #tnt_info_buildings_content .tnt_bold {
        color: #333333 !important;
        font-weight: bold !important;
    }
    .tnt_resource_icon{
        vertical-align:middle !important;
        width:18px !important;
        height:16px !important;
        display:inline-block !important;
    }
    .tnt_building_icon {
        width: 36px !important;
        height: 32px !important;
    }
    img[src*='/city/wall.png'].tnt_building_icon {
        transform: scale(0.8) !important;
        transform-origin: 0 0;
        margin-right: -8px;
    }
    body #tnt_info_resources .tnt_population{ text-align:right !important; }
    body #tnt_info_resources .tnt_citizens{ text-align:right !important; }
    body #tnt_info_resources .tnt_wood{ text-align:right !important; }
    body #tnt_info_resources .tnt_marble{ text-align:right !important; }
    body #tnt_info_resources .tnt_wine{ text-align:right !important; }
    body #tnt_info_resources .tnt_crystal{ text-align:right !important; }
    body #tnt_info_resources .tnt_sulfur{ text-align:right !important; }
    body #tnt_info_resources .tnt_city{ text-align:left !important; }
    body #tnt_info_buildings_content .tnt_city{ text-align:left !important; }
    body #tnt_info_buildings_content .tnt_building_level{ text-align:center !important; }
    
    /* Override Ikariam's container table styles specifically for our TNT tables */
    #container body #tnt_info_resources #tnt_resource_table.table01,
    #container body #tnt_info_buildings_content #tnt_building_table.table01 {
        border: none !important;
        margin: 0px !important;
        background-color: #fdf7dd !important;
        border-bottom: none !important;
        text-align: center !important;
        width: auto !important;
    }
    #container body #tnt_info_resources #tnt_resource_table.table01 td,
    #container body #tnt_info_buildings_content #tnt_building_table.table01 td {
        text-align: center !important;
        vertical-align: middle !important;
        padding: 4px !important;
        border: 1px #000000 solid !important;
    }
    #container body #tnt_info_resources #tnt_resource_table.table01 th,
    #container body #tnt_info_buildings_content #tnt_building_table.table01 th {
        background-color: #faeac6 !important;
        text-align: center !important;
        height: auto !important;
        padding: 4px !important;
        font-weight: bold !important;
        border: 1px #000000 solid !important;
    }
    
    #mainview a:hover{ text-decoration:none; }
    #tntOptions {
        position:absolute;
        top:40px;
        left:380px;
        width:620px;
        border:1px #755931 solid;
        border-top:none;
        background-color: #FEE8C3;
        padding:10px 10px 0px   10px;
    }

    #tntOptions legend{ font-weight:bold; }
    .tntHide, #infocontainer .tntLvl, #actioncontainer .tntLvl{ display:none; }
    #tntInfoWidget {
        position:fixed;
        bottom:0px;
        left:0px;
        width:716px;
        background-color: #DBBE8C;
        z-index:100000000;
    }
    #tntInfoWidget .accordionTitle {

        background: url(/cdn/all/both/layout/bg_maincontentbox_header.jpg) no-repeat;
        padding: 6px 0 0;
        width: 728px;
    }
    #tntInfoWidget .accordionContent {
        background: url(/cdn/all/both/layout/bg_maincontentbox_left.png) left center repeat-y #FAF3D7;
        overflow: hidden;
        padding: 0;
        position: relative;
        width: 725px;
    }
    #tntInfoWidget .scroll_disabled {
        background: url(/cdn/all/both/layout/bg_maincontentbox_left.png) repeat-y scroll left center transparent;
        width: 9px;
    }
    #tntInfoWidget .scroll_area {
        background: url(/cdn/all/both/interface/scroll_bg.png) right top repeat-y transparent;
        display: block;
        height: 100%;
        overflow: hidden;
        position: absolute;
        right: -3px;
        width: 24px;
        z-index: 100000;
    }
    .txtCenter{ text-align:center; }
    .tnt_center{ text-align:center!important; white-space:nowrap; }
    .tnt_right{ text-align:right!important; white-space:nowrap; }
    .tnt_left{ text-align:left!important; white-space:nowrap; }
    #tnt_info_resources{
        position:fixed;
        bottom:20px;
        left:0px;
        width:auto;
        height:auto;
        background-color: #DBBE8C;
        z-index:100000000;
    }
    #tnt_info_resources .tnt_back, #tnt_info_resources .tnt_foreward {
        cursor: pointer;
        display: block!important;
        height: 18px;
        width: 18px;
        border: 1px solid #8B4513;
        background: #D2B48C;
        border-radius: 2px;
        text-align: center;
        line-height: 16px;
        font-size: 12px;
    }
    #tnt_info_resources .tnt_back {
        left: 2px;
        position: absolute;
        top: 2px;
    }
    #tnt_info_resources .tnt_back:before {
        content: "◀";
        color: #333;
    }
    #tnt_info_resources .tnt_back:hover {
        background: #DDD;
    }
    #tnt_info_resources .tnt_back:hover:before {
        color: #000;
    }
    #tnt_info_resources .tnt_foreward {
        left: 2px;
        position: absolute;
        top: 3px;
    }
    #tnt_info_resources .tnt_foreward:before {
        content: "▶";
        color: #333;
    }
    #tnt_info_resources .tnt_foreward:hover {
        background: #DDD;
    }
    #tnt_info_resources .tnt_foreward:hover:before {
        color: #000;
    }
    #tnt_info_updateCities {
        position:fixed;
        bottom:20px;
        right:0px;
        width:auto;
        height:auto;
        background-color: #DBBE8C;
        z-index:100000000;
    }
    .tnt_panel_minimize_btn {
        cursor: pointer;
        display: block!important;
        height: 18px;
        width: 18px;
        position: absolute;
        left: 2px;
        top: 2px;
        z-index: 10;
        border: 1px solid #8B4513;
        background: #D2B48C;
        border-radius: 2px;
        text-align: center;
        line-height: 16px;
        font-size: 12px;
    }
    .tnt_panel_minimize_btn.tnt_back:before { 
        content: "◀";
        color: #333;
    }
    .tnt_panel_minimize_btn.tnt_back:hover { 
        background: #DDD;
    }
    .tnt_panel_minimize_btn.tnt_back:hover:before { 
        color: #000;
    }
    .tnt_panel_minimize_btn.tnt_foreward { 
        top: 3px; 
    }
    .tnt_panel_minimize_btn.tnt_foreward:before { 
        content: "▶";
        color: #333;
    }
    .tnt_panel_minimize_btn.tnt_foreward:hover { 
        background: #DDD;
    }
    .tnt_panel_minimize_btn.tnt_foreward:hover:before { 
        color: #000;
    }
    .tnt_table_toggle_btn {
        cursor: pointer;
        display: inline-block;
        height: 18px;
        width: 18px;
        vertical-align: middle;
        float: right;
        margin-left: 6px;
        border: 1px solid #8B4513;
        background: #D2B48C;
        border-radius: 2px;
        text-align: center;
        line-height: 16px;
        font-size: 12px;
    }
    .tnt_table_toggle_btn:before {
        content: "⇄";
        color: #333;
    }
    .tnt_table_toggle_btn:hover { 
        background: #DDD;
    }
    .tnt_table_toggle_btn:hover:before {
        color: #000;
    }
    .tnt_table_toggle_btn.active:before {
        content: "⇄";
        color: #006600;
        font-weight: bold;
    }
    .tnt_city .tnt_panel_minimize_btn { float: left; margin-right: 2px; }
    #tnt_info_resources.minimized {
        width: 25px!important;
        min-width: 25px!important;
        max-width: 25px!important;
        overflow: hidden!important;
    }
    #tnt_military_overview {
        position: fixed;
        top: 20px;
        right: 0px;
        width: auto;
        background-color: #DBBE8C;
        z-index: 100000000;
    }
    #tnt_military_header {
        padding: 5px;
        cursor: pointer;
        font-weight: bold;
    }
    #tnt_military_table {
        border-collapse: collapse;
        font: 12px Arial, Helvetica, sans-serif;
    }
    #tnt_military_table td, #tnt_military_table th {
        border: 1px #000000 solid;
        margin: 2px 0;
        padding: 2px !important;
    }
    .movement {
        padding: 3px;
        background-color: rgba(255,0,0,0.2);
        margin: 2px 0;
    }
    .movement.attack {
        background-color: rgba(255,0,0,0.2);
    }
    #tnt_building_table th:first-child {
        background-color: rgba(255,255,255,0);
        border: none !important;
    }
    #tnt_building_table th.tnt_category_spacer {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 4px !important;
    }
    #tnt_building_table th.tnt_category_header {
        background-color: #DBBE8C !important;
        border: 1px solid #000 !important;
        padding: 4px !important;
        font-weight: bold;
        text-align: center !important;
    }

    /* Set fixed height for subcategory header rows */
    tr.tnt_subcategory_header {
        height: 41px !important;
    }

    .tnt_refresh_btn {
        cursor: pointer;
        display: inline-block;
        height: 18px;
        width: 18px;
        border: 1px solid #8B4513;
        background: #D2B48C;
        border-radius: 2px;
        text-align: center;
        line-height: 16px;
        font-size: 12px;
    }
    
    .tnt_refresh_btn:before {
        content: "⟳";
    }
    
    .tnt_refresh_btn:hover {
        background: #DDD;
    }
`);

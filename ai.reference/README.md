# AI Reference Documentation

This folder contains all development reference materials for the TNT Collection project.

## 📁 Current Project Status (2025-06-16)

### ✅ **FULLY WORKING** - All Functionality Restored
- **Core Script**: `dev/tnt.collection.core.user.js` v1.5.25 ✅ Complete table structure
- **Styles Script**: `dev/tnt.collection.styles.user.js` v1.0.0 ✅ Professional styling
- **Production Script**: `tnt.collection.user.js` v1.5.22 ✅ Stable release

## 📂 Folder Structure

### `/critical/` - Essential Working Code ⚠️ **DO NOT MODIFY**
- **`modules.js`** - Critical working modules with original name mapping
  - Complete `citySwitcher` implementation (automated city cycling)
  - Complete `tableBuilder` implementation (HTML generation)
  - All supporting objects (`calc`, `has`, `template`)
- **`working.table.structure.html`** - Complete HTML structure reference
  - Shows exact output that Core script must generate
  - Includes proper container hierarchy and CSS classes
  - Documents working button positioning and styling

### Root Files
- **`README.md`** - This navigation and status file
- **`problem.resolution.log.md`** - Problem-solving documentation and lessons learned

## 🎯 Usage Guidelines

### For AI Tools ⚠️ **CRITICAL READING**
- **ALWAYS check `/critical/` folder** before modifying core functionality
- **Use `working.table.structure.html`** as reference for HTML structure requirements
- **Never modify critical modules** without preserving working implementations
- **Test visual appearance** - Core and Styles scripts work together
- **Consult version log** in `/admin/project.management/` for development context

### For Human Developers
- The `/critical/` folder contains **days of successful development work**
- `problem.resolution.log.md` documents **proven debugging methodology**
- All files maintain **complete version history** and change documentation
- This structure **prevents knowledge loss** during refactoring

## 🔧 Current Working Implementation

### Core Components ✅ **ALL WORKING**
1. **Resource Tables** - Complete with category headers, proper styling, storage warnings
2. **Building Tables** - Full categorization with construction status highlighting  
3. **City Switching** - Automated cycling through all cities for data collection
4. **Control Buttons** - Minimize/maximize, table toggle, refresh - all functional
5. **Data Collection** - Real-time building detection and resource monitoring
6. **Visual Styling** - Professional appearance with current city highlighting

### Technical Architecture
- **HTML Generation**: Core script creates complete table structures
- **CSS Styling**: Styles script applies professional visual appearance
- **Event Handling**: Proper button functionality with duplicate prevention
- **Data Storage**: localStorage persistence for city and building data
- **Error Handling**: Comprehensive error detection and recovery

## 📊 Reference Mapping

### Critical Module Names → Core Script Locations
```
CRITICAL_CITY_SWITCHER    → tnt.citySwitcher (automated city cycling)
CRITICAL_TABLE_BUILDER    → tnt.tableBuilder (HTML table generation)  
CRITICAL_TEMPLATE         → template.resources (container structure)
CRITICAL_CALC_OBJECT      → tnt.calc (production calculations)
CRITICAL_HAS_OBJECT       → tnt.has (construction detection)
```

### Essential CSS Classes (Styles Script)
```
.tnt_selected       → Current city highlighting (2px black border)
.tnt_construction   → Cities with active construction (background highlight)
.storage_min        → Low resource warning (red background)
.storage_danger     → High resource warning (red text)
.tnt_total          → Total row styling (bold, different background)
```

## 🚨 Critical Success Factors

### What Makes This Work
1. **Exact HTML Structure** - Core script must generate HTML matching Styles expectations
2. **Control Button Position** - Must be `<span>` elements inside table headers
3. **CSS Class Consistency** - All classes must be applied exactly as Styles expects
4. **Two-Row Headers** - Category + subcategory system essential for proper display
5. **Event Handler Targeting** - Must target actual generated elements, not placeholders

### What Breaks Everything
1. **Changing HTML structure** without updating Styles script
2. **Moving control buttons** outside table headers
3. **Missing CSS classes** or incorrect class names
4. **Simplifying table structure** - loses visual hierarchy
5. **Breaking module dependencies** - missing `tnt.calc` objects etc.

## 🎯 Development Workflow

### Safe Development Process
1. **Check current working state** in `/critical/` folder
2. **Reference HTML structure** before making changes
3. **Test with both Core and Styles** scripts active
4. **Verify visual appearance** matches professional standards
5. **Update version numbers** for any changes

### Emergency Recovery
If Core script breaks:
1. **Copy implementations** from `/critical/modules.js`
2. **Rename to original names** (remove CRITICAL_ prefix)
3. **Place in correct locations** within Core script
4. **Test thoroughly** to ensure functionality works
5. **Document changes** in version log

## 📈 Development History

### Phase 1: Initial Development (January 14-15, 2025)
- Separated Core and Styles into dedicated scripts
- Implemented modular architecture
- Created comprehensive data collection system

### Phase 2: Table System Development (January 15, 2025)  
- Built complete table building system
- Added building detection and categorization
- Created placeholder implementations

### Phase 3: Critical Issue Resolution (June 16, 2025) ✅ **SUCCESS**
- **Problem**: Tables lost visual appearance and button functionality
- **Root Cause**: Simplified placeholder not generating expected HTML
- **Solution**: Complete tableBuilder matching working reference structure
- **Result**: 100% functionality restoration with professional appearance

## 🏆 Current Achievement Level

### ✅ **Professional Quality Implementation**
- **Visual Appearance**: Matches professional software standards
- **Functionality**: All features working without errors
- **User Experience**: Intuitive controls and clear information hierarchy
- **Code Quality**: Modular, maintainable, well-documented
- **Stability**: Thoroughly tested and proven reliable

### 📊 **Success Metrics**
- **Zero JavaScript Errors**: Clean console output
- **Complete Visual Styling**: All elements properly styled
- **Full Functionality**: Every button and feature works
- **Professional Appearance**: High-quality user interface
- **Maintainable Code**: Clear structure and documentation

## ⚠️ **IMPORTANT NOTICES**

### For AI Tools
- This codebase has **complex HTML/CSS dependencies**
- **Visual appearance matters** - test with Styles script active
- **Days of work** are preserved in `/critical/` - respect this investment
- **Structure changes** must coordinate between Core and Styles scripts

### For Human Developers
- **tableBuilder and citySwitcher** are the heart of functionality
- **Critical modules represent proven implementations** - modify carefully
- **Reference documentation is insurance** against losing working code
- **Always maintain working implementations** as backup

**Last Updated:** June 16, 2025  
**Project Status:** ✅ **FULLY WORKING** - Production Ready  
**Next Phase:** Feature enhancements and optimization

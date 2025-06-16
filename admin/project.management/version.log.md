# TNT Collection - Master Version Log

## 📊 Current Version Status (2025-06-16)

### 🚨 **Production Release** (Most Important)
- **File**: `tnt.collection.user.js` (root)
- **Version**: v1.5.22
- **Status**: ✅ Stable Production Release
- **Purpose**: What users actually install and use

### 🧠 **Development Scripts**
- **Core**: `dev/tnt.collection.core.user.js` - v1.5.26 ✅ **CURRENT WORKING VERSION**
- **Dev**: `dev/tnt.collection.dev.user.js` - v1.0.2 (Clean slate for experiments)
- **Styles**: `dev/tnt.collection.styles.user.js` - v1.0.0 ✅ **WORKING STYLES EXTENSION**

## 🚀 Version 1.5.26 (Current) - Version Update
**Release Date:** 2025-06-16  
**Status:** ✅ WORKING PERFECTLY - VERSION INCREMENT

### 🎯 Version Update Details
- ✅ **Version Increment**: Core script updated from v1.5.25 to v1.5.26
- ✅ **Patch Release**: Minor version increment for maintenance update
- ✅ **All Functionality Maintained**: Complete table structure and features preserved
- ✅ **Command System Integration**: Version update executed via UPDATE_VERSION_CORE command

---

## 📚 Critical Reference Documentation

### `/ai.reference/critical/` - Essential Working Code ⚠️ **DO NOT MODIFY**
- **`modules.js`** - Complete working implementations with original name mapping:
  - `CRITICAL_CITY_SWITCHER` → `tnt.citySwitcher` (automated city cycling)
  - `CRITICAL_TABLE_BUILDER` → `tnt.tableBuilder` (HTML table generation)
  - `CRITICAL_TEMPLATE` → `template.resources` (container structure)
  - `CRITICAL_CALC_OBJECT` → `tnt.calc` (production calculations)
  - `CRITICAL_HAS_OBJECT` → `tnt.has` (construction detection)

- **`working.table.structure.html`** - Complete HTML structure reference showing:
  - Proper container hierarchy
  - Control button positioning
  - Category header spans
  - CSS class implementation
  - Current city highlighting
  - Construction status highlighting

### `/ai.reference/` - Development Documentation
- **`README.md`** - Navigation and usage guidelines
- **`problem.resolution.log.md`** - Problem-solving methodology and lessons learned

---

## 🧠 Key Architecture Insights

### 1. HTML Structure Dependencies
- **Styles script expects exact HTML structure** from Core script
- **Control buttons must be `<span>` elements** inside table headers, not separate divs
- **CSS selectors are highly specific** and require proper class/ID matching
- **Two-row header system** essential for proper categorization

### 2. Module Dependencies
- **tableBuilder requires `tnt.calc.production()`** function for tooltip calculations
- **All referenced objects must exist** before table generation
- **Missing dependencies cause complete functionality breakdowns**
- **Event handlers must target actual generated elements**

### 3. Visual Styling Integration
- **Core script generates HTML structure** with inline styles and CSS classes
- **Styles script applies enhanced styling** with high specificity overrides
- **Current city highlighting** uses `.tnt_selected` with 2px black border
- **Construction highlighting** uses `.tnt_construction` with background color
- **Storage warnings** use `.storage_min` and `.storage_danger` classes

### 4. Data Collection & Display
- **Only own cities** are processed for data collection
- **Real-time building detection** with construction status tracking
- **City sorting by tradegood type** for logical organization
- **Production calculations** for 24-hour tooltips
- **Totals row** with proper styling and calculations

---

## 🔮 Future Development Roadmap

### Immediate Opportunities
1. **Performance Optimization**: Reduce table rebuilds, optimize data collection
2. **Enhanced Tooltips**: More detailed building and resource information
3. **User Customization**: Configurable column visibility and sorting options
4. **Historical Data**: Track resource and building changes over time

### Technical Improvements
1. **Icon Optimization**: Replace hardcoded URLs with Ikariam's native CSS structure
2. **Responsive Design**: Better handling of different screen sizes
3. **Accessibility**: Improved keyboard navigation and screen reader support
4. **Error Recovery**: Better handling of Ikariam API changes

---

## 👥 Development Guidelines

### For AI Tools
- **Always check `/ai.reference/critical/`** before modifying core functionality
- **Use `working.table.structure.html`** as HTML structure reference
- **Test visual appearance** with Styles script active
- **Preserve critical module implementations** - they represent days of successful work

### For Human Developers
- **Core and Styles work together** - changes to HTML structure must coordinate
- **Reference documentation is insurance** against losing working implementations
- **tableBuilder and citySwitcher are critical** - handle with extreme care
- **Always increment version numbers** when making changes

### Maintenance Principles
1. **Preserve working reference implementations** in `/ai.reference/critical/`
2. **Test thoroughly before structural changes** - visual appearance matters
3. **Document HTML/CSS dependencies** - styles expect specific structure
4. **Use semantic versioning** - increment appropriately for all changes

---

## 🏆 Success Metrics - Current Status

### ✅ Functionality (100% Working)
- Resource tables display with proper visual styling
- Building tables with complete categorization
- Control buttons positioned and fully functional
- City switching and data collection works perfectly
- Current city highlighting and construction status
- Storage warning colors and production tooltips

### ✅ Architecture (Stable & Maintainable)
- Clean separation between Core logic and Styles
- Modular structure with comprehensive error handling
- Reference documentation preserves critical implementations
- Version control and change tracking established

### ✅ User Experience (Professional Quality)
- Visual appearance matches professional standards
- Intuitive controls and clear information hierarchy
- Responsive interface with proper hover states
- Complete functionality without JavaScript errors

**Last Updated:** June 16, 2025  
**Status:** Production Ready - Version 1.5.26 active  
**Next Phase:** Feature enhancements and optimization

---

*This master version log documents the complete TNT Collection development journey and current working state.* 📋✨
## 👥 Development Team Notes

### For AI Tools
- This codebase has complex HTML/CSS dependencies
- Always check working references before modifying table structure
- Test visual appearance with Styles script active
- Preserve critical module implementations

### For Human Developers
- The tableBuilder and citySwitcher are the heart of functionality
- Changes to HTML structure must be coordinated with Styles script
- Always maintain working reference documentation
- Use version control for all changes

**Last Updated:** June 16, 2025  
**Next Review:** When implementing new features or major changes

---

*This master version log tracks all TNT Collection components in one centralized location.* 📋
- Responsive interface with proper hover states
- Complete functionality without JavaScript errors

**Last Updated:** June 16, 2025  
**Status:** Production Ready - All critical issues resolved  
**Next Phase:** Feature enhancements and optimization

---

*This master version log documents the complete TNT Collection development journey and current working state.* 📋✨
## 👥 Development Team Notes

### For AI Tools
- This codebase has complex HTML/CSS dependencies
- Always check working references before modifying table structure
- Test visual appearance with Styles script active
- Preserve critical module implementations

### For Human Developers
- The tableBuilder and citySwitcher are the heart of functionality
- Changes to HTML structure must be coordinated with Styles script
- Always maintain working reference documentation
- Use version control for all changes

**Last Updated:** June 16, 2025  
**Next Review:** When implementing new features or major changes

---

*This master version log tracks all TNT Collection components in one centralized location.* 📋

# TNT Collection - Master Version Log

## 📊 Current Version Status (2025-06-16)

### 🚨 **Production Release** (Most Important)
- **File**: `tnt.collection.user.js` (root)
- **Version**: v1.5.22
- **Status**: ✅ Stable Production Release
- **Purpose**: What users actually install and use

### 🧠 **Development Scripts**
- **Core**: `dev/tnt.collection.core.user.js` - v1.5.26 ✅ **CURRENT WORKING VERSION** (comprehensive functionality)
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
- **`modules.js`** - Complete working implementations with original name mapping
- **Core script**: **Comprehensive functionality** ← CORRECTED (removed static line count)
  - Complete table building system with category headers
  - Automated city switching with state management
  - Comprehensive data collection and storage
  - Full UI management and event handling
  - Game data integration and error handling

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

## 🔒 **BACKUP VERIFICATION PROTOCOL** (2025-06-16)

### **Critical Update: Backup System Trust Issues Identified**
- **Problem**: Previous backup attempts created incomplete files with placeholders
- **Root Cause**: No verification system to ensure backup integrity
- **Impact**: Backup files were unusable for restoration (trust broken)

### **New Verification Requirements**
✅ **Mandatory verification** for all backup operations  
✅ **Byte-for-byte comparison** between source and backup  
✅ **Critical function presence verification**  
✅ **Detailed verification reporting** in all backup commands  
✅ **No success reporting** without passing verification  

### **Implementation Details**
- **File size comparison**: Must match exactly
- **Line count verification**: Must be identical  
- **Content hash verification**: SHA256 or equivalent
- **Function presence check**: All critical functions must exist
- **Version header preservation**: @version must be preserved

### **Trust Rebuilding Measures**
1. **Always verify** - No backup operation without verification
2. **Report everything** - Show complete verification details
3. **Flag failures immediately** - Never hide verification failures
4. **Specific diagnostics** - Show exactly what differs when verification fails
5. **System improvement** - Update backup process if verification consistently fails

### **Current Status**
🚨 **Backup system requires verification implementation before next use**  
📋 **All future backups must pass verification to be considered valid**  
🎯 **Trust will be rebuilt through consistent verified backup operations**

---

## 🔧 **UPDATE_FILES Command Enforcement** (2025-06-16)

### **Critical Behavioral Requirements**
The UPDATE_FILES command has been fully documented with strict enforcement rules to prevent AI memory issues.

### **Mandatory Behavior**
✅ **Only analyze files explicitly provided** in current prompt  
✅ **Show "No files provided" error** when no files are attached  
✅ **Report exact count** of files analyzed in every response  
✅ **Never reference cached information** from previous conversations  
✅ **Force dynamic analysis** of provided content only  

### **Forbidden Behavior**
❌ **NEVER analyze files not provided** in current prompt  
❌ **NEVER use cached file data** when executing UPDATE_FILES  
❌ **NEVER assume file contents** based on previous conversations  
❌ **NEVER fill in missing data** from memory or assumptions  
❌ **NEVER reference files from memory** when none are provided  

### **Enforcement Documentation**
- **Complete documentation**: `ai.reference/documentation/ai.memory.limitations.md`
- **Command system updates**: Enhanced UPDATE_FILES documentation with strict rules
- **Verification examples**: Both correct and incorrect behavior patterns documented
- **Implementation rules**: Pseudo-code examples for proper behavior

### **Why This Matters**
The backup verification system depends on accurate file metrics. AI memory limitations were causing:
- ❌ **Wrong line count expectations** (1584 vs actual 1714)
- ❌ **Outdated file size assumptions** from cached data
- ❌ **Analysis of files not provided** in current conversation
- ❌ **Trust issues** with backup verification system

### **Solution Implemented**
The UPDATE_FILES command now has comprehensive documentation requiring:
- **Explicit file counting** before analysis
- **Error reporting** when no files provided
- **Dynamic analysis only** of provided content
- **No cache references** when executing the command

This ensures the backup verification system always works with accurate, current file metrics.

---

## 🔧 **Command Validation Enhancement** (2025-06-16)

### **Problem Identified**
Commands were being executed when embedded in conversational text, causing unintended behavior:
- ❌ "Look at this file!!!! :-) UPDATE_FILES" triggered UPDATE_FILES execution
- ❌ Commands in mixed case or within questions were being processed
- ❌ No validation of command format or context

### **Solution Implemented**
Added strict command validation requirements:

### **Mandatory Validation Rules**
✅ **Each command must be on its own line** - No surrounding text on same line  
✅ **Each command must be ALL UPPERCASE** - Mixed case or lowercase invalid  
✅ **Each command must match exact format** - No variations or explanations  
✅ **Multiple commands allowed** - When each is on separate line

### **Enforcement Examples**
```
❌ "Look at this file! UPDATE_FILES" → Do NOT execute
❌ "update_files" → Do NOT execute  
❌ "Please run BACKUP_CORE" → Do NOT execute
❌ "UPDATE_FILES BACKUP_CORE" → Do NOT execute (same line)
✅ "UPDATE_FILES" → Execute
✅ "BACKUP_CORE" → Execute
✅ Multi-line commands:
   BACKUP_CORE
   UPDATE_VERSION_CORE → Execute both
```

### **AI Protocol Updated**
- **Parse each line separately** for potential commands
- **Validate case sensitivity** for all commands
- **Check for surrounding text** on same line that invalidates command
- **Allow multiple commands** when each is on separate line
- **Treat invalid formats** as conversational text

### **Documentation Updates**
- **Command system**: Enhanced with validation requirements
- **AI memory limitations**: Updated with command validation rules
- **Version log**: Documented validation enhancement

This prevents accidental command execution while maintaining intended functionality.

---

## 🔧 **PowerShell Command Formatting Enhancement** (2025-06-16)

### **Issue Identified**
PowerShell commands in command responses were missing proper line endings, causing execution problems when users copy-paste commands.

### **Problem Example**
```powershell
Get-ChildItem "folder" | Select-Object FullName
```
**Missing blank line after closing backticks prevented proper command execution.**

### **Solution Implemented**
All PowerShell commands now require:

### **Mandatory Formatting Rules**
✅ **Proper line endings** - Always include CRLF/LF after PowerShell blocks  
✅ **Error handling** - Use `-ErrorAction SilentlyContinue` for file operations  
✅ **Verification commands** - Include commands to show results  
✅ **Clear syntax** - Proper PowerShell formatting with comments  

### **Correct Format Example**
```powershell
# Remove deprecated files
Remove-Item "path\to\file.ext" -Force -ErrorAction SilentlyContinue

# Verify results
Get-ChildItem "target\folder" -Recurse | Select-Object FullName

```

### **Documentation Updates**
- **Command system**: Enhanced with PowerShell formatting requirements
- **Best practices**: Added PowerShell command formatting section
- **Command templates**: Updated with proper PowerShell formatting
- **Version log**: Documented formatting enhancement

### **Why This Matters**
Users expect copy-paste PowerShell commands to work immediately. Proper line endings ensure commands execute correctly when copied from documentation.

---

## 🏗️ **Critical Architecture Documentation** (2025-06-16)

### **TNT Object Naming Convention**
**CRITICAL RULE**: All TNT Collection scripts use `const tnt = {}` as the main object name.

**Why This Matters**:
- ✅ **Memory Isolation**: Each userscript runs in isolated memory space - no naming conflicts
- ✅ **Build Process**: Main script (`tnt.collection.user.js`) combines all scripts seamlessly  
- ✅ **Copy/Paste Compatibility**: Code moves between scripts without renaming
- ✅ **Consistent API**: All scripts use `tnt.settings.get()`, `tnt.get.cityId()`, etc.

**Examples**:
```javascript
// Core Script: dev/tnt.collection.core.user.js
const tnt = { version: "1.5.26", settings: {...}, get: {...} };

// Dev Script: dev/tnt.collection.dev.user.js  
const tnt = { version: "1.0.0-dev", settings: {...}, get: {...} };

// Styles Script: dev/tnt.collection.styles.user.js
// (CSS only - no tnt object needed)
```

**Never Use**:
- ❌ `const tntDev = {}` 
- ❌ `const tntCore = {}`
- ❌ `const coreScript = {}`

**AI Tools Must Remember**: Always use `tnt = {}` in all TNT Collection scripts.

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

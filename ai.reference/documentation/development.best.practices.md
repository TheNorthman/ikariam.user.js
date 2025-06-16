# TNT Collection - Development Best Practices

## 🚫 CRITICAL USERSCRIPT LIMITATIONS & SOLUTIONS

### 🚨 Console Access Limitation - THE MOST IMPORTANT RULE
- **❌ NEVER FORGET**: UserScript functions **CANNOT** be accessed from browser console
- **❌ NOT EVEN `window.functionName`**: Assignments inside userscripts don't work for console access
- **❌ NO EXCEPTIONS**: This applies to ALL userscript functions in ALL userscript managers
- **✅ ONLY SOLUTION**: Create standalone console-pasteable code blocks for testing

### Why This Happens
- **Memory Isolation**: Each userscript runs in its own isolated execution context
- **Security Model**: Browsers prevent userscripts from exposing functions to global scope
- **Intentional Design**: This isolation is a security feature, not a bug

### 📝 Correct Testing Format
Always create standalone code blocks like this:
```javascript
// Test Name - paste this ENTIRE block in console
console.log('=== Test Name ===');
// Include ALL required code - no function calls to userscripts
if (typeof ikariam !== 'undefined') {
    // Access Ikariam objects directly
    console.log('Ikariam available');
}
console.log('=== End Test Name ===');
```

### Development Architecture That Works
- **🎯 PROVEN APPROACH**: Split development into core + dev scripts
- **📂 CORE SCRIPT**: Stable, production-ready functionality
- **🧪 DEV SCRIPT**: Clean slate for testing new features
- **🔄 WORKFLOW**: Test in dev → Move to core when stable → Clean dev script

### ⚠️ What DOESN'T Work (Common Mistakes)
- **❌ `tntHijackTooltips()`** - Function not accessible from console
- **❌ `tnt.get.cityId()`** - Core functions not accessible
- **❌ `window.tnt.function()`** - Window assignments from userscripts don't work
- **❌ Any userscript function call** - Complete isolation prevents this

### ✅ What DOES Work for Testing
- **✅ Standalone code blocks** - Complete, self-contained
- **✅ Direct Ikariam access** - `ikariam.model.currentResources`
- **✅ DOM manipulation** - `$('.tnt_wood').addClass('test')`
- **✅ Console variables** - Created directly in console

## 🎨 COMMUNICATION & DEBUGGING BEST PRACTICES

### Use Visual Icons/Emojis Extensively
- **✅ SUCCESS**: Use green checkmarks and success emojis
- **❌ ERRORS**: Use red X marks and warning emojis  
- **🔧 WORK IN PROGRESS**: Use tools and construction emojis
- **📋 INFO**: Use document and info emojis
- **🎯 TARGETS**: Use target emojis for goals
- **🚀 LAUNCHES**: Use rocket emojis for deployments

### Status Communication Examples
```javascript
console.log('🎉 SUCCESS: Feature working perfectly!');
console.log('⚠️ WARNING: Edge case detected');
console.log('❌ ERROR: Function failed');
console.log('🔧 DEBUGGING: Testing city detection...');
console.log('📊 DATA: Found 5 cities with construction');
console.log('🚀 READY: All systems functional');
```

## 🧪 TESTING METHODOLOGY

### Standalone Console Testing (THE ONLY WAY)
```javascript
// Example standalone test block
console.log('🧪 === City ID Detection Test ===');
const urlParams = new URLSearchParams(window.location.search);
const cityId = urlParams.get('cityId');
console.log('🎯 Detected City ID:', cityId);
console.log('✅ Test complete');
```

### Development Cycle
1. **🎯 IDENTIFY**: What needs testing/fixing
2. **🧪 CREATE**: Standalone console test (NOT userscript function)
3. **🔧 TEST**: Paste ENTIRE code block in console, verify behavior
4. **✅ IMPLEMENT**: Add working code to dev script
5. **🚀 DEPLOY**: Move stable code to core script
6. **🧹 CLEAN**: Reset dev script for next project

## 📋 ISSUE TRACKING BEST PRACTICES

### Use Clear Status Indicators
- **[x] COMPLETED** - ✅ Working perfectly
- **[ ] IN PROGRESS** - 🔧 Currently debugging
- **[!] CRITICAL** - ❌ Blocking issue
- **[?] INVESTIGATION** - 🔍 Needs research

### Success Documentation
```markdown
✅ **MAJOR SUCCESS - BOTH ISSUES RESOLVED!**
🎉 **Both critical issues successfully resolved:**
- **City ID Detection**: ✅ Working correctly
- **Construction Detection**: ✅ Working perfectly
🚀 **Ready for production use!**
```

## 🎯 DEVELOPMENT PRIORITIES

### Always Remember
1. **🚫 Console Limitation**: Test with standalone blocks only
2. **🎨 Visual Communication**: Use emojis for clear status
3. **📂 Clean Architecture**: Separate core from experimental
4. **🧪 Test First**: Verify with console before implementing
5. **📋 Document Success**: Track what works for future reference

## 🏆 PROVEN SUCCESSFUL PATTERNS

### The Split Architecture
- **✅ WORKS**: Core script + Dev script separation
- **✅ WORKS**: Standalone console testing
- **✅ WORKS**: Visual emoji communication
- **✅ WORKS**: Step-by-step debugging approach

### What NOT To Do
- **❌ NEVER**: Try to call userscript functions from console
- **❌ NEVER**: Assume `window.functionName` works from userscripts
- **❌ NEVER**: Mix experimental code with stable core
- **❌ NEVER**: Skip standalone testing phase
- **❌ NEVER**: Forget that userscripts are completely isolated

## 🚀 FUTURE DEVELOPMENT

When starting new features:
1. **🧹 CLEAN**: Start with clean dev script
2. **🎯 DEFINE**: Clear goal and success criteria
3. **🧪 TEST**: Create standalone console tests first (NOT userscript functions)
4. **🔧 BUILD**: Implement in dev script
5. **✅ VERIFY**: Confirm everything works with standalone tests
6. **🚀 DEPLOY**: Move to core when stable
7. **📋 DOCUMENT**: Update this guide with new learnings

## 🧹 CURRENT CLEAN STATE (2025-06-15)

### ✅ Active Systems
- **Production Script (v1.5.22)**: Protected in root - THE MOST IMPORTANT FILE
- **Core Script (v1.5.24)**: Stable, working perfectly from Git
- **Dev Script (v1.0.2)**: Clean baseline, ready for tooltip development  
- **Styles Script (v1.0.0)**: Separated CSS for better maintainability
- **Command System**: 20+ commands fully implemented
- **Backup System**: Versioned backups in `/backup/core/` and `/backup/dev/`
- **Documentation**: Current and comprehensive in ai.reference/documentation/
- **Project Structure**: Migrated to ai.reference/ and admin/ organization

### 🗑️ Deprecated/Removed Systems
- **~~docs/~~**: Completely removed and migrated to new structure
- **~~scripts/~~**: Moved to ai.reference/scripts/
- **~~Old naming conventions~~**: All files use dot notation standard

## 🛡️ BACKUP SYSTEM (CURRENT)

### Command-Based Backup Management
- **Location**: `/backup/core/` and `/backup/dev/`
- **Commands**: `BACKUP_CORE`, `BACKUP_DEV`, `LIST_BACKUPS_CORE`, etc.
- **Format**: `tnt.collection.{target}.{YYYY-MM-DD}.{NN}.user.js`
- **Auto-increment**: Running numbers never reset, complete history

## 🤖 AI COMMAND SYSTEM (CURRENT)

### Available Commands
- **BACKUP_CORE** - Create stable backup of Core script
- **BACKUP_DEV** - Create stable backup of Dev script  
- **BACKUP_BOTH** - Create stable backups of both scripts
- **UPDATE_VERSION_CORE** - Increment Core script version number
- **UPDATE_VERSION_DEV** - Increment Dev script version number
- **UPDATE_VERSION_BOTH** - Increment both script version numbers

### Command Usage
Simply start your prompt with the command:
```
BACKUP_DEV
UPDATE_VERSION_CORE
BACKUP_BOTH
```

### Full Documentation
See: `ai.reference/documentation/command.system.md`

## 📁 PROJECT STRUCTURE (POST-MIGRATION)

### Current Organization
```
tnt.collection/
├── tnt.collection.user.js           # 🚨 PRODUCTION RELEASE
├── readme.md                        # User documentation
├── backup/                          # Versioned backups
├── dev/                             # Development scripts
├── ai.reference/                    # 🤖 AI WORKSPACE
│   ├── scripts/                     # PowerShell automation
│   ├── documentation/               # This file and others
│   └── examples/                    # Future AI examples
├── reports/                         # All reporting
└── admin/                           # Project management
    ├── version.log.md
    ├── todo.md
    └── issues.md
```

### Migration Benefits
- **Clear AI boundaries** - ai.reference/ is obviously AI's domain
- **User-friendly** - Single readme.md for users
- **Organized development** - Related files together
- **Scalable structure** - Easy to expand

---
*Remember: Userscripts are completely isolated. Console testing requires standalone code blocks. The project is now cleanly organized post-migration.* 🚨
BACKUP DEV
UPDATE VERSION CORE
BACKUP BOTH

### Command Safety
- **Backup commands** - Only executed when explicitly requested
- **Version commands** - Execute immediately when requested
- **All commands** - Documented with exact procedures and restore instructions

### Full Documentation
See: `docs/development/command-system.md`

---
*Remember: Userscripts are completely isolated. Console testing requires standalone code blocks. This limitation is absolute and cannot be circumvented.* 🚨

## 🧹 PROJECT CLEANUP STATUS (2025-06-14)

### ✅ Completed Cleanups
- **Deprecated stable system**: `docs/development/stable/` marked for removal
- **Documentation updates**: All references to old systems removed
- **Version log updates**: Current state documented
- **PowerShell scripts**: Verb compliance fixed (Execute→Invoke, Create→New)

### 🗑️ FILES TO REMOVE
1. **`docs/development/stable/`** - Entire deprecated folder
2. **Any incomplete command output files** - Replace with report system
3. **Duplicate backup references** - Consolidated to `/backup/` system

### ✅ VERIFICATION CHECKLIST
- [ ] Remove `docs/development/stable/` folder completely
- [ ] Update all command references to underscore format (`BACKUP_CORE`)
- [ ] Verify PowerShell scripts use approved verbs (Invoke-, New-, Get-)
- [ ] Test command system documentation matches implementation
- [ ] Confirm version numbers current throughout project

### 🚀 POST-CLEANUP STATE
- **Command System**: 20+ commands fully documented and functional
- **Backup System**: Versioned backups in `/backup/core/` and `/backup/dev/`
- **Documentation**: Clean, current, no deprecated references
- **PowerShell Integration**: File watcher system with approved verbs
- **Project Structure**: Organized, maintainable, ready for development

## 🔧 **PowerShell Command Formatting Requirements**

### **Mandatory Line Endings**
All PowerShell commands in documentation and command responses MUST include proper line endings:

```powershell
# Example command
Get-ChildItem "folder" | Select-Object Name

```

**Key Requirements:**
- ✅ **Always include blank line after closing backticks**
- ✅ **Use CRLF/LF line endings for proper execution**
- ✅ **Include error handling with `-ErrorAction SilentlyContinue`**
- ✅ **Add verification commands to show results**

### **Example Violations**
❌ **Missing line ending**:
```powershell
Remove-Item "file.txt" -Force
```
**Problem**: No blank line after closing backticks

❌ **No error handling**:
```powershell
Remove-Item "file.txt"

```
**Problem**: Will fail if file doesn't exist

### **Correct Format**
✅ **Proper formatting**:
```powershell
# Remove file with error handling
Remove-Item "file.txt" -Force -ErrorAction SilentlyContinue

# Verify results
Test-Path "file.txt"

```

### **Why This Matters**
- **Command execution**: Improper line endings prevent PowerShell commands from running
- **User experience**: Users expect copy-paste commands to work immediately
- **Documentation quality**: Proper formatting shows attention to detail
- **Automation**: Scripts and command sequences depend on correct formatting

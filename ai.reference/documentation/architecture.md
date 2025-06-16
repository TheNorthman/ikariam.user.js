# TNT Collection - Architecture Documentation

## 🏗️ Core Architecture Principles

### **Critical Naming Convention: Always Use `tnt = {}`**

**IMPORTANT**: All TNT Collection scripts use the same object name `tnt = {}` regardless of which script file they're in.

```javascript
// ✅ CORRECT - All scripts use this pattern:
const tnt = {
    version: GM_info.script.version,
    // ... rest of implementation
};

// ❌ WRONG - Don't use script-specific names:
const tntDev = {  // NEVER DO THIS
const tntCore = { // NEVER DO THIS
const tntStyles = { // NEVER DO THIS
```

### **Why This Naming Convention Matters**

#### **1. Memory Space Isolation**
- **Each userscript runs in its own isolated memory space**
- **No naming conflicts** - `tnt` in Core script doesn't conflict with `tnt` in Dev script
- **Independent execution** - Scripts can run together or separately without interference

#### **2. Main Script Generation**
- **Target**: `tnt.collection.user.js` (the main online script users install)
- **Build Process**: Combines Core + Styles + Dev into single file
- **Naming Consistency**: All use `tnt = {}` so merging is seamless
- **No Renaming Required**: Same object name across all source files

#### **3. Development Benefits**
- **Copy/Paste Compatibility**: Code can be moved between scripts without renaming
- **Consistent API**: All scripts use `tnt.settings.get()`, `tnt.get.cityId()`, etc.
- **Easy Testing**: Dev features use same namespace as Core features
- **Predictable Structure**: Developers know to look for `tnt.` in all scripts

### **Script-Specific Identification**

Instead of different object names, use internal properties:

```javascript
// Core Script
const tnt = {
    version: GM_info.script.version, // "1.5.26"
    scriptType: "core",              // Internal identification
    // ... implementation
};

// Dev Script  
const tnt = {
    version: "1.0.0-dev",           // Different version number
    scriptType: "development",      // Internal identification
    // ... implementation
};

// Styles Script
const tnt = {
    version: "1.0.0",              // Styles version
    scriptType: "styles",          // Internal identification
    // ... implementation
};
```

### **Memory Isolation in Practice**

```javascript
// When running Core + Dev scripts together:

// Core Script Memory Space:
const tnt = { version: "1.5.26", settings: {...}, get: {...} };

// Dev Script Memory Space (SEPARATE):
const tnt = { version: "1.0.0-dev", settings: {...}, get: {...} };

// No conflicts because they're in isolated memory spaces
// Each script sees only its own 'tnt' object
```

### **Build Process for Main Script**

```javascript
// Target: tnt.collection.user.js (single file)
// Source: Core + Styles + Dev (all using 'tnt = {}')

// Build result:
const tnt = {
    // Merged from all source scripts
    version: "1.5.26",  // From Core
    settings: {...},    // From Core
    styles: {...},      // From Styles
    dev: {...}          // From Dev (if included)
};
```

## 📋 **Documentation Status**

### **What Was Wrong**
- ❌ I suggested using `tntDev.version` in console.log
- ❌ I thought different scripts needed different object names
- ❌ I didn't understand the memory isolation principle

### **What Is Correct**
- ✅ All scripts use `tnt = {}` as the main object
- ✅ Scripts run in isolated memory spaces (no conflicts)
- ✅ Consistent naming enables seamless build process
- ✅ `tnt.version` works in all scripts (refers to their own version)

### **Critical for AI Tools**
- **Always use `tnt = {}` in all TNT Collection scripts**
- **Never suggest script-specific object names like `tntDev`**
- **Remember: Memory isolation prevents naming conflicts**
- **Understand: This enables the main script build process**

## 🔧 **Practical Implications**

### **In Development**
```javascript
// Dev Script - CORRECT usage
const tnt = {
    version: "1.0.0-dev",
    
    init() {
        console.log('[TNT-Dev] Version:', tnt.version); // ✅ Uses own version
        console.log('[TNT-Dev] Core loaded:', typeof window.tnt !== 'undefined');
    }
};
```

### **When Extending Core**
```javascript
// Dev Script extending Core - CORRECT pattern
$(document).ready(() => {
    tnt.init(); // Initialize Dev script's tnt object
    
    // Check if Core script is also loaded
    if (typeof window.tnt !== 'undefined' && window.tnt.version !== tnt.version) {
        console.log('[TNT-Dev] Extending Core TNT Collection');
        // Extend Core functionality here
    }
});
```

### **For Build Process**
```javascript
// Build script can safely merge because all use 'tnt = {}'
const coreContent = readFile('dev/tnt.collection.core.user.js');
const stylesContent = readFile('dev/tnt.collection.styles.user.js');
const devContent = readFile('dev/tnt.collection.dev.user.js');

// All contain 'const tnt = {}' - no renaming needed
const mainScript = mergeScripts([coreContent, stylesContent, devContent]);
```

---

**This naming convention is fundamental to the TNT Collection architecture and must be preserved in all scripts.** 🏗️✨

# TNT Collection - Userscript Architecture Documentation

## Memory Space Isolation in Userscripts

### Key Concept: Each Userscript Runs in Its Own Isolated Memory Space

This is a fundamental concept that affects how we structure our TNT Collection code and is critical to understand for proper development.

### What This Means:
1. **Core Script** has its own `tnt = {}` object in its memory space
2. **Dev Script** has its own separate `tnt = {}` object in its memory space  
3. **These DO NOT conflict** - they exist in completely separate memory spaces
4. **Scripts CANNOT call each other's functions** directly

### 🚫 CRITICAL CONSOLE LIMITATIONS

#### ❌ Functions Inside Userscripts CANNOT Be Accessed from Browser Console
- **Dev script functions**: `tntHijackTooltips()`, `tntTestTooltip()` - **NOT ACCESSIBLE**
- **Core script functions**: `tnt.get.cityId()`, `tnt.dataCollector.update()` - **NOT ACCESSIBLE**
- **Any userscript function**: **COMPLETELY INACCESSIBLE** from console
- **Even `window.functionName`**: Does **NOT** work when assigned inside userscripts

#### ✅ What DOES Work for Testing
- **Standalone console code blocks**: Copy/paste entire code snippets into console
- **Direct object access**: `ikariam.model.currentResources` (Ikariam's native objects)
- **DOM manipulation**: `$('.tnt_wood').length` (jQuery selectors)
- **Global variables**: Only if created directly in console, not from userscripts

### Current Architecture:
```
Core Script (tnt.collection.core.user.js)
├── Memory Space A (ISOLATED)
├── tnt = { version, settings, ui, game, utils, core, data, etc. }
├── Functions: tnt.get.cityId(), tnt.dataCollector.update(), etc.
└── ❌ CANNOT be called from console or Dev script

Dev Script (tnt.collection.dev.user.js)  
├── Memory Space B (ISOLATED)
├── tnt = { version, dev, tests, etc. }
├── Functions: tnt.dev.tests.hijackTooltips(), etc.
└── ❌ CANNOT be called from console or Core script
```

### Important Limitations:
- ❌ Dev script CANNOT call `tnt.get.cityId()` from Core
- ❌ Core script CANNOT call `tnt.dev.tests.tooltip()` from Dev
- ❌ Console CANNOT call `tntHijackTooltips()` from Dev script
- ❌ Console CANNOT call `tnt.dataCollector.update()` from Core script
- ❌ No shared variables between scripts
- ❌ No direct function calls between scripts
- ❌ `tnt` objects are completely separate entities
- ❌ `window.tnt` assignments from userscripts are NOT accessible

### Communication Methods:
If scripts need to communicate, they must use:
- ✅ `window` object (global scope) - **ONLY for data, not functions**
- ✅ DOM manipulation - Shared HTML elements
- ✅ localStorage - Persistent storage
- ✅ Custom events - Event-based communication

### Example of Console Testing Reality:
```javascript
// ❌ THIS WILL NOT WORK - Cannot call userscript functions
tntHijackTooltips()  // ReferenceError: tntHijackTooltips is not defined
tnt.get.cityId()     // ReferenceError: tnt is not defined
window.tnt.get.cityId()  // undefined (even if Core assigns window.tnt = tnt)

// ✅ THIS WORKS - Standalone console code
console.log('Testing tooltip hijacking...');
if (typeof ikariam !== 'undefined' && ikariam.controller && ikariam.controller.tooltipController) {
    console.log('✅ Tooltip controller found');
    // ... rest of standalone test code
}
```

### Testing Methodology:
1. **Create standalone code blocks** - Complete, self-contained tests
2. **Test with Ikariam objects directly** - `ikariam.model`, `ikariam.controller`
3. **Use DOM selectors** - `$('.tnt_wood')`, `$('.constructionSite')`
4. **Copy/paste entire functions** - Don't rely on userscript function calls

### Current Implementation Status:
- ✅ **Core Script**: Independent, stable, complete functionality in its own memory space
- ✅ **Dev Script**: Independent, has its own separate `tnt` object with development tools
- ✅ **No conflicts**: Each script manages its own features without interference
- ✅ **Proper isolation**: Scripts run completely independently
- ✅ **Console testing**: Uses standalone code blocks, not userscript function calls

### Best Practices:
1. **Never assume userscript functions are console-accessible**
2. **Create standalone test blocks** for all console testing
3. **Use Ikariam's native objects** for data access in tests
4. **Document dependencies clearly** - What data/objects are required
5. **Test scripts separately** - Each should work independently
6. **Remember the isolation** - `tnt` in one script ≠ `tnt` in another script

### Benefits of This Isolation:
- 🔒 **Security**: Scripts can't accidentally interfere with each other
- 🛡️ **Stability**: Core remains stable even if Dev script has issues  
- 🔧 **Modularity**: Easy to enable/disable individual scripts
- 🚀 **Performance**: Each script only loads what it needs

### Key Takeaway:
This isolation is a **feature, not a bug** - it keeps our code modular, secure, and prevents conflicts. Each userscript is essentially its own mini-application running in the browser with **NO external access** to its internal functions.

---

**Critical Reminder**: Userscripts are **completely isolated**. Functions inside userscripts are **NEVER accessible** from console or other scripts. Always use standalone console code blocks for testing.

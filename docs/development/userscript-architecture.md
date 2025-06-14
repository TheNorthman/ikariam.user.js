# TNT Collection - Userscript Architecture Documentation

## Memory Space Isolation in Userscripts

### Key Concept: Each Userscript Runs in Its Own Isolated Memory Space

This is a fundamental concept that affects how we structure our TNT Collection code and is critical to understand for proper development.

### What This Means:
1. **Core Script** has its own `tnt = {}` object in its memory space
2. **Dev Script** has its own separate `tnt = {}` object in its memory space  
3. **These DO NOT conflict** - they exist in completely separate memory spaces
4. **Scripts CANNOT call each other's functions** directly

### Current Architecture:
```
Core Script (tnt.collection.core.user.js)
├── Memory Space A
├── tnt = { version, settings, ui, game, utils, core, data, etc. }
└── Runs independently

Dev Script (tnt.collection.dev.user.js)  
├── Memory Space B
├── tnt = { version, dev, tests, etc. }
└── Runs independently, completely separate from Core
```

### Important Limitations:
- ❌ Dev script CANNOT call `tnt.get.cityId()` from Core
- ❌ Core script CANNOT call `tnt.dev.tests.tooltip()` from Dev
- ❌ No shared variables between scripts
- ❌ No direct function calls between scripts
- ❌ `tnt` objects are completely separate entities

### Communication Methods:
If scripts need to communicate, they must use:
- ✅ `window` object (global scope)
- ✅ DOM manipulation
- ✅ localStorage
- ✅ Custom events
- ✅ Shared HTML elements

### Example of Proper Isolation:
```javascript
// Core Script (Memory Space A)
const tnt = {
    version: '1.5.31',
    get: { cityId() { return '12345'; } }
};
window.tnt = tnt; // Make available globally

// Dev Script (Memory Space B) - Separate tnt object!
const tnt = {
    version: '1.0.2',
    dev: { 
        tests: { 
            tooltip() { 
                // This tnt is NOT the same as Core's tnt!
                // To access Core data, must use window.tnt
                const cityId = window.tnt ? window.tnt.get.cityId() : 'N/A';
            } 
        } 
    }
};
```

### Current Implementation Status:
- ✅ **Core Script**: Independent, stable, complete functionality in its own memory space
- ✅ **Dev Script**: Independent, has its own separate `tnt` object with development tools
- ✅ **No conflicts**: Each script manages its own features without interference
- ✅ **Proper isolation**: Scripts run completely independently

### Best Practices:
1. **Keep scripts independent** - Don't assume Core functions are available in Dev
2. **Use window for shared access** - `window.tntTestTooltip = () => { /* code */ }`
3. **Document dependencies clearly** - If Dev needs Core data, access via `window`
4. **Test scripts separately** - Each should work independently
5. **Remember the isolation** - `tnt` in one script ≠ `tnt` in another script

### Benefits of This Isolation:
- 🔒 **Security**: Scripts can't accidentally interfere with each other
- 🛡️ **Stability**: Core remains stable even if Dev script has issues  
- 🔧 **Modularity**: Easy to enable/disable individual scripts
- 🚀 **Performance**: Each script only loads what it needs

### Key Takeaway:
This isolation is a **feature, not a bug** - it keeps our code modular, secure, and prevents conflicts. Each userscript is essentially its own mini-application running in the browser.

---

**Remember**: When we say "Dev extends Core" we mean functionally, not technically. They are completely separate scripts that happen to work together via shared global scope.

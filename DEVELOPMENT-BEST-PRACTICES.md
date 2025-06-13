# TNT Collection Development Best Practices

## 🚫 CRITICAL USERSCRIPT LIMITATIONS & SOLUTIONS

### Console Access Limitation
- **❌ NEVER FORGET**: UserScript functions **CANNOT** be accessed from browser console
- **✅ SOLUTION**: Always create standalone console-pasteable code blocks for testing
- **📝 FORMAT**: 
  ```javascript
  // Test Name - paste this in console
  console.log('=== Test Name ===');
  // your test code here
  console.log('=== End Test Name ===');
  ```

### Development Architecture That Works
- **🎯 PROVEN APPROACH**: Split development into core + dev scripts
- **📂 CORE SCRIPT**: Stable, production-ready functionality
- **🧪 DEV SCRIPT**: Clean slate for testing new features
- **🔄 WORKFLOW**: Test in dev → Move to core when stable → Clean dev script

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
2. **🧪 CREATE**: Standalone console test
3. **🔧 TEST**: Paste in console, verify behavior
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
- **❌ NEVER**: Mix experimental code with stable core
- **❌ NEVER**: Skip standalone testing phase
- **❌ NEVER**: Forget to document successful solutions

## 🚀 FUTURE DEVELOPMENT

When starting new features:
1. **🧹 CLEAN**: Start with clean dev script
2. **🎯 DEFINE**: Clear goal and success criteria
3. **🧪 TEST**: Create standalone console tests first
4. **🔧 BUILD**: Implement in dev script
5. **✅ VERIFY**: Confirm everything works
6. **🚀 DEPLOY**: Move to core when stable
7. **📋 DOCUMENT**: Update this guide with new learnings

---
*Remember: These practices were learned through successful resolution of major userscript integration challenges!* 🎉

# 🚨 INCIDENT REPORT: CitySwitcher Navigation Hijacking

**Date**: [Current Date]  
**Severity**: HIGH - User navigation blocked  
**Status**: ✅ RESOLVED  

## Issue Summary
CitySwitcher started automatically on direct navigation from Mayor Advisor links, preventing users from navigating directly to intended cities.

## Technical Details
- **Problem URL**: `https://s54-us.ikariam.gameforge.com/?view=city&cityId=39303&...`
- **Root Cause**: `checkAndContinue()` ran on EVERY page load without distinguishing navigation types
- **Impact**: User could not use Mayor Advisor direct links

## Secondary Issue: Core File Corruption
- **Status**: ✅ RESOLVED - Core JavaScript file restored
- **Problem**: Syntax errors, overlapping function definitions during initial fix attempt
- **Cause**: Editing error during fix attempt
- **Resolution**: Complete file restoration + proper surgical fix applied

## Root Cause Analysis
CitySwitcher's `checkAndContinue()` method lacked logic to distinguish between:
- ✅ **Intentional switching** (refresh button clicked - should continue)
- ❌ **Direct navigation** (user clicked Mayor Advisor link - should stop)

## Solution Implemented
Modified `checkAndContinue()` to only continue if `visitedCities.length > 1`, indicating an active multi-city cycle:

```javascript
checkAndContinue() {
    const isActive = tnt.settings.get("citySwitcherActive", false);
    
    if (isActive) {
        const visitedCities = tnt.settings.get("citySwitcherVisited", []);
        if (visitedCities.length > 1) {
            // Continue active cycle
            console.log('[TNT] Continuing citySwitcher cycle');
            // ...continue logic...
        } else {
            // Direct navigation - stop switcher
            console.log('[TNT] Direct navigation detected - stopping citySwitcher');
            this.isActive = false;
            tnt.settings.set("citySwitcherActive", false);
        }
    }
}
```

## Lessons Learned
1. **🔧 File Safety**: Always make surgical changes to avoid corruption
2. **🎯 User Intent**: Consider different user navigation scenarios
3. **🧪 Edge Case Testing**: Test both intended and unintended use cases
4. **📋 Incident Documentation**: Track issues for future reference

## Status: ✅ RESOLVED
- Direct navigation from Mayor Advisor works correctly
- CitySwitcher only continues during active refresh cycles
- Core file restored and functional
- All navigation methods verified working

---
*This incident highlights the importance of considering user intent in automated features.*
- Core file restored and functional
- All navigation methods verified working

---
*This incident highlights the importance of considering user intent in automated features.*

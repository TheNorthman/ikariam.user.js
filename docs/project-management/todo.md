# TNT Collection Development TODO

## Architecture Improvements
- [ ] Complete separation of core logic from presentation layer
- [ ] Implement consistent extension loading pattern
- [ ] Create shared utility functions for extensions
- [ ] Standardize settings management across extensions

## Modular Extensions (Future Development)

### **Future Extensibility**
This pattern opens up possibilities for:
- [ ] `tnt.collection.military.user.js` - Military-specific features
  - Unit management and deployment optimization
  - Attack/defense calculators
  - Military movement tracking
- [ ] `tnt.collection.trading.user.js` - Trading enhancements  
  - Market analysis tools
  - Trading route optimization
  - Profit calculators
- [ ] `tnt.collection.research.user.js` - Research management
  - Research queue planning
  - Technology tree visualization
  - Research time optimization
- [ ] `tnt.collection.themes.user.js` - Alternative visual themes
  - Dark mode theme
  - High contrast accessibility theme
  - Custom color schemes

## Core Refactoring Candidates
- [ ] Extract large data structures (building definitions, etc.)
- [ ] Separate AJAX handling into its own module
- [ ] Move notification system to separate extension
- [ ] Create dedicated data collection extension

## Performance Optimizations
- [ ] Implement lazy loading for non-critical modules
- [ ] Cache frequently accessed DOM elements
- [ ] Optimize table building with virtual scrolling for large datasets
- [ ] Add debouncing to frequent operations

## Developer Experience
- [ ] Create development documentation for extension pattern
- [ ] Add TypeScript definitions for better IDE support
- [ ] Implement automated testing framework
- [ ] Create build tools for extension packaging

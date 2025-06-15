# TNT Collection Style Management

## 🎨 Style Architecture Overview

The TNT Collection uses a **dedicated style management system** to handle all CSS and visual components separately from core logic.

## 📁 Style-Related Files

### `dev/tnt.collection.styles.user.js`
- **Purpose**: Contains all GM_addStyle calls and CSS definitions
- **Why Separated**: Large style blocks were interfering with code editing
- **Content**: Pure CSS and styling logic only
- **Integration**: Loaded alongside core script during development

### `dev/styles.jsonc`
- **Purpose**: Comprehensive documentation of all styles used
- **Format**: JSON with comments for easy editing
- **Usage**: Reference for style modifications and tracking
- **Workflow**: Edit this file → Apply changes to actual CSS
- **Location**: In dev folder with other development files

## 🔄 Style Development Workflow

### 1. Style Documentation First
```jsonc
// Example entry in dev/styles.jsonc
{
  "construction_highlighting": {
    "purpose": "Highlight cities with active construction",
    "selector": ".tnt_construction",
    "properties": {
      "background-color": "#80404050",
      "border-left": "3px solid #804040"
    },
    "usage": "Applied to city rows in resource tables",
    "file": "dev/tnt.collection.styles.user.js"
  }
}
```

### 2. Implementation in Styles File
```javascript
// In dev/tnt.collection.styles.user.js
GM_addStyle(`
    /* Construction status highlighting */
    .tnt_construction {
        background-color: #80404050 !important;
        border-left: 3px solid #804040 !important;
    }
`);
```

### 3. Integration in Core
```javascript
// In tnt.collection.core.user.js - minimal style references
const constructionClass = hasConstruction ? ' tnt_construction' : '';
```

## 🎯 Benefits of This Approach

### Development Benefits
- **🧠 Clean Logic**: Core files focus on functionality, not presentation
- **🎨 Style Focus**: All visual concerns in one dedicated file
- **🔧 Edit Safety**: Style changes don't interfere with code editing
- **📋 Documentation**: Clear overview of all styles in use

### Maintenance Benefits
- **🔍 Easy Updates**: All styles centralized and documented
- **🎨 Theme Support**: Could easily support multiple themes
- **📱 Responsive**: CSS management enables better responsive design
- **🧪 Testing**: Can test style changes independently

## 🚨 Important Guidelines

### During Development
- **✅ Document First**: Always update style overview in `dev/styles.jsonc` before implementing
- **🎨 Use Styles File**: Never add GM_addStyle to core files
- **🏷️ Meaningful Names**: Use descriptive CSS class names
- **📋 Track Changes**: Update documentation when modifying styles

### During Merging
- **📦 Include All**: Ensure all styles are merged into distribution file
- **🧪 Test Visual**: Verify all styling works in single-file format
- **🔄 Sync Documentation**: Keep style overview accurate with final code
- **🎯 Validate CSS**: Ensure no syntax errors in merged styles

---
*This separation keeps development clean while enabling powerful style management capabilities.* 🎨

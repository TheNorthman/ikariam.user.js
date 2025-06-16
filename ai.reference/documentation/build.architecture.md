# TNT Collection Build Architecture

## 🏗️ Development Workflow Overview

The TNT Collection uses a **modular development approach** that splits functionality across multiple files during development, then merges into a single distribution file for user installation.

## 📁 File Structure & Purpose

### Root Files (Distribution)
- **`tnt.collection.user.js`** - 📦 Production distribution file
  - **Single merged file** containing all functionality
  - Points to userscript update URL for easy user installation
  - **Must stay in root** - update mechanism requires this location
  - **This is what users actually install and use**

### Development Files (`/dev/` folder)
- **`dev/tnt.collection.core.user.js`** - 🧠 Core logic and functionality
  - Main application logic and data collection
  - City switching and management features
  - Game integration and AJAX handling
  
- **`dev/tnt.collection.dev.user.js`** - 🧪 Development environment
  - Clean slate for testing new features
  - Experimental functionality workspace
  - Isolated testing environment

- **`dev/tnt.collection.styles.user.js`** - 🎨 Styling and visual components
  - All GM_addStyle calls and CSS definitions
  - Visual styling and theme management
  - Separated to prevent style conflicts during code editing

- **`dev/styles.jsonc`** - 📋 Style documentation and configuration
  - Overview of all styles used in the project
  - JSON format with comments for easy editing
  - Can be edited to update styles, then applied to code
  - Centralized style management reference

## 🔄 Development to Production Workflow

### Development Phase
1. **🧠 Core Development**: Work on main features in `dev/tnt.collection.core.user.js`
2. **🧪 Feature Testing**: Experiment with new features in `dev/tnt.collection.dev.user.js`
3. **🎨 Style Updates**: Manage CSS in `dev/tnt.collection.styles.user.js`
4. **📋 Style Documentation**: Update `dev/styles.jsonc` when making style changes

### Release Phase
5. **🔧 Integration Testing**: Verify all dev components work together
6. **📦 Merge Process**: Combine stable core + styles + approved dev features
7. **🚀 Update Distribution**: Merge into root `tnt.collection.user.js`
8. **🧹 Dev Reset**: Clean `dev/tnt.collection.dev.user.js` for next project

## 🎯 Benefits of This Organization

### Development Benefits
- **📂 Clean Separation**: All development files organized in `/dev/` folder
- **🎨 Style Management**: Easy access to both CSS code and documentation
- **🧪 Isolated Testing**: Dev environment separate from stable core
- **📋 Centralized Config**: Style settings in accessible JSON format

### Distribution Benefits
- **📦 Single File**: Users get one simple file in predictable root location
- **🔄 Update Compatibility**: Standard userscript update mechanism works
- **🚀 Performance**: No overhead from multiple file loading
- **👥 User Friendly**: Simple installation and management

## 🔧 File Locations

```
📁 tnt.collection/
├── 📄 tnt.collection.user.js          (DISTRIBUTION - must stay in root)
├── 📁 dev/
│   ├── 📄 tnt.collection.core.user.js  (Core functionality)
│   ├── 📄 tnt.collection.dev.user.js   (Development workspace)
│   ├── 📄 tnt.collection.styles.user.js (CSS styling)
│   └── 📄 styles.jsonc                  (Style documentation)
└── 📁 docs/
    └── ... (documentation files)
```

## 🚨 Critical Notes

### Distribution File Location
- **🎯 MUST stay in root**: `tnt.collection.user.js` cannot be moved
- **🔄 Update URL dependency**: Userscript managers expect file in root
- **📦 Merge carefully**: All dev functionality must work in single-file format

### URL Management - IMPORTANT
- **ALL scripts** (Core, Dev, Styles) must point to production URLs
- **Download URL**: Always `https://github.com/.../tnt.collection.user.js`
- **Update URL**: Always `https://github.com/.../tnt.collection.user.js`
- **Reason**: Core/Dev are local development files, not available online
- **Users need**: Production script for updates, even during development

### Development Organization
- **📂 All dev files in `/dev/`**: Easy to find and work with
- **🎨 Style management**: Both code and config together
- **🧪 Clean workspace**: Dev environment ready for experiments
- **📋 Easy access**: Style documentation right with implementation
- **🔗 Consistent URLs**: All development scripts point to production for updates

---
*This organization balances user requirements (simple root distribution) with developer needs (organized development environment) while ensuring proper update mechanisms.*
---
*This modular approach enables stable development while maintaining a clean, single-file distribution for users.* 🏗️

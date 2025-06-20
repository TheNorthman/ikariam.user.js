# TNT Collection - AI Workspace

*Hidden AI workspace for development assistance and context management*

## ⚡ **2-Minute Post-`/clear` Catch-Up**

### **Essential Context (30 seconds)**
- **Project**: TNT Collection userscript for Ikariam browser game
- **Status**: v1.5.27 stable, comprehensive functionality working
- **Focus**: Ready for tooltip development in clean Dev script
- **Structure**: Core (stable) + Dev (experiments) + Styles (CSS)

### **Quick Health Check (30 seconds)**
- **✅ Resource tables**: Complete with visual styling and controls
- **✅ Building overview**: Categorized display with construction tracking  
- **✅ City switching**: Automated data collection across cities
- **✅ Command system**: 20+ commands for backup/restore/version management

### **Immediate Action Items (60 seconds)**
1. **Check current priorities**: [`../admin/TODO.md`](../admin/TODO.md)
2. **Review active bugs**: [`../admin/ISSUES.md`](../admin/ISSUES.md)
3. **See project health**: [`../admin/project-status.md`](../admin/project-status.md)
4. **Run command**: `UPDATE_FILES` (if files attached) or `STATUS`

---

## 🔥 **Quick Command Reference**

### **Essential 5 Commands**
```
UPDATE_FILES     # Analyze attached files, refresh AI memory
STATUS          # Show complete project health and state
BACKUP_DEV      # Create backup before development changes
LIST_COMMANDS   # Show all available commands
```

### **Development Workflow**
```
BACKUP_BOTH         # Backup Core and Dev before major work
VALIDATE_BACKUPS    # Check backup system health
RESTORE_DEV_LATEST  # Restore Dev to last known good state
UPDATE_VERSION_DEV  # Increment version after changes
```

*💡 For complete command documentation: [`command-reference.md`](command-reference.md)*

---

## 🎯 **Current Development Context**

### **Tooltip System Development** (Priority #1)
- **Goal**: Custom tooltip implementation for building/resource data
- **Challenge**: Ikariam's native tooltips create invisible elements
- **Approach**: Standalone tooltip system with proper positioning
- **Environment**: Clean Dev script v1.0.2 ready for development

### **Active Development Environment**
- **Core Script**: v1.5.27 - Stable foundation with all features
- **Dev Script**: v1.0.2 - Clean slate ready for tooltip development  
- **Styles Script**: v1.0.0 - Working CSS enhancements
- **Production**: v1.5.22 - What users install from GreasyFork

---

## 🔧 **Critical Technical Context**

### **Architecture Rules (Never Break These)**
- **Main Object**: Always use `const tnt = {}` (never tntDev, tntCore)
- **HTML Structure**: Styles script expects exact HTML from Core script
- **Control Buttons**: Must be `<span>` elements inside table headers
- **Dependencies**: tableBuilder requires `tnt.calc.production()` function

### **Working Code Insurance**
- **[`critical/modules.js`](critical/modules.js)** - Complete working implementations (DO NOT MODIFY)
- **[`critical/working.table.structure.html`](critical/working.table.structure.html)** - HTML structure reference

*💡 For detailed technical context: [`version-log.md`](version-log.md)*

---

## 📂 **Navigation & File Links**

### **Your Daily Files** (Primary Workspace)
- 📋 **Priorities**: [`../admin/TODO.md`](../admin/TODO.md)
- 🐛 **Bug Tracking**: [`../admin/ISSUES.md`](../admin/ISSUES.md)
- 📰 **Release Notes**: [`../admin/CHANGELOG.md`](../admin/CHANGELOG.md)
- 📊 **Daily Status**: [`../admin/project-status.md`](../admin/project-status.md)

### **AI Reference Files** (Technical Context)
- 📖 **Version Context**: [`version-log.md`](version-log.md)
- ⚙️ **Complete Commands**: [`command-reference.md`](command-reference.md)
- 🔒 **Code Backup**: [`critical/modules.js`](critical/modules.js)
- 🏗️ **HTML Reference**: [`critical/working.table.structure.html`](critical/working.table.structure.html)

### **Development Scripts** (Working Files)
- 🎯 **Core Script**: `../dev/tnt.collection.core.user.js` (v1.5.27 - stable)
- 🧪 **Dev Script**: `../dev/tnt.collection.dev.user.js` (v1.0.2 - experiments)
- 🎨 **Styles Script**: `../dev/tnt.collection.styles.user.js` (v1.0.0 - CSS)

---

## 📋 **Development Workflow Templates**

### **Starting New Development Session**
```
1. Attach: admin/TODO.md, admin/ISSUES.md, current working script
2. Run: UPDATE_FILES
3. Run: STATUS
4. Check: Priority tasks and current project health
5. Run: BACKUP_DEV (before making changes)
```

### **Bug Fix Workflow**
```
1. Check: admin/ISSUES.md for reported problems
2. Reference: critical/modules.js for working implementations
3. Test: Changes in Dev script first
4. Update: Issue status when resolved
```

### **Feature Development Workflow**
```
1. Check: admin/TODO.md for approved features
2. Use: Dev script for experimentation
3. Reference: Core script for integration patterns
4. Backup: Frequently during development
```

---

## 🏗️ **Project Structure Overview**

```
tnt.collection/
├── admin/                # 📁 Your daily working files
│   ├── TODO.md           # 📋 Current priorities  
│   ├── ISSUES.md         # 🐛 Active bug tracking
│   ├── CHANGELOG.md      # 📰 Public release notes
│   └── project-status.md # 📊 Daily overview
├── .ai/                  # 🤖 AI workspace (this folder)
│   ├── README.md         # 📖 This file (quick catch-up)
│   ├── version-log.md    # 📚 Essential technical context
│   ├── command-reference.md # ⚙️ Complete command system
│   ├── critical/         # 🔒 Working code backups
│   └── reports/          # 📊 Development reports
├── dev/                  # 🧪 Development scripts
├── backup/               # 💾 Versioned backups
├── tools/                # 🔧 Development utilities and scripts
└── .archive/             # 📦 Archived content
```

---

**This workspace enables 2-minute post-`/clear` catch-up and immediate effective development assistance.**

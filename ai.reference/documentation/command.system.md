# TNT Collection - AI Command System

## 🎯 Purpose
This command system enables simple, reliable commands for managing the TNT Collection project. Commands are recognized by exact format and execute documented procedures consistently.

## 📂 Backup System Architecture

### Versioned Backup Structure
```
c:\Projects\Private\Ikariam\tnt.collection\
├── backup/
│   ├── core/
│   │   ├── tnt.collection.core.2025-06-14.01.user.js
│   │   ├── tnt.collection.core.2025-06-14.02.user.js
│   │   └── tnt.collection.core.2025-06-15.03.user.js
│   └── dev/
│       ├── tnt.collection.dev.2025-06-14.01.user.js
│       ├── tnt.collection.dev.2025-06-14.02.user.js
│       └── tnt.collection.dev.2025-06-15.03.user.js
└── dev/ (working files)
    ├── tnt.collection.core.user.js
    └── tnt.collection.dev.user.js
```

### Filename Format
`tnt.collection.{target}.{YYYY-MM-DD}.{NN}.user.js`

### Running Number Logic
- **Continuously incrementing** - Never resets by date
- **Auto-detection** - Scan existing backups, find highest number, +1
- **Cross-date continuation** - Numbers grow forever (01 → 02 → 03...)
- **File system is source of truth** - No separate counter storage

## 🤖 Available Commands

### 📂 **BACKUP COMMANDS**

#### `BACKUP_CORE`
**Purpose**: Create versioned backup of current Core script  
**Source**: `dev/tnt.collection.core.user.js`  
**Destination**: `backup/core/tnt.collection.core.{current-date}.{next-number}.user.js`  
**Process**:
1. Scan `backup/core/` folder for existing backups
2. Parse filenames to extract running numbers
3. Find highest number and increment by 1
4. Create new backup file with current date and next number
5. Copy exact content from working Core script

#### `BACKUP_DEV`
**Purpose**: Create versioned backup of current Dev script  
**Source**: `dev/tnt.collection.dev.user.js`  
**Destination**: `backup/dev/tnt.collection.dev.{current-date}.{next-number}.user.js`  
**Process**: Same as BACKUP CORE but for Dev script

#### `BACKUP_BOTH`
**Purpose**: Create versioned backups of both scripts  
**Action**: Execute both `BACKUP_CORE` and `BACKUP_DEV` commands sequentially

### 🔄 **RESTORE COMMANDS**

#### `RESTORE_CORE_03`
**Purpose**: Restore Core script from backup number 03
**Format**: `RESTORE_CORE_[number]` or `RESTORE_CORE_LATEST`

#### `RESTORE_DEV_05`
**Purpose**: Restore Dev script from backup number 05

#### `RESTORE_CORE_LATEST`
**Purpose**: Restore Core script from most recent backup  
**Process**:
1. Scan `backup/core/` folder
2. Find backup with highest running number
3. Restore from that backup

#### `RESTORE_DEV_LATEST`
**Purpose**: Restore Dev script from most recent backup  
**Process**: Same as RESTORE CORE LATEST but for Dev script

### 🔢 **VERSION COMMANDS**

#### `UPDATE_VERSION_CORE`
**Purpose**: Increment Core script version number  
**Target**: `@version` line in Core script header  
**Logic**: Increment patch version (+0.0.1)  
**Example**: `1.5.24` → `1.5.25`

#### `UPDATE_VERSION_DEV`
**Purpose**: Increment Dev script version number  
**Target**: `@version` line in Dev script header  
**Logic**: Same as UPDATE VERSION CORE

#### `UPDATE_VERSION_BOTH`
**Purpose**: Increment both script version numbers  
**Action**: Execute both version update commands

### 📋 **LIST COMMANDS**

#### `LIST_COMMANDS`
**Purpose**: Display all available commands with descriptions  
**Output**: Complete command reference with usage examples

#### `LIST_BACKUPS_CORE`
**Purpose**: Show all Core script backups  
**Output**: 
```
Core Script Backups:
01 - tnt.collection.core.2025-06-14.01.user.js (15.2KB)
02 - tnt.collection.core.2025-06-14.02.user.js (15.8KB)
03 - tnt.collection.core.2025-06-15.03.user.js (16.1KB)
```

#### `LIST_BACKUPS_DEV`
**Purpose**: Show all Dev script backups  
**Output**: Similar format to LIST BACKUPS CORE

#### `LIST_BACKUPS_BOTH`
**Purpose**: Show backups for both scripts side by side

#### `LIST_VERSIONS`
**Purpose**: Show current @version numbers in working files  
**Output**:
```
Current Versions:
Core: 1.5.24
Dev:  1.0.3
```

### 📊 **STATUS COMMAND**

#### `STATUS`
**Purpose**: Show comprehensive project status  
**Output**:
```
🎯 TNT Collection Project Status

📋 **Project Health**
- **Core stability**: 🟢 Excellent (v1.5.24 restored from Git)  
- **Dev environment**: 🟢 Clean (manually reset, ready for development)  
- **Documentation**: 🟢 Comprehensive (command system, architecture, best practices)  
- **Backup system**: 🟢 Ready (versioned backup structure implemented)  
- **Git status**: 🟢 Stable (Core safely committed)  

🔬 **Tooltip Investigation Status**
- **Research phase**: ✅ Completed - Ikariam's `bindBubbleTip` system investigated  
- **Key findings**: Native system works but creates invisible tooltips  
- **Next phase**: Custom tooltip implementation ready to begin  
- **Development environment**: Clean Dev script ready for tooltip development  

🛡️ **Command System**
- **Status**: ✅ Fully implemented and documented  
- **Available commands**: 20+ commands for backup, restore, version management  
- **Documentation**: Complete command reference in `docs/development/command-system.md`  
- **Backup system**: Versioned backup structure ready (`backup/core/` and `/backup/dev/`)  

📊 **Storage Usage**
- **Backup folder**: 0 KB (no backups created yet)  
- **Documentation**: Well-organized under `docs/` folder  
- **Project structure**: Clean and ready for active development  

🔄 **Recent Activities**
- **Last backup**: None yet (command system ready for use)  
- **Last restore**: Git restore of Core script to v1.5.24  
- **Last version update**: None (ready to use UPDATE VERSION commands)  
- **Last major change**: Dev script manually cleaned out for fresh start  

📂 **Backup Status**
- **Core backups**: 0 backups (backup system ready but unused)  
- **Dev backups**: 0 backups (backup system ready but unused)  
- **Backup location**: `backup/core/` and `backup/dev/` folders created  

📁 **Working Files** (MOST IMPORTANT - ALWAYS VISIBLE)
- **Core**: v1.5.24 (Git restored, stable) - Last modified: Restored from Git  
- **Dev**: Clean state (manually cleaned out) - Ready for tooltip development  

🚀 **Ready for Development** (IMMEDIATE ACTIONS)
- ✅ **Stable foundation**: Core script working perfectly  
- ✅ **Clean development environment**: Dev script ready for tooltip work  
- ✅ **Robust backup system**: Versioned backups with command interface  
- ✅ **Comprehensive documentation**: Architecture and limitations clearly documented  
- ✅ **Proven methodology**: Standalone console testing approach established  

🎯 **Immediate Next Steps** (WHAT TO DO NOW)
1. **Begin tooltip development** in clean Dev script  
2. **Use `BACKUP_DEV`** to create first versioned backup when ready  
3. **Test custom tooltip approach** to bypass Ikariam's invisible tooltip issue  
4. **Leverage command system** for safe development with automatic backups  
```

### 🧹 **MAINTENANCE COMMANDS**

#### `CLEAN BACKUPS CORE [count]`
**Purpose**: Keep only the last N Core backups, remove older ones  
**Example**: `CLEAN BACKUPS CORE 5`  
**Process**:
1. List all Core backups by running number
2. Keep the highest N backups
3. Report which backups would be removed (but don't actually remove - just report)

#### `CLEAN BACKUPS DEV [count]`
**Purpose**: Same as CLEAN BACKUPS CORE but for Dev backups

#### `VALIDATE BACKUPS`
**Purpose**: Check all backup files for issues  
**Validation Process**:
1. **File Existence**: Verify all backup files exist
2. **JavaScript Syntax**: Parse files to detect syntax errors
3. **Header Validation**: Check userscript headers are intact
4. **Size Analysis**: Flag suspicious size variations using multi-threshold system
5. **Detailed Reporting**: List all issues found

**Size Validation Thresholds** (APPROVED):
- **Small files** (< 10KB): Flag >100% change
- **Medium files** (10-50KB): Flag >50% change  
- **Large files** (> 50KB): Flag >25% change
- **Always flag**: Files < 1KB (likely corruption)

**Sample Output**:
```
🛡️ Backup Validation Report

✅ File Existence: All 5 backup files found
✅ JavaScript Syntax: No syntax errors detected
✅ Header Validation: All userscript headers intact

📊 Size Analysis:
✅ backup 01-02: Normal progression (15.2KB → 15.8KB, +4%)
⚠️  backup 03: 15.8KB → 32.1KB (+103%) - Manual review recommended
✅ backup 04-05: Normal progression

🔍 Issues Found: 1 size anomaly
💡 Recommendation: Check backup 03 for unexpected changes
```

### 📊 **ANALYSIS COMMANDS**

#### `DIFF CORE [num1] [num2]`
**Purpose**: Show differences between two Core backup versions  
**Example**: `DIFF CORE 03 05`  
**Output**: Text-based diff showing added/removed/modified lines

#### `HISTORY CORE`
**Purpose**: Show chronological development history  
**Output**:
```
📈 Core Script Development History

01 (2025-06-14): v1.5.24 - Initial backup (15.2KB)
02 (2025-06-14): v1.5.24 - Bug fixes (15.8KB, +4%)
03 (2025-06-15): v1.5.25 - New features (32.1KB, +103%)
04 (2025-06-15): v1.5.25 - Code cleanup (16.1KB, -50%)
```

#### `SIZE REPORT`
**Purpose**: Show backup folder disk usage  
**Output**:
```
💾 Backup Storage Report

Core Backups: 5 files, 95.2KB total
Dev Backups:  3 files, 38.7KB total
Total Usage:  133.9KB

Largest: backup/core/tnt.collection.core.2025-06-15.03.user.js (32.1KB)
Smallest: backup/dev/tnt.collection.dev.2025-06-14.01.user.js (2.1KB)
```

### 🧪 **DEVELOPMENT COMMANDS**

#### `MERGE DEV TO CORE`
**Purpose**: Helper for moving tested Dev features to Core  
**Process**:
1. Show current Dev script content
2. Guide through merge process
3. Suggest testing steps
4. Remind to backup before merge

#### `OPEN CORE [number]`
**Purpose**: Display content of specific Core backup for inspection  
**Example**: `OPEN CORE 04`  
**Output**: Show backup file content (truncated if too long)

#### `OPEN DEV [number]`
**Purpose**: Display content of specific Dev backup for inspection

## 📋 **DOCUMENTATION COMMANDS**

#### `UPDATE_DOCS`
**Purpose**: Review and update all project documentation  
**Triggers automatically after**:
- Version updates (`UPDATE_VERSION_CORE`, `UPDATE_VERSION_DEV`)
- Major backup milestones (first backups, feature completions)
- Development phase changes (tooltip implementation, etc.)
- Project cleanups and reorganizations

**Manual execution**: When explicitly requested for documentation review

**Actions performed**:
1. Update version log with recent developments
2. Refresh command system documentation
3. Update architecture documentation with new features
4. Ensure all major changes are properly documented
5. Review and update status indicators
6. Verify all file paths and references are current

## 📄 **Command Output System**

### **Command.Output File**
All command outputs are written to:
```
c:\Projects\Private\Ikariam\tnt.collection\Command.Output
```

### **Benefits of File-Based Output**
- **Persistent results** - Command outputs saved for later review
- **Clean chat interface** - Chat stays focused on development discussion
- **Searchable history** - Use VS Code search on command results
- **Easy copying** - Copy specific command outputs as needed
- **Organized tracking** - All command results in one place

### **Output Format**
```
=== COMMAND: [COMMAND NAME] ===
Date: YYYY-MM-DD HH:MM:SS
Status: SUCCESS/ERROR

[Command output content]

=== END COMMAND ===
```

## 🔧 Command Execution Rules

### ✅ **Execute Immediately**
- All VERSION commands
- All LIST commands  
- STATUS
- All ANALYSIS commands (DIFF, HISTORY, SIZE REPORT)
- VALIDATE BACKUPS
- OPEN commands

### ⚠️ **Execute Only When Explicitly Requested**
- All BACKUP commands
- All RESTORE commands
- All CLEAN commands
- MERGE DEV TO CORE

### 📋 **Command Format Requirements**
- **ALL CAPS**: `BACKUP_DEV` not `backup dev`
- **Exact match**: `BACKUP_DEV` not `BACKUP THE DEV`
- **At prompt start**: "BACKUP_DEV please" works, "Please BACKUP_DEV" doesn't auto-execute
- **Space separation**: Use single spaces between words

## 🛡️ Safety Features

### **Backup Commands**
- Always increment running numbers (never overwrite)
- Include current date in filename
- Copy exact content from working files
- Report success/failure with file details

### **Restore Commands**
- Validate backup exists before attempting restore
- Show backup details before restore
- Report what will be overwritten
- Provide undo information

### **Validation**
- Check file syntax before operations
- Verify file sizes are reasonable
- Report any anomalies found
- Suggest manual review when needed

## 📝 Command Templates

### **Backup Command Response**
```markdown
### Executing Command: BACKUP [TARGET]

**Scanning**: backup/[target]/ folder for existing backups
**Found**: [N] existing backups (highest number: [X])
**Creating**: backup/[target]/tnt.collection.[target].2025-06-14.[X+1].user.js
**Source**: dev/tnt.collection.[target].user.js ([size]KB)
**Status**: ✅ Backup created successfully

**Restore Command**:
```powershell
Copy-Item "backup\[target]\tnt.collection.[target].2025-06-14.[X+1].user.js" "dev\tnt.collection.[target].user.js" -Force
```
```

### **Restore Command Response**
```markdown
### Executing Command: RESTORE [TARGET] [NUMBER]

**Searching**: backup/[target]/ for backup number [N]
**Found**: tnt.collection.[target].2025-06-XX.[N].user.js ([size]KB)
**Target**: dev/tnt.collection.[target].user.js
**Status**: ✅ Restore completed successfully

**Current backup available**: Use BACKUP [TARGET] to create restore point
```

### **Version Update Response**
```markdown
### Executing Command: UPDATE VERSION [TARGET]

**Target**: [target] script
**Previous**: 1.5.24
**New**: 1.5.25
**Status**: ✅ Version updated successfully

**Documentation Update**: Running UPDATE_DOCS to document version change...
**Version Log**: Updated with new version milestone
**Next**: Consider BACKUP [TARGET] to save this version
```

### **Backup Command Response with Documentation**
```markdown
### Executing Command: BACKUP [TARGET]

**Creating**: backup/[target]/tnt.collection.[target].2025-06-14.[X+1].user.js
**Status**: ✅ Backup created successfully

**Documentation Update**: 
- Updated backup status in project documentation
- Recorded backup milestone in version log
- Updated Command.Backup.Output with new backup entry

**Available Actions**:
[RESTORE [TARGET] [X+1]]  [LIST BACKUPS [TARGET]]  [VALIDATE BACKUPS]
```

## 💡 **ADDITIONAL COMMAND IDEAS**

### 🎯 **Smart Workflow Commands**
- `WORKFLOW_START` - Begin development workflow (backup current state, show next steps)
- `WORKFLOW_SAVE` - Save current progress (backup + version increment)
- `WORKFLOW_RESET` - Reset to last known good state
- `WORKFLOW_COMPLETE` - Complete feature (backup, merge suggestions, documentation)

### 🔄 **Automated Sequences**
- `AUTO_BACKUP_ON_CHANGE` - Monitor file changes and auto-backup when modified
- `DAILY_BACKUP` - Create daily snapshot backups
- `SMART_RESTORE` - Restore with conflict detection and merge suggestions

### 📊 **Enhanced Reports** 
- `REPORT_DEVELOPMENT` - Generate development progress report
- `REPORT_CHANGES` - Show what changed since last backup
- `REPORT_RISKS` - Identify potential issues (large file changes, missing backups)
- `REPORT_METRICS` - Development velocity, backup frequency, etc.

### 🧪 **Development Helpers**
- `CREATE_FEATURE_BRANCH` - Start new feature development with clean state
- `TEST_ENVIRONMENT` - Set up isolated testing environment
- `DEPLOY_PREVIEW` - Create preview of changes for testing
- `ROLLBACK_FEATURE` - Remove feature and restore previous state

### 🔗 **Integration Commands**
- `SYNC_WITH_GIT` - Compare backup system with Git repository
- `EXPORT_TO_GIT` - Convert backup to Git commit
- `IMPORT_FROM_GIT` - Restore from Git commit to backup system
- `BRIDGE_SYSTEMS` - Synchronize backup and Git systems

### 📱 **Quick Access Commands**
- `OPEN_CORE` - Open Core script in editor
- `OPEN_DEV` - Open Dev script in editor  
- `OPEN_DOCS` - Open documentation folder
- `OPEN_REPORTS` - Open reports folder
- `OPEN_BACKUPS` - Open backup folder

### 🎨 **Report Enhancements**
- **Folder structure**: `reports/{type}/{name}.{date}.md`
- **PowerShell integration**: Executable buttons for file operations
- **Double-click commands**: Underscore format for easy selection
- **Smart organization**: Most important info at bottom
- **Multiple report types**: Status, backups, validation, changes, etc.

### 🔧 **Command Format Improvements**
- **Underscore notation**: All commands use `COMMAND_TARGET_ACTION` format
- **Auto-completion**: Predictable command patterns
- **Contextual commands**: Commands adapt based on current project state
- **Batch operations**: Execute multiple related commands together

### 📋 **Report Types by Folder**
```
reports/
├── status/           - STATUS command outputs
├── backups/          - LIST_BACKUPS outputs  
├── validation/       - VALIDATE_BACKUPS outputs
├── changes/          - DIFF command outputs
├── development/      - Development progress reports
├── errors/           - Error reports and troubleshooting
└── metrics/          - Performance and usage statistics
```

### 🎯 **Command Categories with PowerShell Integration**

#### **File Operations** (PowerShell buttons)
```powershell
# Open files directly
code "dev\tnt.collection.dev.user.js"
code "docs\development\command-system.md"

# Navigate folders
Set-Location "backup\core"
explorer "reports\status"

# File management
Copy-Item "backup\dev\*.01.user.js" "dev\tnt.collection.dev.user.js"
```

#### **Double-Click Commands** (Text selection)
- BACKUP_DEV
- LIST_BACKUPS_CORE  
- UPDATE_VERSION_DEV
- RESTORE_CORE_LATEST
- VALIDATE_BACKUPS

#### **Hybrid Approach Benefits**
- **PowerShell buttons**: Direct file operations and system commands
- **Double-click text**: AI command interface for project management
- **Best of both worlds**: Native OS integration + AI intelligence

### 🚀 **Future Possibilities**
- **Voice commands**: "Backup dev script"
- **Hotkeys**: Ctrl+B for backup, Ctrl+R for restore
- **Visual interface**: Command palette with search
- **Automation**: Smart triggers based on file changes
- **Integration**: VS Code extension with command buttons

---

**This command system provides reliable, safe, and comprehensive backup management for the TNT Collection project. All commands are documented with exact procedures and can be executed consistently.** 🎯

**Sweet dreams! The command system will be ready for testing when you wake up!** 😴✨

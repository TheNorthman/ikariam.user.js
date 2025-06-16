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

### 🔄 **FILE ANALYSIS COMMANDS**

#### `UPDATE_FILES`
**Purpose**: Analyze files attached to the prompt and update AI internal memory with actual metrics  
**Execution**: Immediate (when files are provided)  

**🚨 CRITICAL BEHAVIOR REQUIREMENTS:**
- **MUST** only analyze files explicitly attached to current prompt
- **MUST** never reference cached information from previous conversations  
- **MUST** show "No files provided" error when no files are attached
- **MUST** report exact count of files analyzed
- **MUST** never assume or fill in file data from memory

**Process**:
1. **Count attached files** - Verify how many files are actually provided
2. **Analyze ONLY provided files** - Count actual lines, calculate file sizes
3. **Report exact file count** - State how many files were analyzed
4. **Update verification baselines** - Use real metrics instead of cached assumptions
5. **Show error if none** - Display clear error message when no files provided

**Usage**: Provide current files with the command to refresh AI memory

**Mandatory Response Format**:
```
🔄 **Executing Command: UPDATE_FILES**

### **File Analysis Results**

**Analyzing ONLY the [X] files provided in current prompt and updating AI internal memory...**

[File analysis for each provided file]

### **Current File Status Summary**

| File | Version | Lines | Size | Status |
|------|---------|-------|------|--------|
[Only files that were actually provided]

**🎯 VERIFICATION: MEMORY SUCCESSFULLY UPDATED**

**AI internal memory is now current with the [X] files you actually provided.**
```

**Example Output (with 4 files provided)**:
```
🔄 **Executing Command: UPDATE_FILES**

### **File Analysis Results**

**Analyzing ONLY the 4 files provided in current prompt and updating AI internal memory...**

✅ **Core Script**: `dev/tnt.collection.core.user.js`
   - **Lines**: 1714 (actual count from provided file)
   - **Size**: 68.2KB (calculated from content)
   - **Version**: 1.5.26 (from @version header)
   - **Status**: Complete implementation with all critical modules

✅ **Styles Script**: `dev/tnt.collection.styles.user.js`
   - **Lines**: 415 (actual count from provided file)
   - **Size**: 16.8KB (calculated from content)
   - **Version**: 1.0.0 (from @version header)
   - **Status**: Complete CSS styling system

✅ **Dev Script**: `dev/tnt.collection.dev.user.js`
   - **Lines**: 82 (actual count from provided file)
   - **Size**: 3.4KB (calculated from content)
   - **Version**: 1.0.2 (from @version header)
   - **Status**: Clean slate ready for development

✅ **Styles Config**: `dev/styles.jsonc`
   - **Lines**: 122 (actual count from provided file)
   - **Size**: 7.2KB (calculated from content)
   - **Type**: JSON configuration file

### **Current File Status Summary**

| File | Version | Lines | Size | Status |
|------|---------|-------|------|--------|
| Core Script | 1.5.26 | 1714 | 68.9KB | ✅ Complete & Working |
| Styles Script | 1.0.0 | 415 | 16.8KB | ✅ Complete CSS System |
| Dev Script | 1.0.2 | 82 | 3.4KB | ✅ Clean Slate Ready |
| Styles Config | N/A | 122 | 7.2KB | ✅ Complete Styling Rules |

**🎯 VERIFICATION: MEMORY SUCCESSFULLY UPDATED**

**AI internal memory is now current with the 4 files you actually provided.**
```

**Example Output (no files provided)**:
```
🔄 **Executing Command: UPDATE_FILES**

### **File Analysis Results**

**Analyzing ONLY the files provided in current prompt and updating AI internal memory...**

❌ **No files provided in current prompt**

### **Current File Status Summary**

| File | Version | Lines | Size | Status |
|------|---------|-------|------|--------|
| No files | N/A | 0 | 0KB | ❌ No files attached to analyze |

**🚨 ERROR: No files provided for analysis**

**AI internal memory should ONLY work with files explicitly attached to the current prompt. Since no files were provided, I should not reference any file data from memory cache.**
```

**🚨 ENFORCEMENT RULES:**
- ✅ **Only analyzes files actually attached to the prompt**
- ✅ **Reports "No files provided" if prompt has no files**
- ✅ **Never uses cached file information from previous conversations**
- ✅ **Forces dynamic analysis of provided content only**
- ✅ **Always states exact number of files analyzed**
- ❌ **FORBIDDEN: Analyzing files not provided in current prompt**
- ❌ **FORBIDDEN: Using cached file data when no files provided**
- ❌ **FORBIDDEN: Assuming file contents from memory**

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

### 🚨 **CRITICAL: Command Validation Requirements**

**Commands will ONLY be executed if ALL of the following conditions are met:**

1. **🎯 Each command must be on its own line**
   - ✅ Valid: 
     ```
     BACKUP_CORE
     UPDATE_VERSION_CORE
     ```
   - ✅ Valid: `UPDATE_FILES`
   - ❌ Invalid: `UPDATE_FILES BACKUP_CORE` (multiple commands on same line)
   - ❌ Invalid: `Look at this file!!!! :-) UPDATE_FILES`

2. **🔤 Each command must be ALL UPPERCASE**
   - ✅ Valid: `UPDATE_FILES`
   - ✅ Valid: `BACKUP_CORE`
   - ❌ Invalid: `update_files`
   - ❌ Invalid: `Update_Files`
   - ❌ Invalid: `backup_core`

3. **📋 Each command must match exact format**
   - ✅ Valid: `BACKUP_DEV`
   - ✅ Valid: `LIST_BACKUPS_CORE`
   - ❌ Invalid: `BACKUP THE DEV`
   - ❌ Invalid: `LIST BACKUPS FOR CORE`

4. **🚫 No surrounding text on the same line as a command**
   - ✅ Valid: 
     ```
     BACKUP_CORE
     LIST_BACKUPS_CORE
     ```
   - ❌ Invalid: `Please run BACKUP_CORE`
   - ❌ Invalid: `BACKUP_CORE please`

### ✅ **Execute Immediately** (when validation passes)
- All VERSION commands
- All LIST commands  
- STATUS
- All ANALYSIS commands (DIFF, HISTORY, SIZE REPORT)
- VALIDATE BACKUPS
- OPEN commands
- **UPDATE_FILES**

### ⚠️ **Execute Only When Explicitly Requested** (when validation passes)
- All BACKUP commands
- All RESTORE commands
- All CLEAN commands
- MERGE DEV TO CORE

### ❌ **NEVER Execute Commands When:**
- Command is embedded in conversational text
- Command is in mixed case or lowercase
- Command is followed by explanatory text **on the same line**
- Command is preceded by introductory text **on the same line**
- Multiple commands appear **on the same line**
- Command is part of a question or request

### ✅ **VALID Multi-Command Examples**

```
✅ Multiple commands on separate lines:
BACKUP_CORE
UPDATE_VERSION_CORE
LIST_BACKUPS_CORE

✅ Single command:
UPDATE_FILES

✅ Multiple commands with blank lines:
BACKUP_DEV

UPDATE_VERSION_DEV

STATUS
```

### ❌ **INVALID Multi-Command Examples**

```
❌ Multiple commands on same line:
UPDATE_FILES BACKUP_CORE

❌ Commands with surrounding text:
Please run BACKUP_CORE
And then UPDATE_VERSION_CORE

❌ Mixed valid/invalid:
BACKUP_CORE
Please also run UPDATE_VERSION_CORE
```

### 🛡️ **AI Enforcement Protocol**

Before executing ANY command, AI must verify:

1. **🔍 Parse each line separately** - Treat each line as a potential individual command
2. **🔤 Check case sensitivity** - Is each command 100% uppercase?
3. **📋 Validate format** - Does each command match documented patterns?
4. **🚫 Check for surrounding text** - Is there any other text on the same line as the command?
5. **✅ Execute valid commands** - Process each valid command that passes all checks
6. **❌ Skip invalid lines** - Treat invalid lines as conversational text

### 📋 **Command Format Requirements**
- **ALL CAPS**: `BACKUP_DEV` not `backup dev`
- **Exact match**: `BACKUP_DEV` not `BACKUP THE DEV`
- **Standalone only**: Command must be the ENTIRE prompt content
- **No surrounding text**: No explanations, questions, or additional content
- **Space separation**: Use single spaces between words in multi-word commands

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

## 🛡️ **BACKUP VERIFICATION SYSTEM**

### **CRITICAL REQUIREMENT**
**ALL backup operations MUST include verification to ensure the backup is identical to the source file.**

### **Verification Process**
1. **Create backup** from source file
2. **Compare files** byte-for-byte or line-for-line  
3. **Report verification status** - PASS/FAIL
4. **Only report success** if verification passes
5. **Report specific differences** if verification fails

### **Verification Methods**
- **Line count comparison** - Must match exactly
- **File size comparison** - Must match exactly  
- **Content hash comparison** - Must match exactly
- **Key function verification** - Critical functions must be present

### **Command Response Format with Verification**
```markdown
### Executing Command: BACKUP_CORE

**Creating**: backup/core/tnt.collection.core.{date}.{running number}.user.js
**Source**: dev/tnt.collection.core.user.js (analyzing file...)
**Status**: ✅ Backup created successfully

**Verification Results**:
✅ **File size**: [source size] → [backup size] (MATCH)
✅ **Line count**: [source lines] → [backup lines] (MATCH) 
✅ **Content hash**: SHA256 verified (IDENTICAL)
✅ **Critical functions**: All tableBuilder, citySwitcher functions present
✅ **Version header**: @version preserved

🎯 **VERIFICATION: PASSED** - Backup is identical to source

**Restore Command**:
```powershell
Copy-Item "backup\core\tnt.collection.core.{date}.{running number}.user.js" "dev\tnt.collection.core.user.js" -Force
```
```

### **Failed Verification Response**
```markdown
### Executing Command: BACKUP_CORE

**Creating**: backup/core/tnt.collection.core.{date}.{running number}.user.js
**Source**: dev/tnt.collection.core.user.js (analyzing file...)
**Status**: ❌ Backup verification FAILED

**Verification Results**:
✅ **File size**: [source size] → [backup size] (MATCH/MISMATCH)
❌ **Line count**: [source lines] → [backup lines] (MISMATCH: difference details)
❌ **Content differences detected**:
   - Specific differences found during verification
   - Missing or truncated sections identified

🚨 **VERIFICATION: FAILED** - Backup is NOT identical to source

**Action Required**: 
- Review backup creation process
- Check for truncation or corruption issues
- Do NOT use this backup for restoration
```

### **Mandatory Verification Checks**
1. **File Existence** - Backup file was actually created
2. **Size Match** - Byte-for-byte size comparison
3. **Line Count** - Exact line count comparison
4. **Critical Content** - Key functions and objects present:
   - `tnt.tableBuilder.buildResourceTable()`
   - `tnt.tableBuilder.buildBuildingTable()`
   - `tnt.citySwitcher.start()`
   - `tnt.dataCollector.update()`
   - `tnt.calc.production()`
   - `tnt.has.construction()`

### **Trust Rebuilding Protocol**
- **Never report backup success** without verification
- **Always show verification details** in command output
- **Flag any discrepancies immediately**
- **Provide specific difference details** when verification fails
- **Update backup system** if verification consistently fails

## 📝 Command Templates

### **Backup Command Response**
```markdown
### Executing Command: BACKUP [TARGET]

**Scanning**: backup/[target]/ folder for existing backups
**Found**: [N] existing backups (highest number: [X])
**Creating**: backup/[target]/tnt.collection.[target].2025-06-14.[X+1].user.js
**Source**: dev/tnt.collection.[target].user.js ([size]KB)
**Status**: ✅ Backup created successfully

**Cleanup PowerShell Commands**:
```powershell
# Verify backup was created successfully
Test-Path "backup\[target]\tnt.collection.[target].2025-06-14.[X+1].user.js"

# Show backup folder contents
Get-ChildItem "backup\[target]\" | Sort-Object Name

# Cleanup old backups if needed (keep last 5)
Get-ChildItem "backup\[target]\*.user.js" | Sort-Object Name | Select-Object -SkipLast 5 | ForEach-Object { Write-Host "Would remove: $($_.Name)" }

```

**Restore Command**:
```powershell
Copy-Item "backup\[target]\tnt.collection.[target].2025-06-14.[X+1].user.js" "dev\tnt.collection.[target].user.js" -Force

```
```

### **File Organization Command Response**
```markdown
### Executing Command: [FILE_ORGANIZATION]

**Status**: ✅ File organization completed successfully

**Cleanup PowerShell Commands**:
```powershell
# Remove deprecated files
Remove-Item "path\to\deprecated\file.ext" -Force -ErrorAction SilentlyContinue

# Move files to correct locations
if (Test-Path "source\path\file.ext") {
    Move-Item "source\path\file.ext" "destination\path\file.ext" -Force
}

# Verify clean structure
Write-Host "✅ Cleanup completed. Current structure:"
Get-ChildItem "target\folder" -Recurse | Select-Object FullName

```
```

## 🔧 **CRITICAL: PowerShell Command Requirements**

**All file management commands MUST include PowerShell commands with proper formatting:**

### **Required Elements**
1. **Commands end with proper line termination** - Always include CRLF/LF after PowerShell blocks
2. **Error handling** - Use `-ErrorAction SilentlyContinue` for cleanup operations
3. **Verification steps** - Include commands to verify results
4. **Clear formatting** - Use proper PowerShell syntax with backticks for code blocks

### **Example of Proper Formatting**
```powershell
# Remove deprecated files
Remove-Item "path\to\file.ext" -Force -ErrorAction SilentlyContinue

# Verify results
Get-ChildItem "target\folder" -Recurse | Select-Object FullName

```

**Notice the blank line after the closing backticks - this is REQUIRED for proper command execution.**

### **Common Mistakes to Avoid**
❌ **Missing line ending after PowerShell block**:
```powershell
Get-ChildItem "folder"
```
**❌ No blank line - commands may not execute properly**

✅ **Correct formatting with line ending**:
```powershell
Get-ChildItem "folder"

```
**✅ Proper blank line ensures command execution**

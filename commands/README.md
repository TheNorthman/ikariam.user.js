# TNT Collection - File-Based Command Interface

## 🎯 How It Works

The File Watcher System monitors the `commands\pending\` folder for `.cmd` files and executes the commands they contain.

## 🚀 Quick Start

1. **Start the File Watcher**:
   ```powershell
   .\scripts\TNT-FileWatcher.ps1
   ```

2. **Execute Commands** by creating .cmd files in `commands\pending\`:
   ```
   # Create backup-dev.cmd containing:
   BACKUP_DEV
   
   # Create status.cmd containing:
   STATUS
   ```

3. **View Results** in `reports\commands\` folder

## 📂 Folder Structure
```
commands/
├── pending/          # Place .cmd files here to execute
├── processed/        # Executed commands moved here
├── templates/        # Template .cmd files
└── README.md        # This file
```

## 🎯 Available Commands

### Backup Commands
- **BACKUP_DEV** - Create versioned backup of Dev script
- **BACKUP_CORE** - Create versioned backup of Core script

### Information Commands  
- **STATUS** - Show project status and backup counts
- **LIST_BACKUPS_CORE** - List all Core script backups
- **LIST_BACKUPS_DEV** - List all Dev script backups

### Version Commands
- **UPDATE_VERSION_DEV** - Increment Dev script version number
- **UPDATE_VERSION_CORE** - Increment Core script version number

## 🔘 Command Buttons (PowerShell Integration)

VS Code will show "Run" buttons next to PowerShell commands in reports:

```powershell
# Create command files quickly
"BACKUP_DEV" | Out-File "commands\pending\backup-dev.cmd"
"STATUS" | Out-File "commands\pending\status.cmd"

# Open result folders
explorer "reports\commands"
explorer "backup\dev"
```

## 📄 Command Templates

Create these template files for quick execution:

### backup-dev.cmd
```
BACKUP_DEV
```

### status.cmd  
```
STATUS
```

### update-version-dev.cmd
```
UPDATE_VERSION_DEV
```

## 🎯 Benefits

### ✅ True Command Buttons
- **PowerShell integration** creates actual clickable buttons in VS Code
- **File-based commands** can be executed with "Run" buttons
- **Automatic execution** via file watcher system

### ✅ Persistent Results
- **Command reports** saved in `reports\commands\`
- **Execution history** in `commands\processed\`
- **Searchable outputs** via VS Code

### ✅ Easy Workflow
- **Double-click selection** of command names
- **Quick file creation** via PowerShell buttons
- **Automatic processing** with file watcher

---

**This system creates actual executable command buttons through PowerShell + File Watcher integration!**

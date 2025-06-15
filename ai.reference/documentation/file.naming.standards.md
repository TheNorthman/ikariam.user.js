# TNT Collection - File Naming Standards

## 🎯 Naming Convention: Dot Notation

All files in the TNT Collection project use **lowercase with dots** (dot notation) to match the main script naming.

### ✅ Correct Examples
- `file.watcher.ps1`
- `tnt.collection.core.user.js` 
- `userscript.architecture.md`
- `version.log.md`
- `command.system.md`
- `development.best.practices.md`

### ❌ Incorrect Examples
- `file-watcher.ps1` (kebab-case)
- `FileWatcher.ps1` (PascalCase)
- `file_watcher.ps1` (snake_case)
- `fileWatcher.ps1` (camelCase)

## 📁 Folder Structure
Folders remain simple lowercase:
```
tnt.collection/
├── backup/
│   ├── core/
│   └── dev/
├── docs/
│   ├── development/
│   └── project.management/
├── reports/
│   ├── status/
│   ├── backups/
│   └── commands/
└── scripts/
```

## 🎯 File Type Guidelines

### JavaScript Files
- **User Scripts**: `tnt.collection.core.user.js`, `tnt.collection.dev.user.js`
- **Regular JS**: `utility.functions.js`, `data.collector.js`

### PowerShell Scripts  
- **Scripts**: `file.watcher.ps1`, `backup.manager.ps1`
- **Modules**: `collection.commands.psm1`

### Documentation
- **Markdown**: `readme.md`, `version.log.md`, `command.system.md`
- **Text**: `changelog.txt`, `notes.txt`

### Configuration
- **JSON**: `settings.json`, `backup.config.json`
- **XML**: `project.config.xml`

## 🔧 Benefits of Dot Notation

### ✅ Advantages
- **Consistent with main scripts**: Matches `tnt.collection.core.user.js` pattern
- **Namespace-like**: Clear hierarchical structure
- **Readable**: Easy to understand component separation
- **Cross-platform**: Compatible with all operating systems
- **Version control**: Git-friendly naming

### ✅ Best Practices
1. **Always lowercase** - Never mix case
2. **Use dots** - Separate components with `.`
3. **Be descriptive** - `user.settings.md` not `config.md`
4. **Avoid abbreviations** - `command.system.md` not `cmd.sys.md`
5. **Consistent extensions** - `.md` for markdown, `.ps1` for PowerShell

## 🔄 Migration from Kebab-Case

### Files to Rename
```powershell
# Old kebab-case → New dot notation
file-watcher.ps1 → file.watcher.ps1
command-system.md → command.system.md
userscript-architecture.md → userscript.architecture.md
version-log.md → version.log.md
development-best-practices.md → development.best.practices.md
```

---

**This standard ensures consistency with the main script naming pattern across the entire TNT Collection project.**

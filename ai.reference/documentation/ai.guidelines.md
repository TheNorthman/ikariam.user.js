# TNT Collection - AI Collaboration Guidelines

## 📅 Date Management

### Always Ask for Current Date
- **❌ NEVER assume or guess dates** in documentation
- **✅ ALWAYS ask the user for current date** when updating files with timestamps
- **📝 Be explicit**: "What is the current date?" before making date-related updates

### Examples of Date-Sensitive Content
- Version release dates in `admin/version.log.md`
- "Last Updated" timestamps in project status files
- Incident report dates
- Changelog entries
- Any documentation requiring current date stamps

### Best Practice
```markdown
**Question:** What is the current date? I need to update the documentation with accurate timestamps.

**Usage:** Use provided date (e.g., 2025-06-15) for all current date references
```

## 📁 Project Structure Understanding

### Current Organization (Post-Migration)
```
tnt.collection/
├── tnt.collection.user.js           # 🚨 PRODUCTION RELEASE - MOST IMPORTANT
├── readme.md                        # User documentation
├── backup/                          # Versioned backups
├── dev/                             # Development scripts
├── ai.reference/                    # 🤖 AI WORKSPACE (this is your domain)
│   ├── scripts/                     # PowerShell automation tools
│   ├── documentation/               # Development guides and AI references
│   └── examples/                    # AI examples and templates
├── reports/                         # 📊 ALL REPORTING
└── admin/                           # 📋 PROJECT MANAGEMENT
```

### File Path Updates After Migration
- **Version Log**: `admin/version.log.md` (not docs/project.management/)
- **AI Guidelines**: `ai.reference/documentation/ai.guidelines.md`
- **Command System**: `ai.reference/documentation/command.system.md`
- **Development Practices**: `ai.reference/documentation/development.best.practices.md`

## 🤖 AI Development Workflow

### Before Making Date-Related Changes
1. **Ask for current date** if not already known
2. **Confirm format**: Verify the date format preference
3. **Update consistently**: Apply the same date to all relevant files
4. **Document updates**: Note what was changed and when

### File Organization Guidelines
- **AI Reference Files**: Always place AI-specific documentation in `ai.reference/documentation/`
- **Project Management**: Version logs, todos, issues go in `admin/`
- **User Documentation**: Keep user-facing docs simple in root `readme.md`
- **Scripts**: PowerShell and automation scripts in `ai.reference/scripts/`

## 🎯 Key Reminders

- **Current Date (Session)**: 2025-06-15 (ask if this changes)
- **Most Important File**: `tnt.collection.user.js` in root (production release)
- **AI Workspace**: `ai.reference/` folder (hands-off zone for users)
- **Project Structure**: Migrated and clean as of 2025-06-15
- **File Naming**: Dot notation standard throughout (`file.name.ext`)

---
*This guideline ensures accurate and consistent development in the migrated TNT Collection project.*

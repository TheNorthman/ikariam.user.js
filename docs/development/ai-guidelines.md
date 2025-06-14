# TNT Collection - AI Collaboration Guidelines

## 📅 Date Management

### Always Ask for Current Date
- **❌ NEVER assume or guess dates** in documentation
- **✅ ALWAYS ask the user for current date** when updating files with timestamps
- **📝 Be explicit**: "What is the current date?" before making date-related updates

### Examples of Date-Sensitive Content
- Version release dates in `version-log.md`
- "Last Updated" timestamps in project status files
- Incident report dates
- Changelog entries
- Any documentation requiring current date stamps

### Best Practice
```markdown
**Question:** What is the current date? I need to update the documentation with accurate timestamps.

**Usage:** Use provided date (e.g., 2025-06-14) for all current date references
```

## 📋 Documentation Standards

### File Naming
- **Use lowercase with hyphens**: `ai-guidelines.md`, `userscript-architecture.md`
- **Avoid mixed case**: Not `AI-Guidelines.md` or `AIGuidelines.md`
- **Be consistent**: Follow established naming patterns

### Date Formats
- **ISO format**: `YYYY-MM-DD` (e.g., 2025-06-14)
- **Consistent across all files**: Use same format everywhere
- **Clear timestamps**: Include in "Last Updated" sections

## 🤖 AI Development Workflow

### Before Making Date-Related Changes
1. **Ask for current date** if not already known
2. **Confirm format**: Verify the date format preference
3. **Update consistently**: Apply the same date to all relevant files
4. **Document updates**: Note what was changed and when

### Communication Protocol
- **Be explicit about date needs**: Don't silently use placeholder dates
- **Ask once per session**: Get current date early and reference it throughout
- **Warn about date updates**: Alert user when files will include current date stamps

## 🎯 Key Reminders

- **Current Date (Session)**: 2025-06-14 (ask if this changes)
- **Always confirm dates**: Don't assume or use placeholders
- **User awareness**: Make sure user knows when dates are being added to files
- **Consistency**: Use the same date format across all documentation

---
*This guideline ensures accurate and consistent date management in TNT Collection documentation.*

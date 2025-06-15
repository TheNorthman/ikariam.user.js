# TNT Collection - Backup History Report
**Generated**: 2025-06-14  
**Command**: LIST_BACKUPS_BOTH  

## 🎯 QUICK ACTIONS (DOUBLE-CLICK TO SELECT)
BACKUP_DEV | LIST_BACKUPS_CORE | VALIDATE_BACKUPS | RESTORE_DEV_LATEST

## 📂 Core Script Backups
(No backups created yet - system ready)

## 🧪 Dev Script Backups  
(No backups created yet - system ready)

## 📊 Backup Statistics
- **Total backups**: 0
- **Disk usage**: 0 KB
- **Last backup**: Never
- **System status**: ✅ Ready for first backup

## 🔄 Suggested Actions
1. BACKUP_DEV - Create first backup of clean Dev state
2. BACKUP_CORE - Create backup of stable Core v1.5.24

# PowerShell Backup Management
# Check backup folders
Get-ChildItem "c:\Projects\Private\Ikariam\tnt.collection\backup\core" | Format-Table
Get-ChildItem "c:\Projects\Private\Ikariam\tnt.collection\backup\dev" | Format-Table

# Calculate folder sizes
$coreSize = (Get-ChildItem "c:\Projects\Private\Ikariam\tnt.collection\backup\core" -Recurse | Measure-Object -Property Length -Sum).Sum
$devSize = (Get-ChildItem "c:\Projects\Private\Ikariam\tnt.collection\backup\dev" -Recurse | Measure-Object -Property Length -Sum).Sum
Write-Host "Core backups: $($coreSize/1KB) KB"
Write-Host "Dev backups: $($devSize/1KB) KB"

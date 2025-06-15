```powershell
# Collection Project - File Watcher Command System
# Uses dot notation naming convention to match project files

param(
    [string]$ProjectRoot = "c:\Projects\Private\Ikariam\tnt.collection"
)

Write-Host "🤖 Collection File Watcher Started" -ForegroundColor Green
Write-Host "Project Root: $ProjectRoot" -ForegroundColor Cyan
Write-Host "File Naming: Using dot notation (file.watcher.ps1)" -ForegroundColor Yellow

# Ensure command directories exist
$commandsPath = Join-Path $ProjectRoot "commands"
$pendingPath = Join-Path $commandsPath "pending"
$processedPath = Join-Path $commandsPath "processed"

New-Item -ItemType Directory -Path $commandsPath -Force | Out-Null
New-Item -ItemType Directory -Path $pendingPath -Force | Out-Null
New-Item -ItemType Directory -Path $processedPath -Force | Out-Null

# Create file system watcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $pendingPath
$watcher.Filter = "*.cmd"
$watcher.EnableRaisingEvents = $true
$watcher.IncludeSubdirectories = $false

# Command execution functions
function Invoke-TNTCommand {
    param([string]$CommandFile)
    
    $command = Get-Content $CommandFile -Raw
    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $commandName = [System.IO.Path]::GetFileNameWithoutExtension($CommandFile)
    
    Write-Host "⚡ Executing: $command" -ForegroundColor Yellow
    
    switch -Regex ($command.Trim()) {
        "^BACKUP_DEV$" {
            $result = Invoke-BackupDev
            New-CommandReport "BACKUP_DEV" $result $timestamp
        }
        "^BACKUP_CORE$" {
            $result = Invoke-BackupCore  
            New-CommandReport "BACKUP_CORE" $result $timestamp
        }
        "^STATUS$" {
            $result = Invoke-Status
            New-CommandReport "STATUS" $result $timestamp
        }
        "^LIST_BACKUPS_CORE$" {
            $result = Invoke-ListBackupsCore
            New-CommandReport "LIST_BACKUPS_CORE" $result $timestamp
        }
        "^UPDATE_VERSION_DEV$" {
            $result = Invoke-UpdateVersionDev
            New-CommandReport "UPDATE_VERSION_DEV" $result $timestamp
        }
        default {
            $result = "❌ Unknown command: $command"
            New-CommandReport "ERROR" $result $timestamp
        }
    }
    
    # Move processed command to processed folder
    $processedFile = Join-Path $processedPath "$commandName.$timestamp.cmd"
    Move-Item $CommandFile $processedFile
}

function Invoke-BackupDev {
    try {
        $timestamp = Get-Date -Format "yyyy-MM-dd"
        
        # Find next backup number
        $backupFiles = Get-ChildItem "$ProjectRoot\backup\dev\*.user.js" -ErrorAction SilentlyContinue
        $nextNumber = ($backupFiles.Count + 1).ToString("00")
        
        # Create backup
        $backupPath = "$ProjectRoot\backup\dev\tnt.collection.dev.$timestamp.$nextNumber.user.js"
        Copy-Item "$ProjectRoot\dev\tnt.collection.dev.user.js" $backupPath
        
        return "✅ Dev backup created: backup\dev\tnt.collection.dev.$timestamp.$nextNumber.user.js"
    }
    catch {
        return "❌ Backup failed: $($_.Exception.Message)"
    }
}

function Invoke-BackupCore {
    try {
        $timestamp = Get-Date -Format "yyyy-MM-dd"
        
        # Find next backup number
        $backupFiles = Get-ChildItem "$ProjectRoot\backup\core\*.user.js" -ErrorAction SilentlyContinue
        $nextNumber = ($backupFiles.Count + 1).ToString("00")
        
        # Create backup
        $backupPath = "$ProjectRoot\backup\core\tnt.collection.core.$timestamp.$nextNumber.user.js"
        Copy-Item "$ProjectRoot\dev\tnt.collection.core.user.js" $backupPath
        
        return "✅ Core backup created: backup\core\tnt.collection.core.$timestamp.$nextNumber.user.js"
    }
    catch {
        return "❌ Backup failed: $($_.Exception.Message)"
    }
}

function Invoke-Status {
    $coreBackups = (Get-ChildItem "$ProjectRoot\backup\core\*.user.js" -ErrorAction SilentlyContinue).Count
    $devBackups = (Get-ChildItem "$ProjectRoot\backup\dev\*.user.js" -ErrorAction SilentlyContinue).Count
    
    $coreVersion = "Unknown"
    $devVersion = "Unknown"
    
    # Extract versions from files
    try {
        $coreContent = Get-Content "$ProjectRoot\dev\tnt.collection.core.user.js" -Raw
        if ($coreContent -match '@version\s+([0-9.]+)') {
            $coreVersion = $matches[1]
        }
    } catch {}
    
    try {
        $devContent = Get-Content "$ProjectRoot\dev\tnt.collection.dev.user.js" -Raw -ErrorAction SilentlyContinue
        if ($devContent -match '@version\s+([0-9.]+)') {
            $devVersion = $matches[1]
        }
    } catch {}
    
    return @"
📊 TNT Collection Status

📁 Working Files:
- Core: v$coreVersion (Stable)
- Dev: v$devVersion (Development)

📂 Backup Status:
- Core backups: $coreBackups
- Dev backups: $devBackups

🔄 File Watcher: Active and monitoring commands
"@
}

function Invoke-ListBackupsCore {
    $backups = Get-ChildItem "$ProjectRoot\backup\core\*.user.js" -ErrorAction SilentlyContinue | 
               Sort-Object LastWriteTime | 
               ForEach-Object {
                   $size = [math]::Round($_.Length / 1KB, 1)
                   "$($_.Name) ($size KB) - $($_.LastWriteTime.ToString('yyyy-MM-dd HH:mm'))"
               }
    
    if ($backups) {
        return "📂 Core Script Backups:`n" + ($backups -join "`n")
    } else {
        return "📂 Core Script Backups:`n(No backups found)"
    }
}

function Invoke-UpdateVersionDev {
    try {
        $filePath = "$ProjectRoot\dev\tnt.collection.dev.user.js"
        if (-not (Test-Path $filePath)) {
            return "❌ Dev script not found"
        }
        
        $content = Get-Content $filePath -Raw
        if ($content -match '@version\s+([0-9]+)\.([0-9]+)\.([0-9]+)') {
            $major = [int]$matches[1]
            $minor = [int]$matches[2]
            $patch = [int]$matches[3] + 1
            
            $newVersion = "$major.$minor.$patch"
            $newContent = $content -replace '@version\s+[0-9.]+', "@version      $newVersion"
            
            Set-Content $filePath $newContent -NoNewline
            return "✅ Dev version updated: $($matches[0]) → v$newVersion"
        } else {
            return "❌ Version not found in Dev script"
        }
    }
    catch {
        return "❌ Version update failed: $($_.Exception.Message)"
    }
}

function New-CommandReport {
    param([string]$Command, [string]$Result, [string]$Timestamp)
    
    $reportPath = "$ProjectRoot\reports\commands\command.execution.$Timestamp.md"
    $reportDir = Split-Path $reportPath -Parent
    New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
    
    $reportContent = @"
# TNT Collection - Command Execution Report
**Generated**: $Timestamp  
**Command**: $Command  

## 🎯 COMMAND RESULT
$Result

## 📋 QUICK ACTIONS (DOUBLE-CLICK TO SELECT)
BACKUP_DEV | BACKUP_CORE | STATUS | LIST_BACKUPS_CORE

## 🔄 CREATE NEW COMMAND
To execute another command, create a new .cmd file in:
``commands\pending\``

Example files:
- ``backup.dev.cmd`` (containing: BACKUP_DEV)
- ``status.cmd`` (containing: STATUS)
- ``update.version.cmd`` (containing: UPDATE_VERSION_DEV)

# PowerShell Quick Actions
# Open key directories
explorer "$ProjectRoot\backup"
explorer "$ProjectRoot\reports"
code "$ProjectRoot\dev\tnt.collection.dev.user.js"
"@
    
    Set-Content $reportPath $reportContent -Encoding UTF8
    Write-Host "📄 Report created: reports\commands\command.execution.$Timestamp.md" -ForegroundColor Green
}

# Event handler for file changes
$action = {
    $path = $Event.SourceEventArgs.FullPath
    $name = $Event.SourceEventArgs.Name
    $changeType = $Event.SourceEventArgs.ChangeType
    
    if ($changeType -eq 'Created' -and $name.EndsWith('.cmd')) {
        Start-Sleep -Milliseconds 100  # Brief delay to ensure file is fully written
        Invoke-TNTCommand $path
    }
}

# Register event handler
Register-ObjectEvent -InputObject $watcher -EventName Created -Action $action

Write-Host "✅ File Watcher is now active!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 To execute commands, create .cmd files in: commands\pending\" -ForegroundColor Yellow
Write-Host "Example: Create 'backup.dev.cmd' containing 'BACKUP_DEV'" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the watcher..." -ForegroundColor Red

# Keep the script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
}
finally {
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Write-Host "🛑 File Watcher stopped" -ForegroundColor Red
}
```
# Collection Commands - PowerShell Module for Project Management
# Provides PowerShell functions that mirror the AI command system

function BACKUP_DEV {
    $projectRoot = "c:\Projects\Private\Ikariam\tnt.collection"
    $timestamp = Get-Date -Format "yyyy-MM-dd"
    
    # Find next backup number
    $backupFiles = Get-ChildItem "$projectRoot\backup\dev\*.user.js" -ErrorAction SilentlyContinue
    $nextNumber = ($backupFiles.Count + 1).ToString("00")
    
    # Create backup
    $backupPath = "$projectRoot\backup\dev\tnt.collection.dev.$timestamp.$nextNumber.user.js"
    Copy-Item "$projectRoot\dev\tnt.collection.dev.user.js" $backupPath
    
    Write-Host "✅ Dev backup created: $backupPath" -ForegroundColor Green
}

function BACKUP_CORE {
    $projectRoot = "c:\Projects\Private\Ikariam\tnt.collection"
    $timestamp = Get-Date -Format "yyyy-MM-dd"
    
    # Find next backup number
    $backupFiles = Get-ChildItem "$projectRoot\backup\core\*.user.js" -ErrorAction SilentlyContinue
    $nextNumber = ($backupFiles.Count + 1).ToString("00")
    
    # Create backup
    $backupPath = "$projectRoot\backup\core\tnt.collection.core.$timestamp.$nextNumber.user.js"
    Copy-Item "$projectRoot\dev\tnt.collection.core.user.js" $backupPath
    
    Write-Host "✅ Core backup created: $backupPath" -ForegroundColor Green
}

function STATUS {
    $projectRoot = "c:\Projects\Private\Ikariam\tnt.collection"
    
    Write-Host "📊 TNT Collection Status" -ForegroundColor Green
    
    # Get versions
    $coreVersion = "Unknown"
    $devVersion = "Unknown"
    
    try {
        $coreContent = Get-Content "$projectRoot\dev\tnt.collection.core.user.js" -Raw
        if ($coreContent -match '@version\s+([0-9.]+)') {
            $coreVersion = $matches[1]
        }
    } catch {}
    
    try {
        $devContent = Get-Content "$projectRoot\dev\tnt.collection.dev.user.js" -Raw -ErrorAction SilentlyContinue
        if ($devContent -match '@version\s+([0-9.]+)') {
            $devVersion = $matches[1]
        }
    } catch {}
    
    Write-Host "📁 Working Files:" -ForegroundColor Cyan
    Write-Host "  Core: v$coreVersion" -ForegroundColor White
    Write-Host "  Dev: v$devVersion" -ForegroundColor White
    
    # Get backup counts
    $coreBackups = (Get-ChildItem "$projectRoot\backup\core\*.user.js" -ErrorAction SilentlyContinue).Count
    $devBackups = (Get-ChildItem "$projectRoot\backup\dev\*.user.js" -ErrorAction SilentlyContinue).Count
    
    Write-Host "📂 Backup Status:" -ForegroundColor Cyan
    Write-Host "  Core: $coreBackups backups" -ForegroundColor White
    Write-Host "  Dev: $devBackups backups" -ForegroundColor White
    
    Write-Host "🔄 File Naming: Dot notation standard active" -ForegroundColor Yellow
}

# Export functions
Export-ModuleMember -Function BACKUP_DEV, BACKUP_CORE, STATUS

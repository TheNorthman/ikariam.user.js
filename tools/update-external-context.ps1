# TNT Collection - External Context Auto-Update Script
# Purpose: Automatically update external-context.json with current date/time and system info
# Usage: Run via Windows Scheduled Task every hour

param(
    [string]$ProjectPath = "C:\Projects\Private\Ikariam\tnt.collection"
)

# Set working directory and file paths
$contextFile = Join-Path $ProjectPath "admin\external-context.json"
$backupDir = Join-Path $ProjectPath "backup"

# Collect current system context
$currentDate = Get-Date -Format "yyyy-MM-dd"
$currentTime = Get-Date -Format "HH:mm"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$dayOfWeek = Get-Date -Format "dddd"

# Check git status if available
$gitBranch = "unknown"
$lastCommit = "unknown"
$workingStatus = "unknown"

try {
    Push-Location $ProjectPath
    if (Test-Path ".git") {
        $gitBranch = (git branch --show-current 2>$null) -replace '\s+', ''
        $lastCommit = (git log -1 --format="%cd" --date=short 2>$null)
        $gitStatus = (git status --porcelain 2>$null)
        $workingStatus = if ($gitStatus) { "modified" } else { "clean" }
    }
} catch {
    # Git not available or error - use defaults
} finally {
    Pop-Location
}

# Check backup folder status
$lastBackupCore = "none-yet"
$lastBackupDev = "none-yet"

if (Test-Path (Join-Path $backupDir "core")) {
    $coreBackups = Get-ChildItem (Join-Path $backupDir "core") -Filter "*.user.js" | Sort-Object LastWriteTime -Descending
    if ($coreBackups.Count -gt 0) {
        $lastBackupCore = $coreBackups[0].LastWriteTime.ToString("yyyy-MM-dd HH:mm")
    }
}

if (Test-Path (Join-Path $backupDir "dev")) {
    $devBackups = Get-ChildItem (Join-Path $backupDir "dev") -Filter "*.user.js" | Sort-Object LastWriteTime -Descending
    if ($devBackups.Count -gt 0) {
        $lastBackupDev = $devBackups[0].LastWriteTime.ToString("yyyy-MM-dd HH:mm")
    }
}

# Build context object
$context = @{
    currentDate = $currentDate
    currentTime = $currentTime
    lastUpdate = $timestamp
    dayOfWeek = $dayOfWeek
    systemInfo = @{
        gitBranch = $gitBranch
        lastCommit = $lastCommit
        workingDirectory = $workingStatus
        scriptLocation = $MyInvocation.MyCommand.Path
    }
    projectContext = @{
        activePhase = "tooltip-development"
        lastBackupCore = $lastBackupCore
        lastBackupDev = $lastBackupDev
        projectPath = $ProjectPath
    }
    updateInfo = @{
        scriptVersion = "1.0.0"
        updateFrequency = "hourly"
        nextUpdate = (Get-Date).AddHours(1).ToString("yyyy-MM-dd HH:mm")
    }
} | ConvertTo-Json -Depth 4

# Ensure admin directory exists
$adminDir = Join-Path $ProjectPath "admin"
if (-not (Test-Path $adminDir)) {
    New-Item -ItemType Directory -Path $adminDir -Force | Out-Null
}

# Write context to file with error handling
try {
    $context | Out-File -FilePath $contextFile -Encoding UTF8 -Force
    Write-Host "✅ External context updated successfully: $contextFile"
    Write-Host "📅 Current date: $currentDate $currentTime ($dayOfWeek)"
    Write-Host "🔧 Git: $gitBranch ($workingStatus)"
    Write-Host "💾 Last backups: Core($lastBackupCore) Dev($lastBackupDev)"
} catch {
    Write-Error "❌ Failed to update external context: $_"
    exit 1
}

# Optional: Log update for debugging
$logFile = Join-Path $ProjectPath "tools\external-context.log"
try {
    "[$timestamp] Context updated successfully" | Out-File -FilePath $logFile -Append -Encoding UTF8
} catch {
    # Silently fail on logging error
}

exit 0

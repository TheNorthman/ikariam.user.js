# TNT Collection - Auto-Context Setup Script
# Purpose: Set up Windows Scheduled Task for automatic external context updates
# Usage: Run once as Administrator to create the scheduled task

param(
    [string]$ProjectPath = "C:\Projects\Private\Ikariam\tnt.collection",
    [string]$TaskName = "TNT-Collection-AutoContext",
    [int]$IntervalHours = 1
)

Write-Host "🔧 Setting up TNT Collection Auto-Context System..."

# Verify PowerShell execution policy
$executionPolicy = Get-ExecutionPolicy
if ($executionPolicy -eq "Restricted") {
    Write-Warning "⚠️  PowerShell execution policy is Restricted. You may need to run:"
    Write-Warning "   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser"
    Write-Host ""
}

# Verify project path exists
if (-not (Test-Path $ProjectPath)) {
    Write-Error "❌ Project path not found: $ProjectPath"
    Write-Host "Please update the ProjectPath parameter or ensure the project exists."
    exit 1
}

# Verify update script exists
$updateScript = Join-Path $ProjectPath "tools\update-external-context.ps1"
if (-not (Test-Path $updateScript)) {
    Write-Error "❌ Update script not found: $updateScript"
    Write-Host "Please ensure update-external-context.ps1 exists in the tools directory."
    exit 1
}

# Create scheduled task
try {
    # Define task action
    $action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File `"$updateScript`" -ProjectPath `"$ProjectPath`""
    
    # Define task trigger (every hour)
    $trigger = New-ScheduledTaskTrigger -Once -At (Get-Date) -RepetitionInterval (New-TimeSpan -Hours $IntervalHours)
    
    # Define task settings
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
    
    # Define task principal (run as current user)
    $principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive
    
    # Register the task
    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Description "Auto-update external context for TNT Collection development" -Force
    
    Write-Host "✅ Scheduled task created successfully: $TaskName"
    Write-Host "📅 Updates every $IntervalHours hour(s)"
    Write-Host "📍 Script location: $updateScript"
    
} catch {
    Write-Error "❌ Failed to create scheduled task: $_"
    exit 1
}

# Test the update script once
Write-Host ""
Write-Host "🧪 Testing update script..."
try {
    & $updateScript -ProjectPath $ProjectPath
    Write-Host "✅ Test update completed successfully"
} catch {
    Write-Warning "⚠️  Test update failed: $_"
    Write-Host "The scheduled task was created, but you may need to check the script manually."
}

# Verify external-context.json was created
$contextFile = Join-Path $ProjectPath "admin\external-context.json"
if (Test-Path $contextFile) {
    Write-Host "✅ External context file created: $contextFile"
    
    # Show context content
    try {
        $context = Get-Content $contextFile | ConvertFrom-Json
        Write-Host ""
        Write-Host "📋 Current context:"
        Write-Host "   Date: $($context.currentDate) $($context.currentTime) ($($context.dayOfWeek))"
        Write-Host "   Git: $($context.systemInfo.gitBranch) ($($context.systemInfo.workingDirectory))"
        Write-Host "   Phase: $($context.projectContext.activePhase)"
    } catch {
        Write-Warning "⚠️  Could not parse context file content"
    }
} else {
    Write-Warning "⚠️  External context file was not created: $contextFile"
}

Write-Host ""
Write-Host "🎯 Setup Complete! The auto-context system is now active."
Write-Host ""
Write-Host "📋 Next Steps:"
Write-Host "1. Verify the scheduled task runs: Get-ScheduledTask -TaskName '$TaskName'"
Write-Host "2. Check context updates: Get-Content '$contextFile'"
Write-Host "3. Use 'admin/external-context.json' in AI sessions for current date context"
Write-Host ""
Write-Host "🔧 Management Commands:"
Write-Host "   View task: Get-ScheduledTask -TaskName '$TaskName' | Format-List"
Write-Host "   Run now: Start-ScheduledTask -TaskName '$TaskName'"
Write-Host "   Remove: Unregister-ScheduledTask -TaskName '$TaskName' -Confirm:`$false"

exit 0

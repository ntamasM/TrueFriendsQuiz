# zip-game.ps1 — Build the game and package dist/ into a zip for AirConsole upload
$ErrorActionPreference = "Stop"

Write-Host "Building..."
npm run build

$packageJson = Get-Content (Join-Path $PSScriptRoot "..\package.json") | ConvertFrom-Json
$version = $packageJson.version

$outDir = (Resolve-Path (Join-Path $PSScriptRoot "..\dist")).Path
$zipPath = (Join-Path $PSScriptRoot "..\Releases\builds\True Friends Quiz Release v$version.zip")
$zipPath = [System.IO.Path]::GetFullPath($zipPath)

if (Test-Path $zipPath) { Remove-Item $zipPath }
if (!(Test-Path (Split-Path $zipPath))) { New-Item -ItemType Directory -Path (Split-Path $zipPath) | Out-Null }

# Use .NET ZipFile to ensure forward slashes in zip entries (Linux-compatible)
Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')

# Website-only files (the public How-to-Play / About site). AirConsole only
# loads screen.html + controller.html, so these are excluded from the game zip.
# (app.html and its dedicated app-*.js / app-*.css bundles.)
$excludePatterns = @(
    '^app\.html$',
    '^_assets/app-.*\.js$',
    '^_assets/app-.*\.css$'
)

$added = 0
Get-ChildItem -Path $outDir -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Substring($outDir.Length + 1).Replace('\', '/')

    $skip = $false
    foreach ($pattern in $excludePatterns) {
        if ($relativePath -match $pattern) { $skip = $true; break }
    }
    if ($skip) {
        Write-Host "  skip (website-only): $relativePath"
        return
    }

    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $relativePath) | Out-Null
    $added++
}

$zip.Dispose()

Write-Host "Packaged $added game files (website-only files excluded)."
Write-Host "Done! Upload $zipPath to AirConsole."

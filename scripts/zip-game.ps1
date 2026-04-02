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

Get-ChildItem -Path $outDir -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Substring($outDir.Length + 1).Replace('\', '/')
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $relativePath) | Out-Null
}

$zip.Dispose()

Write-Host "Done! Upload $zipPath to AirConsole."

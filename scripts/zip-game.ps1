# zip-game.ps1 — Build the game and package dist/ into a zip for AirConsole upload
$ErrorActionPreference = "Stop"

Write-Host "Building..."
npm run build

$outDir = Join-Path $PSScriptRoot "..\dist"
$zipPath = Join-Path $PSScriptRoot "..\Releases\game.zip"

if (Test-Path $zipPath) { Remove-Item $zipPath }
if (!(Test-Path (Split-Path $zipPath))) { New-Item -ItemType Directory -Path (Split-Path $zipPath) | Out-Null }

Write-Host "Zipping dist/ -> $zipPath"
Compress-Archive -Path "$outDir\*" -DestinationPath $zipPath -Force

Write-Host "Done! Upload $zipPath to AirConsole."

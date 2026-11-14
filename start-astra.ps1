$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$nodePath = (Get-Command node).Source
$npmCli = Join-Path (Split-Path $nodePath) 'node_modules/npm/bin/npm-cli.js'
if (-not (Test-Path -LiteralPath $npmCli)) { throw 'Install Node.js 22.12+ with npm first.' }
if (-not (Test-Path -LiteralPath 'node_modules')) { & $nodePath $npmCli ci; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE } }
& $nodePath $npmCli run dev

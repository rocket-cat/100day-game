$ErrorActionPreference = 'SilentlyContinue'

$root = Split-Path -Parent $PSScriptRoot
$runtime = Join-Path $root '.runtime'

foreach ($pidFile in @('static.pid', 'tunnel.pid')) {
  $path = Join-Path $runtime $pidFile
  if (!(Test-Path $path)) {
    continue
  }

  try {
    $procId = [int](Get-Content -Path $path -Raw)
    Stop-Process -Id $procId -Force
  } catch {
  }
}

Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
  Where-Object { $_.LocalPort -in 4173, 4174, 4175 } |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object {
    try {
      Stop-Process -Id $_ -Force
    } catch {
    }
  }

Write-Output 'Stopped local static server and public tunnel.'

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$runtime = Join-Path $root '.runtime'

if (!(Test-Path $runtime)) {
  New-Item -ItemType Directory -Path $runtime | Out-Null
}

function Stop-PortListeners {
  param(
    [int[]]$Ports
  )

  $connections = Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
    Where-Object { $_.LocalPort -in $Ports } |
    Select-Object -ExpandProperty OwningProcess -Unique

  foreach ($procId in $connections) {
    try {
      Stop-Process -Id $procId -Force -ErrorAction Stop
    } catch {
    }
  }
}

function Stop-RecordedProcess {
  param(
    [string]$PidFile
  )

  if (!(Test-Path $PidFile)) {
    return
  }

  try {
    $procId = [int](Get-Content -Path $PidFile -Raw)
    Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
  } catch {
  }
}

Stop-RecordedProcess (Join-Path $runtime 'static.pid')
Stop-RecordedProcess (Join-Path $runtime 'tunnel.pid')
Stop-PortListeners @(4173, 4174, 4175)
Start-Sleep -Seconds 2

$staticOut = Join-Path $runtime 'static.out.log'
$staticErr = Join-Path $runtime 'static.err.log'
$tunnelOut = Join-Path $runtime 'tunnel.out.log'
$tunnelErr = Join-Path $runtime 'tunnel.err.log'

foreach ($file in @($staticOut, $staticErr, $tunnelOut, $tunnelErr)) {
  if (Test-Path $file) {
    try {
      Remove-Item -LiteralPath $file -Force -ErrorAction Stop
    } catch {
      Start-Sleep -Milliseconds 800
      try {
        Remove-Item -LiteralPath $file -Force -ErrorAction Stop
      } catch {
        Set-Content -Path $file -Value ''
      }
    }
  }
}

Push-Location $root
try {
  npm run build | Out-Null

  $staticProc = Start-Process -FilePath 'npx.cmd' `
    -ArgumentList 'http-server', 'dist', '-a', '127.0.0.1', '-p', '4173', '-c-1' `
    -WorkingDirectory $root `
    -WindowStyle Hidden `
    -RedirectStandardOutput $staticOut `
    -RedirectStandardError $staticErr `
    -PassThru

  Set-Content -Path (Join-Path $runtime 'static.pid') -Value $staticProc.Id

  Start-Sleep -Seconds 4

  $tunnelProc = Start-Process -FilePath 'ssh.exe' `
    -ArgumentList '-o', 'StrictHostKeyChecking=no', '-o', 'ServerAliveInterval=60', '-R', '80:127.0.0.1:4173', 'nokey@localhost.run' `
    -WorkingDirectory $root `
    -WindowStyle Hidden `
    -RedirectStandardOutput $tunnelOut `
    -RedirectStandardError $tunnelErr `
    -PassThru

  Set-Content -Path (Join-Path $runtime 'tunnel.pid') -Value $tunnelProc.Id

  Start-Sleep -Seconds 8

  $raw = ''
  if (Test-Path $tunnelOut) {
    $raw += Get-Content -Path $tunnelOut -Raw
  }

  $url = [regex]::Match($raw, 'https://[a-z0-9.-]+').Value

  if (-not $url) {
    Write-Output 'Failed to parse public URL. Check web/.runtime/tunnel.out.log'
    exit 1
  }

  Write-Output "Public URL: $url"
  Write-Output 'Note: this is a temporary public share. Keep this machine and both background processes running.'
} finally {
  Pop-Location
}

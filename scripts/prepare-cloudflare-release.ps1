$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$releaseRoot = Join-Path $root '.release'
$target = Join-Path $releaseRoot 'cloudflare-pages'
$dist = Join-Path $root 'dist'

Push-Location $root
try {
  npm run build
  npm run validate:story

  if (Test-Path $target) {
    Remove-Item -LiteralPath $target -Recurse -Force
  }

  New-Item -ItemType Directory -Path $target -Force | Out-Null
  Copy-Item -Path (Join-Path $dist '*') -Destination $target -Recurse -Force

  Write-Output "Cloudflare Pages release prepared: $target"
  Write-Output 'Upload the contents of this folder with Cloudflare Pages Direct Upload.'
} finally {
  Pop-Location
}

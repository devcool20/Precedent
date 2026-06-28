<#
.SYNOPSIS
  Initializes a new repo-wiki-generator project for any GitHub repository.

.DESCRIPTION
  Sets up the output directories, copies templates, creates the repo config,
  and optionally fetches PR data from GitHub. After running this, you can
  open the project in OpenCode or Gemini CLI and run the orchestrator agent.

.PARAMETER Repo
  GitHub repository in "owner/repo" format (required).

.PARAMETER PrCount
  Number of merged PRs to fetch (default: 50).

.PARAMETER OutputDir
  Directory to create the wiki project in (default: ./wiki-output).

.PARAMETER FetchOnly
  Only fetch PR data without creating template structure.

.PARAMETER Token
  GitHub personal access token for higher API rate limits.

.EXAMPLE
  .\init-repo-wiki.ps1 -Repo "microsoft/vscode" -PrCount 100

.EXAMPLE
  .\init-repo-wiki.ps1 -Repo "user/my-repo" -Token "ghp_abc123"

.NOTES
  Requires: Node.js (for fetch script), PowerShell 5.1+
  Author: repo-wiki-generator
#>

param(
  [Parameter(Mandatory = $true, Position = 0)]
  [string]$Repo,

  [Parameter(Mandatory = $false)]
  [int]$PrCount = 50,

  [Parameter(Mandatory = $false)]
  [string]$OutputDir = "./wiki-output",

  [Parameter(Mandatory = $false)]
  [switch]$FetchOnly,

  [Parameter(Mandatory = $false)]
  [string]$Token = ""
)

$ErrorActionPreference = "Stop"

# --- Resolve paths ---
$ScriptRoot = Split-Path -Parent $PSCommandPath
$TemplateDir = Resolve-Path (Join-Path $ScriptRoot "..\templates")
$PromptDir = Resolve-Path (Join-Path $ScriptRoot "..\prompts")
$AgentDir = Resolve-Path (Join-Path $ScriptRoot "..\.opencode\agents")
$UserInputDir = Resolve-Path (Join-Path $ScriptRoot "..\user-input")

$OutputDir = Resolve-Path $OutputDir -ErrorAction SilentlyContinue
if (-not $OutputDir) {
  $OutputDir = Join-Path (Get-Location) "wiki-output"
}

Write-Host "=== repo-wiki-generator Init ===" -ForegroundColor Cyan
Write-Host "Repo:         $Repo"
Write-Host "PRs to fetch: $PrCount"
Write-Host "Output dir:   $OutputDir"

# --- 1. Create output structure ---
Write-Host "`n[1/5] Creating output directories..." -ForegroundColor Green
New-Item -ItemType Directory -Path "$OutputDir\input\raw-data" -Force | Out-Null
New-Item -ItemType Directory -Path "$OutputDir\input\pr-data" -Force | Out-Null
New-Item -ItemType Directory -Path "$OutputDir\output" -Force | Out-Null

# --- 2. Copy templates ---
if (-not $FetchOnly) {
  Write-Host "[2/5] Copying wiki templates..." -ForegroundColor Green
  if (Test-Path $TemplateDir) {
    Get-ChildItem -Path $TemplateDir -Filter "*.md" | ForEach-Object {
      Copy-Item $_.FullName -Destination "$OutputDir\templates\" -Force
    }
    Write-Host "  Templates copied to $OutputDir\templates\"
  } else {
    Write-Host "  WARNING: Template directory not found at $TemplateDir" -ForegroundColor Yellow
  }

  Write-Host "[3/5] Copying agent files..." -ForegroundColor Green
  if (Test-Path $AgentDir) {
    New-Item -ItemType Directory -Path "$OutputDir\.opencode\agents" -Force | Out-Null
    Get-ChildItem -Path $AgentDir -Filter "*.md" | ForEach-Object {
      Copy-Item $_.FullName -Destination "$OutputDir\.opencode\agents\" -Force
    }
    Write-Host "  Agent files copied to $OutputDir\.opencode\agents\"
  } else {
    Write-Host "  WARNING: Agent directory not found at $AgentDir" -ForegroundColor Yellow
  }
} else {
  Write-Host "[2/5][3/5] Skipped (--FetchOnly)" -ForegroundColor Yellow
}

# --- 4. Create repo config ---
Write-Host "[4/5] Creating repo configuration..." -ForegroundColor Green
$config = @{
  repo           = $Repo
  pr_count       = $PrCount
  include_issues = $false
  include_chat_logs = $true
  created_at     = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
  output_path    = "$OutputDir\output"
  project_name   = $Repo.Split('/')[1]
} | ConvertTo-Json -Depth 3

$configPath = "$OutputDir\input\repo-config.json"
Set-Content -Path $configPath -Value $config -Encoding UTF8
Write-Host "  Config written to $configPath"

# --- 5. Fetch PRs ---
Write-Host "[5/5] Fetching PR data from GitHub..." -ForegroundColor Green
$fetchScript = Join-Path $ScriptRoot "fetch-github-data.js"
if (Test-Path $fetchScript) {
  $tokenArgs = ""
  if ($Token) { $tokenArgs = "--token=$Token" }

  $env:OUTPUT_PATH = "$OutputDir\input\pr-data\fetched-prs.json"
  $fetchResult = & node "$fetchScript" $Repo $PrCount $tokenArgs 2>&1

  if ($LASTEXITCODE -eq 0) {
    Write-Host "  PR data fetched successfully!" -ForegroundColor Green
  } else {
    Write-Host "  WARNING: PR fetch encountered issues:" -ForegroundColor Yellow
    $fetchResult | ForEach-Object { Write-Host "    $_" -ForegroundColor Yellow }
  }
} else {
  Write-Host "  WARNING: Fetch script not found at $fetchScript" -ForegroundColor Yellow
}

# --- Summary ---
Write-Host "`n=== Setup Complete ===" -ForegroundColor Cyan
Write-Host "Project:     $Repo"
Write-Host "Output dir:  $(Resolve-Path $OutputDir)"
Write-Host ""

Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Add any chat logs or notes to: $OutputDir\input\raw-data\"
Write-Host "  2. Open the project in OpenCode or Gemini CLI"
Write-Host "  3. Run the orchestrator agent to generate wiki files"
Write-Host "  4. Generated files will appear in: $OutputDir\output\"
Write-Host ""
Write-Host "File structure:" -ForegroundColor DarkGray
Write-Host "  $OutputDir\"
Write-Host "  ├── input\"
Write-Host "  │   ├── repo-config.json       (configuration)"
Write-Host "  │   ├── pr-data\"
Write-Host "  │   │   └── fetched-prs.json    (GitHub PR data)"
Write-Host "  │   └── raw-data\               (drop chat logs here)"
Write-Host "  ├── output\                     (wiki files go here)"
Write-Host "  ├── templates\                  (wiki template copies)"
Write-Host "  └── .opencode\agents\           (agent definitions)"

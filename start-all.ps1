# Start both backend and frontend servers in parallel

Write-Host "Starting CS348 Project servers..." -ForegroundColor Green
Write-Host ""

# Get the project root directory
$projectRoot = (Get-Location).Path

# Start backend in a new PowerShell window
Write-Host "Starting Django backend..." -ForegroundColor Cyan
$backendScript = @"
cd "$projectRoot\backend"
if (-not (Test-Path "venv")) {
    python -m venv venv
}
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript

# Start frontend in a new PowerShell window
Write-Host "Starting React frontend..." -ForegroundColor Cyan
$frontendScript = @"
cd "$projectRoot\frontend"
npm install
npm run dev
"@
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript

Write-Host ""
Write-Host "Both servers are starting in new windows..." -ForegroundColor Yellow
Write-Host "Backend: http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green

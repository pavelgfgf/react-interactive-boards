@echo off
setlocal

set "ROOT=%~dp0"
set "PB_DIR=%ROOT%backend"
set "PB_EXE=%PB_DIR%\pocketbase.exe"

if not exist "%PB_EXE%" (
  echo PocketBase not found: "%PB_EXE%"
  pause
  exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo npm.cmd not found. Please install Node.js first.
  pause
  exit /b 1
)

start "PocketBase" cmd /k "cd /d ""%PB_DIR%"" && pocketbase.exe serve --http=127.0.0.1:8090"
start "Vite dev server" cmd /k "cd /d ""%ROOT%"" && npm.cmd run dev"

echo Local services are starting:
echo PocketBase: http://127.0.0.1:8090
echo Frontend: check the Vite window for the local URL.
echo.
pause

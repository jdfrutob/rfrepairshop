@echo off
REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Node.js is not installed. Please install Node.js from https://nodejs.org/
  pause
  exit /b
)

REM Install dependencies if needed
if not exist node_modules (
  echo Installing dependencies...
  npm install
)

REM Start the print server
echo Starting the print server...
start "" node print-server.js

echo Print server started! You can now use the web app.
pause 
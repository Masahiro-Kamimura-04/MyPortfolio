@echo off
setlocal
cd /d "%~dp0student-portfolio"
call npm run preview:html
if errorlevel 1 (
  echo Preview build failed. See the error above.
  pause
  exit /b 1
)
start "" "%~dp0previews\index.html"

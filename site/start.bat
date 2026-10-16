@echo off
title System Design Atlas
cd /d "%~dp0"
echo.
echo  System Design Atlas is starting...
echo  Open http://localhost:8080 if your browser does not open automatically.
echo  Keep this window open while studying. Press Ctrl+C to stop.
echo.
start "" "http://localhost:8080"
where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server 8080
) else (
  python -m http.server 8080
)

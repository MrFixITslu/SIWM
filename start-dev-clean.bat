@echo off
echo Cleaning up any existing processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Starting development servers...
echo.
echo Frontend will be available at: http://localhost:5176/
echo Backend will be available at: http://localhost:3000/
echo Network access: http://192.168.100.9:5176/
echo.

npm run dev

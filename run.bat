@echo off
echo Starting Veridex...
echo.

echo [1/2] Starting backend server...
cd server
start "Veridex Server" cmd /k "npm run dev"
cd ..

echo [2/2] Starting frontend development server...
timeout /t 3 /nobreak >nul
start "Veridex Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo - Frontend: http://localhost:3000
echo - Backend: http://localhost:8080
echo.
echo Press any key to open the application in your browser...
pause >nul
start http://localhost:3000

echo.
echo Application is running. Close this window to stop the servers.

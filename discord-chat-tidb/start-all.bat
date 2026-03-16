@echo off
chcp 65001 >nul
echo ========================================
echo  🚀 Discord Chat - TiDB Cloud
echo ========================================
echo.
echo Este script inicia todos los servidores:
echo - WebSocket Server (puerto 3002)
echo - Backend API (puerto 3001)
echo - Frontend (puerto 5173)
echo.
echo Presiona cualquier tecla para iniciar...
pause >nul
cls

echo Iniciando servidores...
echo.

:: Crear ventanas separadas para cada servidor
start "WebSocket Server" cmd /k "cd backend && echo Iniciando WebSocket Server... && node socket/server.js"
timeout /t 2 >nul

start "Backend API" cmd /k "cd backend && echo Iniciando Backend API... && npm run dev"
timeout /t 2 >nul

start "Frontend" cmd /k "cd frontend && echo Iniciando Frontend... && npm run dev"

cls
echo ========================================
echo  ✅ Servidores iniciados!
echo ========================================
echo.
echo 📡 WebSocket Server: http://localhost:3002
echo 🔧 Backend API:      http://localhost:3001
echo 🎨 Frontend:         http://localhost:5173
echo.
echo Presiona cualquier tecla para cerrar todas las ventanas...
pause >nul

:: Cerrar todas las ventanas de Node
taskkill /F /IM node.exe 2>nul
taskkill /F /FI "WINDOWTITLE eq WebSocket Server*"
taskkill /F /FI "WINDOWTITLE eq Backend API*"
taskkill /F /FI "WINDOWTITLE eq Frontend*"

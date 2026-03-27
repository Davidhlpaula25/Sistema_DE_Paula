@echo off
echo ========================================
echo Sistema Paula Bebidas
echo Iniciando Backend e Frontend...
echo ========================================
echo.

REM Iniciar backend em uma nova janela
start "Paula Bebidas - Backend" cmd /k "cd backend && npm start"

REM Aguardar 3 segundos para o backend iniciar
timeout /t 3 /nobreak >nul

REM Iniciar frontend em uma nova janela
start "Paula Bebidas - Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Servicos iniciados!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Feche este terminal para parar os servicos
echo.
pause

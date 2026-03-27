@echo off
echo ========================================
echo Sistema Paula Bebidas - Setup Inicial
echo ========================================
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js instalado
echo.

REM Verificar se PostgreSQL está instalado
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] PostgreSQL nao encontrado no PATH
    echo Certifique-se de que o PostgreSQL esta instalado
    echo.
) else (
    echo [OK] PostgreSQL instalado
    echo.
)

REM Criar arquivo .env se não existir
if not exist "backend\.env" (
    echo Criando arquivo backend\.env...
    copy "backend\.env.example" "backend\.env"
    echo.
    echo [IMPORTANTE] Configure o arquivo backend\.env com suas credenciais!
    echo.
    pause
)

REM Instalar dependências do backend
echo ========================================
echo Instalando dependencias do BACKEND...
echo ========================================
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias do backend
    pause
    exit /b 1
)
echo.
echo [OK] Dependencias do backend instaladas
echo.

REM Voltar para raiz
cd ..

REM Instalar dependências do frontend
echo ========================================
echo Instalando dependencias do FRONTEND...
echo ========================================
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias do frontend
    pause
    exit /b 1
)
echo.
echo [OK] Dependencias do frontend instaladas
echo.

REM Voltar para raiz
cd ..

echo ========================================
echo Setup concluido com sucesso!
echo ========================================
echo.
echo PROXIMOS PASSOS:
echo.
echo 1. Configure o arquivo backend\.env com suas credenciais PostgreSQL
echo 2. Crie o banco de dados: CREATE DATABASE paula_bebidas;
echo 3. Execute as migracoes: cd backend e npm run migrate
echo 4. Inicie o backend: cd backend e npm start
echo 5. Em outro terminal, inicie o frontend: cd frontend e npm start
echo.
echo Consulte INSTALACAO.md para mais detalhes
echo.
pause

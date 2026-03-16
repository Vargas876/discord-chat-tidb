# Script para iniciar el proyecto en local (Windows PowerShell)
# Este script instala dependencias, configura la BD e inicia los servidores

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Discord Chat - Modo Local" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en la carpeta correcta
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "Error: Ejecuta este script desde la carpeta discord-chat-tidb" -ForegroundColor Red
    exit 1
}

# ============================================
# CONFIGURAR VARIABLES DE ENTORNO
# ============================================
Write-Host "[0/5] Configurando variables de entorno..." -ForegroundColor Yellow
$env:TIDB_DATABASE_URL = "mysql://2LdZoyWhLHQtZn9.root:xyEkAnrwVNNZ1QFI@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict"
$env:WS_PORT = "3002"
$env:PORT = "3001"
$env:NODE_ENV = "development"
Write-Host "   DATABASE_URL configurada (TIDB_DATABASE_URL)" -ForegroundColor Green

# ============================================
# PASO 1: Instalar dependencias del Backend
# ============================================
Write-Host "[1/5] Instalando dependencias del Backend..." -ForegroundColor Yellow
Set-Location backend

if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error instalando dependencias del backend" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   node_modules ya existe, omitiendo..." -ForegroundColor Green
}

# ============================================
# PASO 2: Configurar Prisma
# ============================================
Write-Host "[2/5] Configurando Prisma ORM..." -ForegroundColor Yellow

# Generar cliente Prisma
Write-Host "   Generando cliente Prisma..."
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error generando cliente Prisma" -ForegroundColor Red
    exit 1
}

# Crear tablas en TiDB (si no existen)
Write-Host "   Sincronizando esquema con TiDB Cloud..."
npx prisma db push --accept-data-loss
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error sincronizando con TiDB" -ForegroundColor Red
    Write-Host "   Verifica que tu IP esta permitida en TiDB Cloud" -ForegroundColor Yellow
    exit 1
}

# Cargar datos de prueba
Write-Host "   Cargando datos de prueba..."
node prisma/seed.js
if ($LASTEXITCODE -ne 0) {
    Write-Host "Advertencia: Error cargando datos de prueba (puede que ya existan)" -ForegroundColor Yellow
}

Set-Location ..

# ============================================
# PASO 3: Instalar dependencias del Frontend
# ============================================
Write-Host "[3/5] Instalando dependencias del Frontend..." -ForegroundColor Yellow
Set-Location frontend

if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error instalando dependencias del frontend" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   node_modules ya existe, omitiendo..." -ForegroundColor Green
}

Set-Location ..

# ============================================
# PASO 4: Iniciar servidores
# ============================================
Write-Host "[4/5] Iniciando servidores..." -ForegroundColor Yellow
Write-Host ""

# Crear ventanas separadas para cada servidor
Write-Host "   Abriendo WebSocket Server (puerto 3002)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; `$env:TIDB_DATABASE_URL='mysql://2LdZoyWhLHQtZn9.root:xyEkAnrwVNNZ1QFI@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict'; `$env:WS_PORT='3002'; `$env:PORT='3001'; Write-Host 'WebSocket Server - Puerto 3002' -ForegroundColor Green; node socket/server.js"

Start-Sleep -Seconds 2

Write-Host "   Abriendo Backend API (puerto 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; `$env:TIDB_DATABASE_URL='mysql://2LdZoyWhLHQtZn9.root:xyEkAnrwVNNZ1QFI@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict'; `$env:PORT='3001'; Write-Host 'Backend API - Puerto 3001' -ForegroundColor Blue; npm run dev"

Start-Sleep -Seconds 2

Write-Host "   Abriendo Frontend (puerto 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host 'Frontend - Puerto 5173' -ForegroundColor Magenta; npm run dev"

# ============================================
# PASO 5: Abrir navegador
# ============================================
Write-Host ""
Write-Host "[5/5] Abriendo navegador..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Todo listo!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "WebSocket Server: http://localhost:3002"
Write-Host "Backend API:      http://localhost:3001"
Write-Host "Frontend:         http://localhost:5173"
Write-Host ""
Write-Host "Para verificar que funciona:" -ForegroundColor Yellow
Write-Host "   1. Abre http://localhost:5173 en Chrome"
Write-Host "   2. Abre http://localhost:5173 en Edge (ventana incognito)"
Write-Host "   3. Selecciona diferentes usuarios en cada navegador"
Write-Host "   4. Envia mensajes y verifica que aparecen en tiempo real"
Write-Host ""
Write-Host "Para detener todos los servidores, cierra las ventanas de PowerShell" -ForegroundColor Yellow
Write-Host ""

Read-Host "Presiona ENTER para salir"

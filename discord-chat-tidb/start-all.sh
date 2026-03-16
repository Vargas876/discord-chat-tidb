#!/bin/bash

echo "========================================"
echo "  🚀 Discord Chat - TiDB Cloud"
echo "========================================"
echo ""
echo "Este script inicia todos los servidores:"
echo "- WebSocket Server (puerto 3002)"
echo "- Backend API (puerto 3001)"
echo "- Frontend (puerto 5173)"
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    echo "🛑 Deteniendo servidores..."
    kill $WS_PID $API_PID $FE_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Iniciar WebSocket Server
echo -e "${BLUE}Iniciando WebSocket Server...${NC}"
cd backend
node socket/server.js &
WS_PID=$!
cd ..
sleep 2

# Iniciar Backend API
echo -e "${BLUE}Iniciando Backend API...${NC}"
cd backend
npm run dev &
API_PID=$!
cd ..
sleep 2

# Iniciar Frontend
echo -e "${BLUE}Iniciando Frontend...${NC}"
cd frontend
npm run dev &
FE_PID=$!
cd ..

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✅ Servidores iniciados!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📡 WebSocket Server: http://localhost:3002"
echo "🔧 Backend API:      http://localhost:3001"
echo "🎨 Frontend:         http://localhost:5173"
echo ""
echo "Presiona Ctrl+C para detener todos los servidores"
echo ""

# Esperar
wait

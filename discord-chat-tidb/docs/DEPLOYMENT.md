# 🚀 Guía de Despliegue a Producción

Esta guía explica cómo desplegar el chat en plataformas gratuitas.

---

## 📋 Opciones de Despliegue

| Plataforma | Frontend | Backend | WebSocket | Dificultad | Costo |
|------------|----------|---------|-----------|------------|-------|
| **Render** | ✅ | ✅ | ✅ | Fácil | Gratis |
| **Railway** | ✅ | ✅ | ✅ | Fácil | Gratis (créditos) |
| **Vercel + Render** | ✅ (Vercel) | ✅ (Render) | ✅ (Render) | Media | Gratis |
| **Fly.io** | ✅ | ✅ | ✅ | Media | Gratis (créditos) |

> ⚠️ **Nota**: Vercel y Netlify NO soportan WebSockets en serverless. Debes usar Render, Railway o Fly.io para el backend.

---

## 🎯 Opción 1: Todo en Render (Recomendada)

Render permite desplegar frontend estático y backend Node.js en el mismo lugar.

### Paso 1: Preparar el Proyecto

Crear archivo `render.yaml` en la raíz:

```yaml
# Render Blueprint
services:
  # Backend + WebSocket Server
  - type: web
    name: discord-chat-api
    runtime: node
    buildCommand: |
      cd backend
      npm install
      npx prisma generate
    startCommand: |
      cd backend
      # Iniciar WebSocket y API juntos
      node socket/server.js &
      npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false  # La configurarás en el dashboard
      - key: PORT
        value: 10000
      - key: WS_PORT
        value: 10000
    healthCheckPath: /api/users

  # Frontend (Static Site)
  - type: static
    name: discord-chat-frontend
    runtime: static
    buildCommand: |
      cd frontend
      npm install
      npm run build
    publishDir: frontend/dist
    envVars:
      - key: VITE_API_URL
        value: https://discord-chat-api.onrender.com
      - key: VITE_WS_URL
        value: https://discord-chat-api.onrender.com
```

### Paso 2: Subir a GitHub

```bash
# Inicializar git
git init
git add .
git commit -m "Initial commit"

# Crear repo en GitHub y subir
git remote add origin https://github.com/tu-usuario/discord-chat-tidb.git
git push -u origin main
```

### Paso 3: Desplegar en Render

1. Ve a [https://render.com](https://render.com)
2. Click "New" → "Blueprint"
3. Conecta tu repo de GitHub
4. Render detectará el `render.yaml` automáticamente
5. Configura la variable `DATABASE_URL` con tus credenciales de TiDB
6. Click "Apply"

Espera ~5 minutos a que se despliegue.

### Paso 4: Verificar Despliegue

- **API**: https://discord-chat-api.onrender.com/api/users
- **Frontend**: https://discord-chat-frontend.onrender.com

---

## 🎯 Opción 2: Vercel (Frontend) + Render (Backend)

### Parte A: Backend en Render

1. En Render, crea un **New Web Service**
2. Conecta tu repo de GitHub
3. Configura:
   - **Name**: `discord-chat-api`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `node socket/server.js`
4. Variables de entorno:
   ```
   DATABASE_URL=mysql://usuario:password@gateway...tidbcloud.com:4000/test?sslaccept=strict
   NODE_ENV=production
   PORT=10000
   WS_PORT=10000
   ```
5. Click "Create Web Service"

### Parte B: Frontend en Vercel

1. Ve a [https://vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Importa tu repo de GitHub
4. Configura:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Variables de entorno:
   ```
   VITE_API_URL=https://discord-chat-api.onrender.com
   VITE_WS_URL=wss://discord-chat-api.onrender.com
   ```
6. Click "Deploy"

---

## 🎯 Opción 3: Railway

Railway ofrece $5 de créditos mensuales gratuitos.

### Paso 1: Subir a GitHub

Igual que en Opción 1.

### Paso 2: Desplegar en Railway

1. Ve a [https://railway.app](https://railway.app)
2. Click "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Selecciona tu repo
5. Railway detectará automáticamente los servicios
6. Configura variables de entorno:
   - Ve a cada servicio → Variables
   - Añade `DATABASE_URL`
7. Genera dominios para cada servicio
8. Actualiza URLs en variables

---

## ⚙️ Configuración Post-Deploy

### 1. Actualizar CORS

En `backend/next.config.js`, actualiza el origen permitido:

```javascript
// Para Render (todo en uno)
headers: [
  {
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: 'https://discord-chat-frontend.onrender.com' },
    ],
  },
]
```

### 2. WebSocket en Producción

Para WebSockets en HTTPS, usar `wss://`:

```javascript
// frontend/src/services/socket.js
const WS_URL = process.env.NODE_ENV === 'production' 
  ? 'wss://discord-chat-api.onrender.com'  // wss para HTTPS
  : 'http://localhost:3002';                // ws para HTTP local
```

### 3. Health Check

Añade un endpoint de health check en `backend/api/health/route.js`:

```javascript
import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
  try {
    // Verificar conexión a BD
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 500 }
    );
  }
}
```

---

## 🔧 Solución de Problemas

### Error: "WebSocket connection failed"

**Causa**: Vercel/Netlify no soportan WebSockets nativamente.

**Solución**: Usar Render o Railway para el backend.

### Error: "CORS policy"

**Solución**: Actualizar `next.config.js` con el dominio exacto del frontend.

### Error: "Cannot connect to database"

**Verificar**:
1. `DATABASE_URL` está configurada en el dashboard
2. La IP del servidor está en la lista blanca de TiDB Cloud
3. La URL incluye `?sslaccept=strict`

### WebSocket no funciona en HTTPS

**Solución**: Usar `wss://` en lugar de `ws://` en producción.

---

## 💰 Límites Gratuitos

| Plataforma | Límites |
|------------|---------|
| **Render** | 750 horas/mes, se apaga tras 15 min de inactividad |
| **Railway** | $5 créditos/mes (~500 horas) |
| **Vercel** | 100GB bandwidth, 6000 min build/mes |
| **TiDB Cloud** | 5GB storage, 50M request units/mes (Serverless) |

---

## 🎉 Checklist de Despliegue

- [ ] Subir código a GitHub
- [ ] Configurar `DATABASE_URL` en plataforma
- [ ] Actualizar URLs de CORS
- [ ] Verificar WebSocket usa `wss://`
- [ ] Probar endpoint `/api/health`
- [ ] Verificar chat en tiempo real funciona
- [ ] Compartir URL al profesor

---

**¿Problemas con el despliegue?** Revisa los logs en el dashboard de la plataforma elegida.

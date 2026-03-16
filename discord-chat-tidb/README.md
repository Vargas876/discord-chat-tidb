# 💬 Discord Chat con TiDB Cloud

Aplicación de chat estilo Discord construida con React, Next.js, TiDB Cloud y WebSockets.

![Hero](./docs/images/discord_ui.png)

![Stack](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Stack](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![Stack](https://img.shields.io/badge/TiDB-00A3E0?logo=mysql&logoColor=white)
![Stack](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Stack](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![Stack](https://img.shields.io/badge/Socket.io-010101?logo=socket.io&logoColor=white)

## 📋 Características

- ✅ **Chat en tiempo real** con WebSockets
- ✅ **Diseño estilo Discord** con modo oscuro
- ✅ **Base de datos TiDB Cloud** con Prisma ORM
- ✅ **Múltiples canales/conversaciones**
- ✅ **Cambio de usuario** para simular diferentes personas
- ✅ **Datos mock automáticos** al iniciar
- ✅ **Scroll automático** en nuevos mensajes
- ✅ **Indicadores de escritura**

---

## 🚀 Ejecutar en Local (Windows)

### ⚡ Rápido (3 comandos)

```powershell
# 1. Ir a la carpeta
cd discord-chat-tidb

# 2. Permitir scripts (solo necesario una vez en Windows)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

# 3. Ejecutar
.\start-local.ps1
```

> 💡 **¿No usas PowerShell?** No hay problema. El proyecto usa PowerShell para automatizar la apertura de ventanas, pero puedes ejecutar los servidores manualmente en cualquier terminal (`cmd`, Git Bash, etc.) siguiendo la [Guía Detallada](./docs/EJECUCION_LOCAL.md).

El script abrirá automáticamente el navegador en http://localhost:5173

### 📖 Detallado

Ver guía completa paso a paso: [`docs/EJECUCION_LOCAL.md`](./docs/EJECUCION_LOCAL.md)

Incluye:

- Instalación manual paso a paso
- Solución de todos los problemas comunes
- Verificación de que todo funciona
- Troubleshooting completo

---

## 🎮 Cómo usar la app

1. **Abre dos navegadores** (Chrome y Edge, o normal + incógnito) en http://localhost:5173
2. **Selecciona usuarios diferentes** en cada uno (dropdown arriba en la sidebar)
3. **Envía mensajes** y verás que aparecen en tiempo real en ambos
4. **Crea nuevos canales** con el botón + en "Canales de texto"

---

## 🗄️ Configuración de Base de Datos

El archivo `backend/.env` ya está configurado con credenciales de TiDB Cloud.

**Para cambiar credenciales**, edita ese archivo:

```env
TIDB_DATABASE_URL="mysql://usuario:password@host:4000/database?sslaccept=strict"
```

> ⚠️ **Nota Importante**: Usamos `TIDB_DATABASE_URL` en lugar de `DATABASE_URL` para evitar conflictos con variables reservadas del sistema Windows que podrían causar errores de acceso denegado.

---

## 📁 Estructura del Proyecto

```
discord-chat-tidb/
├── backend/              # Next.js + API Routes + WebSocket
│   ├── api/             # API REST (users, conversations, messages)
│   ├── socket/          # Servidor WebSocket (tiempo real)
│   └── .env             # Credenciales TiDB
├── frontend/            # React + Vite + Tailwind
│   └── src/
│       ├── components/  # UI del chat (Sidebar, ChatWindow, etc.)
│       ├── services/    # API + WebSocket clients
│       └── context/     # Estado global
├── prisma/
│   ├── schema.prisma    # Modelos de datos (3 tablas)
│   └── seed.js          # Datos de prueba
├── docs/                # 📚 Documentación
│   ├── images/          # Capturas de pantalla
│   ├── GUIA_PRACTICA.md     # ⬅️ GUÍA PASO A PASO (Estilo Neon)
│   ├── EJECUCION_LOCAL.md   # Guía de ejecución local
│   ├── TIDB_TUTORIAL.md     # Tutorial completo TiDB
│   ├── ACCESO_PROFESOR.md   # Guía para Fredy
│   └── DEPLOYMENT.md        # Guía de despliegue
└── README.md            # Este archivo
```

---

## 🔗 URLs en Local

| Servicio    | URL                       | Descripción         |
| ----------- | ------------------------- | -------------------- |
| Frontend    | http://localhost:5173     | Interfaz del chat    |
| Backend API | http://localhost:3001/api | REST API             |
| WebSocket   | ws://localhost:3002       | Servidor tiempo real |

---

## 📚 Documentación

| Archivo                                                     | Contenido                                    |
| ----------------------------------------------------------- | -------------------------------------------- |
| [**`docs/GUIA_PRACTICA.md`**](./docs/GUIA_PRACTICA.md) | **Guía paso a paso (Estilo docente)** |
| [`docs/EJECUCION_LOCAL.md`](./docs/EJECUCION_LOCAL.md)       | **Cómo ejecutar en tu computadora**   |
| [`docs/TIDB_TUTORIAL.md`](./docs/TIDB_TUTORIAL.md)           | Tutorial completo de TiDB Cloud              |
| [`docs/ACCESO_PROFESOR.md`](./docs/ACCESO_PROFESOR.md)       | Guía de acceso para Fredy Alarcon           |
| [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)                 | Cómo desplegar a producción                |

---

## 🐛 Solución Rápida de Problemas

### Error: "Ejecución de scripts está deshabilitada"

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```

### Error: "Cannot connect to database"

Tu IP no está permitida en TiDB Cloud:

1. Ve a https://tidbcloud.com → Tu cluster → Settings → Networking
2. Click "+ Add Current IP"

![Configuración IP](./docs/images/tidb-networking.png)

### Más problemas

Ver [`docs/EJECUCION_LOCAL.md`](./docs/EJECUCION_LOCAL.md) sección "Solución de Problemas"

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 18, Vite, TailwindCSS, Socket.io-client
- **Backend**: Next.js 14, Node.js, Socket.io
- **Base de datos**: TiDB Cloud (MySQL distribuido)
- **ORM**: Prisma
- **Tiempo real**: WebSockets (Socket.io)

---

## 🚀 Desplegar a Producción

Ver: [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)

Opciones gratuitas:

- **Render** (Recomendado) - Todo en uno
- **Vercel + Render** - Frontend + Backend separados

---

## 👨‍🏫 Acceso para el Profesor (Fredy)

Ver: [`docs/ACCESO_PROFESOR.md`](./docs/ACCESO_PROFESOR.md)

Datos de conexión:

```
Host:     gateway01.us-east-1.prod.aws.tidbcloud.com
Port:     4000
User:     2LdZoyWhLHQtZn9.root
Password: xyEkAnrwVNNZ1QFI
Database: test
```

> 💡 **Nota**: El prefijo del usuario es `2LdZoyWhLHQtZn9` (con **t**), no confundir con otros clusters.

---

**¡Listo para probar!** 🚀

Ejecuta: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force; .\start-local.ps1`

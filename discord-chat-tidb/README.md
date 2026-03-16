# 💬 Discord Chat con TiDB Cloud

Aplicación de chat estilo Discord construida con React, Next.js, TiDB Cloud y WebSockets.

![Hero](./docs/images/discord_ui.png)

![Stack](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Stack](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![Stack](https://img.shields.io/badge/TiDB-00A3E0?logo=mysql&logoColor=white)
![Stack](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Stack](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![Stack](https://img.shields.io/badge/Socket.io-010101?logo=socket.io&logoColor=white)

---

## 🌐 Demo en Vivo
La aplicación ya está desplegada y lista para usar:
- **Frontend**: [https://discord-chat-frontend.vercel.app/](https://discord-chat-frontend.vercel.app/)
- **Backend API**: [https://discord-chat-tidb-backend.vercel.app/api](https://discord-chat-tidb-backend.vercel.app/api)
- **WebSocket Server**: `https://discord-chat-ws.onrender.com`

---

## 📋 Características

- ✅ **Chat en tiempo real** con WebSockets (Socket.io)
- ✅ **Diseño estilo Discord** con modo oscuro y Tailwind CSS
- ✅ **Base de datos TiDB Cloud** (MySQL distribuido)
- ✅ **Persistencia completa** con Prisma ORM
- ✅ **Múltiples canales** y cambio de usuario dinámico
- ✅ **Despliegue multi-plataforma** (Vercel + Render)

---

## 🚀 Ejecutar en Local (Windows)

Si prefieres probarlo en tu máquina:

```powershell
# 1. Clonar e ir a la carpeta
cd discord-chat-tidb

# 2. Permitir scripts (solo Windows)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

# 3. Ejecutar script de inicio automático
.\start-local.ps1
```

> 💡 El script abrirá automáticamente 3 terminales y el navegador en http://localhost:5173

---

## 📚 Documentación Principal

Para la revisión del proyecto, se han preparado los siguientes documentos:

| Archivo | Contenido |
| :--- | :--- |
| [**`docs/GUIA_PRACTICA.md`**](./docs/GUIA_PRACTICA.md) | **Guía paso a paso (Arquitectura y Desarrollo)** |
| [`docs/EJECUCION_LOCAL.md`](./docs/EJECUCION_LOCAL.md) | **Instalación detallada y troubleshooting** |
| [`docs/ACCESO_PROFESOR.md`](./docs/ACCESO_PROFESOR.md) | **Datos de conexión y acceso para el docente** |

---

## 📁 Estructura del Proyecto

```
discord-chat-tidb/
├── backend/              # Next.js API Routes + WebSocket Server
├── frontend/            # React + Vite + Tailwind CSS
├── prisma/              # Schema de base de datos y Seeds
├── docs/                # Documentación y capturas
└── start-local.ps1      # Script de automatización (Windows)
```

---

## 👨‍🏫 Revisión para el Profesor
Los datos de conexión a la base de datos TiDB Cloud están configurados en el proyecto, pero puedes encontrar las credenciales directas y cómo conectarte externamente en [`docs/ACCESO_PROFESOR.md`](./docs/ACCESO_PROFESOR.md).

---
**Desarrollado para la Actividad Electiva - 2026**

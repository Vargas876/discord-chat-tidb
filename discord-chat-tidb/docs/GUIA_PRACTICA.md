# Discord Chat con TiDB Cloud

Aplicación de chat estilo Discord construida con React, Next.js, TiDB Cloud y WebSockets.

![Hero](./docs/images/discord_ui.png)

![Stack](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Stack](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![Stack](https://img.shields.io/badge/TiDB-00A3E0?logo=mysql&logoColor=white)
![Stack](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![Stack](https://img.shields.io/badge/Tailwind-06B6D4?logo=tailwindcss&logoColor=white)
![Stack](https://img.shields.io/badge/Socket.io-010101?logo=socket.io&logoColor=white)



# Integrantes

Julian Velandia

Juan Vargas

Camilo Niño

---

## 🌐 Demo en Vivo

La aplicación ya está desplegada y lista para usar:

- **Frontend**: [https://discord-chat-frontend.vercel.app/](https://discord-chat-frontend.vercel.app/)
- **Backend API**: [https://discord-chat-tidb-backend.vercel.app/api](https://discord-chat-tidb-backend.vercel.app/api)
- **WebSocket Server**: `https://discord-chat-ws.onrender.com`
- **Link del repositorio:** https://github.com/Vargas876/discord-chat-tidb.git

---

## 📋 Características

- ✅ **Chat en tiempo real** con WebSockets (Socket.io)
- ✅ **Diseño estilo Discord** con modo oscuro y Tailwind CSS
- ✅ **Base de datos TiDB Cloud** (MySQL distribuido)
- ✅ **Persistencia completa** con Prisma ORM
- ✅ **Múltiples canales** y cambio de usuario dinámico
- ✅ **Despliegue multi-plataforma** (Vercel + Render)

## 1. Introducción

En esta práctica, exploraremos la construcción de una aplicación de chat de alto rendimiento inspirada en Discord. Utilizaremos **TiDB Cloud** como nuestra base de datos distribuida, **Next.js** para nuestra API, y **WebSockets (Socket.io)** para la comunicación bidireccional en tiempo real.

![1773703128996](image/GUIA_PRACTICA/1773703128996.png)

## 2. Arquitectura del Sistema

La aplicación se divide en tres componentes principales que trabajan en armonía:

1. **Frontend (React + Vite)**: Una interfaz moderna y reactiva.
2. **Backend (Next.js App Router)**: Maneja la lógica de negocio y persistencia de datos.
3. **Servidor WebSocket (Node.js)**: Gestiona el túnel de comunicación en tiempo real.
4. **TiDB Cloud**: Base de datos SQL distribuida con escalabilidad horizontal.

## 3. Configuración de la Base de Datos (TiDB Cloud)

### 3.1. Paso 1 - Crear cuenta y Cluster

Primero, regístrate en [TiDB Cloud](https://tidbcloud.com/). Crea un cluster gratuito de tipo **Serverless**.

![1773706301668](image/GUIA_PRACTICA/1773706301668.png)

### 3.2. Paso 2 - Configurar Networking

Para que tu aplicación local pueda conectarse, debes añadir tu dirección IP a la lista de permitidos (Allowlist) en la pestaña **Networking**.

### 3.3. Paso 3 - Obtener String de Conexión

Copia la URL de conexión. Asegúrate de seleccionar el driver de **Prisma/Node.js**. El formato será similar a:
`mysql://user.root:password@gatewayXX.tidbcloud.com:4000/test?sslaccept=strict`

### 3.4. Paso 4 - Creación de Tablas (SQL)

Aunque utilizamos Prisma para sincronizar los datos automáticamente, es vital entender cómo se estructuran las tablas físicamente. Puedes ejecutar este script SQL directamente en el **SQL Editor** de tu consola de TiDB Cloud:

```sql
-- Tabla de Usuarios
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Canales/Conversaciones
CREATE TABLE conversations (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Mensajes
CREATE TABLE messages (
  id VARCHAR(36) PRIMARY KEY,
  conversation_id VARCHAR(36) NOT NULL,
  sender_id VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX (created_at)
);
```

## 4. Configuración del Proyecto

### 4.1. Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/` con las siguientes credenciales:

```env
TIDB_DATABASE_URL="tu_url_de_conexion_aqui"
DATABASE_URL="tu_url_de_conexion_aqui"
WS_PORT=3002
PORT=3001
NODE_ENV=development
```

### 4.2. Inicialización de Prisma

Prisma es nuestro ORM (Object-Relational Mapper). Define el esquema en `prisma/schema.prisma` y sincronízalo:

```bash
# Sincronizar esquema con TiDB automáticamente
npx prisma db push
```

## 5. Implementación del Chat en Tiempo Real

### 5.1. Lógica del Servidor (WebSocket)

El servidor de Socket.io escucha eventos como `send-message` y retransmite el mensaje a todos los miembros de la conversación:

```javascript
socket.on('send-message', async (data) => {
  const { content, conversation_id, sender_id } = data;
  const message = await prisma.message.create({
    data: { content, conversation_id, sender_id }
  });
  
  // Retransmitir a la sala específica
  io.to(conversation_id).emit('new-message', message);
});
```

### 5.2. Lógica del Cliente (React)

El cliente se conecta al servidor y escucha el evento `new-message` para actualizar la interfaz al instante:

```javascript
useEffect(() => {
  const handleNewMessage = (msg) => {
    setMessages(prev => [...prev, msg]);
  };

  socket.on('new-message', handleNewMessage);
  return () => socket.off('new-message', handleNewMessage);
}, []);
```

## 6. Ejecución del Proyecto

Para facilitar el despliegue local en Windows, hemos creado un script de PowerShell que automatiza todo:

1. Abre PowerShell como administrador.
2. Ejecuta el script:
   ```powershell
   .\start-local.ps1
   ```
3. El script abrirá tres ventanas: Backend, Frontend y WebSocket Server.

![Ejecución Exitosa](images/tidb-dashboard.png)

## 7. Verificación de Funcionamiento

Para comprobar que la sincronización es correcta:

1. Abre `http://localhost:5173` en dos navegadores distintos (ej. Chrome y Edge).
2. Selecciona un usuario diferente en cada uno.
3. Envía un mensaje y observa cómo aparece en el otro navegador sin recargar la página.

---

**¡Felicidades!** Has construido un sistema de mensajería escalable con tecnología de vanguardia.

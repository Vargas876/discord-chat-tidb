# 📚 Tutorial Completo: TiDB Cloud para Chat en Tiempo Real

![TiDB Cloud](https://img.shields.io/badge/TiDB-Cloud-00A3E0?logo=pingcap&logoColor=white)

Guía paso a paso para entender y usar TiDB Cloud en este proyecto de chat estilo Discord.

---

## 📖 Tabla de Contenidos

1. [¿Qué es TiDB?](#qué-es-tidb)
2. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
3. [Configuración de TiDB Cloud](#configuración-de-tidb-cloud)
4. [Modelo de Datos](#modelo-de-datos)
5. [Operaciones CRUD](#operaciones-crud)
6. [Consultas Avanzadas](#consultas-avanzadas)
7. [Optimización](#optimización)
8. [WebSockets + TiDB](#websockets--tidb)
9. [Despliegue en Producción](#despliegue-en-producción)

---

## ¿Qué es TiDB?

TiDB ("Ti" = Titanium, "DB" = Database) es una base de datos **NewSQL** open-source desarrollada por PingCap.

### Características Principales

| Característica | Descripción |
|----------------|-------------|
| **SQL + NoSQL** | Sintaxis MySQL compatible + escalabilidad horizontal |
| **HTAP** | Transacciones (OLTP) + Análisis (OLAP) en una sola BD |
| **Cloud-Native** | Diseñada para Kubernetes y nube |
| **Consistencia** | ACID transaccional distribuida |
| **Escalabilidad** | Agregar/quitar nodos sin downtime |

### ¿Por qué TiDB para este Chat?

```
Tradicional (MySQL)          vs          TiDB
┌─────────────────┐                     ┌─────────────────┐
│  1 servidor     │                     │  Cluster auto-  │
│  Límite de RAM  │    ───────────►     │  escalable      │
│  Downtime para  │                     │  Alta           │
│  scale-up       │                     │  disponibilidad │
└─────────────────┘                     └─────────────────┘
```

**Caso de uso en chat:**
- ✅ Alta escritura concurrente (muchos usuarios enviando mensajes)
- ✅ Consultas en tiempo real (últimos mensajes)
- ✅ Escalabilidad automática (picos de tráfico)
- ✅ Analíticas (reportes de uso sin afectar transacciones)

---

## Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   React      │  │  WebSocket   │  │   HTTP API   │      │
│  │   Frontend   │──│   Client     │  │   Client     │      │
│  │   :5173      │  │              │  │              │      │
│  └──────────────┘  └──────┬───────┘  └──────┬───────┘      │
└───────────────────────────┼─────────────────┼──────────────┘
                            │                 │
                            ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVIDOR                             │
│  ┌──────────────────┐        ┌────────────────────────────┐ │
│  │  Socket.io       │        │    Next.js API Routes      │ │
│  │  Server :3002    │        │    REST API :3001          │ │
│  │                  │        │                            │ │
│  │  • Real-time     │        │  • GET /api/users          │ │
│  │  • Broadcasting  │        │  • GET /api/conversations  │ │
│  │  • Rooms         │        │  • GET /api/messages       │ │
│  └────────┬─────────┘        └───────────┬────────────────┘ │
│           │                              │                  │
│           └──────────────┬───────────────┘                  │
│                          │                                  │
│                          ▼                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Prisma ORM Client                      │   │
│  │                                                     │   │
│  │  • Type-safe queries                               │   │
│  │  • Migrations                                      │   │
│  │  • Schema management                               │   │
│  └────────────────────────┬────────────────────────────┘   │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ▼ SSL/TLS
┌─────────────────────────────────────────────────────────────┐
│                    TiDB CLOUD                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   TiDB       │  │    TiKV      │  │   TiFlash    │      │
│  │   Server     │  │  (Row Store) │  │ (Column Store│      │
│  │              │  │              │  │   for OLAP)  │      │
│  │  SQL Layer   │  │  OLTP Data   │  │  Analytics   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## Configuración de TiDB Cloud

### Paso 1: Crear Cuenta

1. Ve a [https://tidbcloud.com](https://tidbcloud.com)
2. Click en "Get Started Free"
3. Regístrate con email o GitHub/Google

### Paso 2: Crear Cluster

1. En el dashboard, click "Create Cluster"
2. Selecciona **Serverless Tier** (gratuito)
3. Configura:
   - **Cluster Name**: `chat-cluster`
   - **Region**: `US East (N. Virginia)`
   - **Cloud Provider**: AWS
4. Click "Create"

Espera ~2 minutos a que el cluster esté "Active".

### Paso 3: Panel de Control

Una vez creado el cluster, verás el dashboard principal:

![TiDB Cloud Dashboard](./images/tidb-dashboard.png)

> **Elementos importantes:**
> - **Status**: Debe mostrar "Active" 🟢
> - **Connect**: Botón para obtener credenciales
> - **SQL Editor**: Para ejecutar queries directamente
> - **Monitoring**: Métricas de uso

### Paso 4: Obtener Credenciales

1. Selecciona tu cluster
2. Click en el botón **"Connect"** (arriba a la derecha)
3. Verás el panel de conexión:

![TiDB Cloud Connect](./images/tidb-connect.png)

4. Click en **"Generate Password"** para crear una contraseña
5. Copia los datos mostrados:

```
HOST:     gateway01.us-east-1.prod.aws.tidbcloud.com
PORT:     4000
USERNAME: {prefix}.root
PASSWORD: {tu-password-generada}
DATABASE: test
```

### Paso 5: Configurar IP Access

⚠️ **IMPORTANTE**: Debes permitir tu IP para conectarte.

1. Ve a **Settings** → **Networking** en el menú lateral
2. O desde el panel de "Connect", ve a la pestaña **Security**

![TiDB Cloud Networking](./images/tidb-networking.png)

3. Click **"Add IP Address"** o usa los botones rápidos:
   - **+ Add Current IP**: Detecta automáticamente tu IP
   - **+ Add All Public Connections**: `0.0.0.0/0` (cualquier IP, menos seguro)

### Paso 6: URL de Conexión

Forma la URL para Prisma:

```
mysql://USERNAME:PASSWORD@HOST:PORT/DATABASE?sslaccept=strict
```

Ejemplo:
```
mysql://2LdZoyWhLHQtZn9.root:xyEkAnrwVNNZ1QFI@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict
```

---

## Modelo de Datos

### Diagrama ER

```
┌─────────────────┐         ┌─────────────────────┐         ┌─────────────────┐
│      users      │         │      messages       │         │  conversations  │
├─────────────────┤         ├─────────────────────┤         ├─────────────────┤
│ PK id           │◄────────┤ PK id               │────────►│ PK id           │
│    name         │    1:M  │ FK conversation_id  │    M:1  │    title        │
│    email        │         │ FK sender_id        │         │    created_at   │
│    avatar       │         │    content          │         └─────────────────┘
│    created_at   │         │    created_at       │
└─────────────────┘         └─────────────────────┘
```

### Schema Prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("TIDB_DATABASE_URL")
}

model User {
  id         String   @id @default(uuid())
  name       String
  email      String   @unique
  avatar     String?
  created_at DateTime @default(now())
  messages   Message[]
  
  @@map("users")
}

model Conversation {
  id         String   @id @default(uuid())
  title      String
  created_at DateTime @default(now())
  messages   Message[]
  
  @@map("conversations")
}

model Message {
  id              String       @id @default(uuid())
  conversation_id String
  sender_id       String
  content         String       @db.Text
  created_at      DateTime     @default(now())
  
  conversation    Conversation @relation(fields: [conversation_id], references: [id], onDelete: Cascade)
  sender          User         @relation(fields: [sender_id], references: [id], onDelete: Cascade)
  
  @@index([conversation_id])
  @@index([sender_id])
  @@index([created_at])
  @@map("messages")
}
```

### Tipos de Datos TiDB

| Tipo Prisma | Tipo TiDB | Uso en Chat |
|-------------|-----------|-------------|
| `String @id @default(uuid())` | `VARCHAR(36)` | IDs únicos |
| `String` | `VARCHAR(191)` | Nombres, emails |
| `String @db.Text` | `TEXT` | Contenido de mensajes |
| `DateTime @default(now())` | `DATETIME(3)` | Timestamps |
| `String?` | `VARCHAR(191) NULL` | Campos opcionales |

---

## Operaciones CRUD

### Create (INSERT)

```typescript
// Crear usuario
const user = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
  },
});

// Crear mensaje
const message = await prisma.message.create({
  data: {
    content: '¡Hola mundo!',
    conversation_id: 'conv-123',
    sender_id: 'user-456',
  },
  include: {
    sender: true,
  },
});
```

SQL generado:
```sql
INSERT INTO `users` (`id`, `name`, `email`, `avatar`, `created_at`)
VALUES ('uuid', 'Alice', 'alice@example.com', 'url...', NOW());
```

### Read (SELECT)

```typescript
// Listar usuarios
const users = await prisma.user.findMany({
  orderBy: { created_at: 'desc' },
});

// Obtener mensajes de conversación
const messages = await prisma.message.findMany({
  where: { conversation_id: 'conv-123' },
  orderBy: { created_at: 'asc' },
  include: {
    sender: {
      select: { id: true, name: true, avatar: true },
    },
  },
  take: 100, // Limitar resultados
});
```

SQL generado:
```sql
SELECT m.*, u.id, u.name, u.avatar
FROM `messages` m
JOIN `users` u ON m.sender_id = u.id
WHERE m.conversation_id = 'conv-123'
ORDER BY m.created_at ASC
LIMIT 100;
```

### Update

```typescript
// Actualizar usuario
await prisma.user.update({
  where: { id: 'user-123' },
  data: { name: 'Alice Updated' },
});
```

### Delete

```typescript
// Eliminar mensaje
await prisma.message.delete({
  where: { id: 'msg-123' },
});

// Eliminar conversación y todos sus mensajes (Cascade)
await prisma.conversation.delete({
  where: { id: 'conv-123' },
});
```

---

## Consultas Avanzadas

### Estadísticas de Chat

```typescript
// Mensajes por usuario
const stats = await prisma.user.findMany({
  select: {
    name: true,
    _count: { select: { messages: true } },
  },
  orderBy: {
    messages: { _count: 'desc' },
  },
});
```

### Últimos mensajes por conversación

```typescript
const recentMessages = await prisma.message.findMany({
  where: { conversation_id },
  orderBy: { created_at: 'desc' },
  take: 50,
  include: {
    sender: {
      select: { name: true, avatar: true },
    },
  },
});
```

### Búsqueda de mensajes

```typescript
const searchResults = await prisma.message.findMany({
  where: {
    content: { contains: 'palabra clave' },
    conversation_id,
  },
  include: {
    sender: true,
  },
});
```

---

## Optimización

### Índices en TiDB

El schema ya incluye índices óptimos:

```prisma
model Message {
  // ... campos ...
  
  @@index([conversation_id])  // Búsquedas por conversación
  @@index([sender_id])         // Búsquedas por usuario
  @@index([created_at])        // Ordenamiento temporal
}
```

### Paginación

```typescript
// Cursor-based (eficiente para tiempo real)
const messages = await prisma.message.findMany({
  where: { conversation_id },
  cursor: lastMessageId ? { id: lastMessageId } : undefined,
  take: 50,
  skip: lastMessageId ? 1 : 0,
  orderBy: { created_at: 'desc' },
});
```

### Connection Pooling

TiDB Cloud incluye pooling automático. Para Prisma:

```env
# .env
directUrl = env("DATABASE_URL")
```

---

## WebSockets + TiDB

### Flujo de Mensaje en Tiempo Real

```
Usuario A escribe        WebSocket           TiDB          Usuario B
     │                      │                  │              │
     │  1. Enviar mensaje   │                  │              │
     ├────────────────────►│                  │              │
     │                      │ 2. Guardar en BD │              │
     │                      ├────────────────►│              │
     │                      │ 3. Confirmación  │              │
     │                      │◄────────────────┤              │
     │  4. ACK              │                  │              │
     │◄────────────────────┤                  │              │
     │                      │ 5. Broadcast     │              │
     │                      ├────────────────────────────────►│
     │                      │                  │              │
     │                      │                  │   6. Mostrar │
     │                      │                  │◄─────────────┤
```

### Código del WebSocket Server

```javascript
// backend/socket/server.js
io.on('connection', (socket) => {
  // Unirse a sala de conversación
  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
  });

  // Recibir mensaje
  socket.on('send-message', async (data) => {
    const { content, conversation_id, sender_id } = data;

    // 1. Guardar en TiDB
    const message = await prisma.message.create({
      data: { content, conversation_id, sender_id },
      include: { sender: true },
    });

    // 2. Broadcast a todos en la sala
    io.to(conversation_id).emit('new-message', message);
  });
});
```

### Cliente WebSocket

```typescript
// frontend/src/services/socket.js
import { io } from 'socket.io-client';

const socket = io('http://localhost:3002');

// Enviar mensaje
export const sendMessageSocket = (messageData) => {
  socket.emit('send-message', messageData);
};

// Escuchar mensajes
export const onNewMessage = (callback) => {
  socket.on('new-message', callback);
};
```

---

## Despliegue en Producción

### Opciones de Hosting

| Servicio | Frontend | Backend API | WebSocket | Notas |
|----------|----------|-------------|-----------|-------|
| **Vercel** | ✅ Perfecto | ✅ Serverless | ❌ No soportado | Ideal solo para frontend |
| **Render** | ✅ Static | ✅ Node.js | ✅ WebSocket | Opción recomendada |
| **Railway** | ✅ Static | ✅ Node.js | ✅ WebSocket | Alternativa a Render |
| **Netlify** | ✅ Perfecto | ❌ No aplica | ❌ No aplica | Solo frontend |

### Opción Recomendada: Render

Render soporta todos los componentes del proyecto.

#### 1. Desplegar Backend + WebSocket (Juntos)

Crear `render.yaml` en la raíz:

```yaml
services:
  - type: web
    name: discord-chat-backend
    env: node
    buildCommand: cd backend && npm install && npm run db:generate
    startCommand: cd backend && node socket/server.js & npm run start
    envVars:
      - key: DATABASE_URL
        sync: false  # Configurar en dashboard
      - key: NODE_ENV
        value: production
    healthCheckPath: /api/users
```

#### 2. Desplegar Frontend (Separado)

```yaml
services:
  - type: static
    name: discord-chat-frontend
    buildCommand: cd frontend && npm install && npm run build
    publishDir: frontend/dist
    envVars:
      - key: VITE_API_URL
        value: https://discord-chat-backend.onrender.com
      - key: VITE_WS_URL
        value: wss://discord-chat-backend.onrender.com
```

### Configuración para Vercel (Frontend) + Render (Backend)

#### Frontend en Vercel

1. Sube el proyecto a GitHub
2. Conecta Vercel al repo
3. Configura:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Variables de entorno:
   ```
   VITE_API_URL=https://tu-backend.onrender.com
   VITE_WS_URL=wss://tu-backend.onrender.com
   ```

#### Backend en Render

1. Crea un Web Service en Render
2. Conecta al mismo repo
3. Configura:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `node socket/server.js`
4. Variables de entorno:
   ```
   DATABASE_URL=mysql://...tidbcloud.com:4000/test?sslaccept=strict
   WS_PORT=10000  # Render asigna puerto automáticamente
   ```

### Consideraciones Importantes

⚠️ **WebSockets en Serverless**:
- Vercel y Netlify NO soportan WebSockets en funciones serverless
- Solución: Usar Render/Railway para backend, o usar **Server-Sent Events (SSE)**

⚠️ **CORS en Producción**:
Actualizar `backend/next.config.js`:
```javascript
cors: {
  origin: ['https://tu-frontend.vercel.app'],
  credentials: true,
}
```

⚠️ **Variables de Entorno**:
Crear `.env.production` en frontend:
```env
VITE_API_URL=https://discord-chat-api.onrender.com
VITE_WS_URL=wss://discord-chat-api.onrender.com
```

---

## Comandos Útiles

### Prisma

```bash
# Generar cliente
npx prisma generate

# Sincronizar schema con BD
npx prisma db push

# Abrir UI visual
npx prisma studio

# Ejecutar seed
node prisma/seed.js
```

### MySQL CLI con TiDB

```bash
mysql -h gateway01.us-east-1.prod.aws.tidbcloud.com \
      -P 4000 \
      -u 2LdZoyWhLHQtZn9.root \
      -p \
      --ssl-mode=VERIFY_IDENTITY
```

### Ver logs de queries

En `backend/lib/prisma.js`:
```javascript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

---

## Troubleshooting

### Error: "Access denied"
```
Solución: Verificar que tu IP está en la lista blanca de TiDB Cloud
```

### Error: "SSL required"
```
Solución: Añadir ?sslaccept=strict a la URL de conexión
```

### Error: "Connection timeout"
```
Solución: Verificar firewall y que el cluster está activo
```

### Lentitud en queries
```
Solución: Verificar índices existentes con EXPLAIN
```

---

## Recursos

- 📖 [TiDB Cloud Docs](https://docs.pingcap.com/tidbcloud)
- 📖 [Prisma Docs](https://www.prisma.io/docs)
- 📖 [Socket.io Docs](https://socket.io/docs/)
- 🎓 [TiDB Academy](https://www.pingcap.com/education/)

---

**¡Feliz coding con TiDB!** 🚀

# 👨‍🏫 Guía de Acceso para el Profesor

Esta guía explica cómo otorgar acceso a la base de datos TiDB Cloud al profesor **Fredy** (o cualquier otro usuario).

---

## 📋 Datos de Conexión Actuales

```
Host:     gateway01.us-east-1.prod.aws.tidbcloud.com
Port:     4000
User:     2LdZoyWhLHQtZn9.root
Password: xyEkAnrwVNNZ1QFI
Database: test
```

---

## 🔐 Método 1: Acceso Directo a TiDB Cloud (Recomendado)

### Paso 1: Agregar IP del Profesor

1. Ve a [https://tidbcloud.com](https://tidbcloud.com)
2. Inicia sesión con tu cuenta
3. Ve a **Settings** → **Networking** en el menú lateral

![TiDB Cloud Networking](./images/tidb-networking.png)

4. Click en **"Add IP Address"**
5. Opciones:
   - **Opción A**: Pedir a Fredy su IP pública ([https://whatismyipaddress.com](https://whatismyipaddress.com))
   - **Opción B**: Usar `0.0.0.0/0` (menos seguro, acceso global)

### Paso 2: Crear Usuario Adicional (Opcional pero recomendado)

Para mayor seguridad, crea un usuario específico para el profesor:

```sql
-- Conectarse a TiDB Cloud con usuario root
-- Usar el botón "Connect" → "General" en el panel

-- Crear usuario para el profesor
CREATE USER 'fredy'@'%' IDENTIFIED BY 'password_seguro_123';

-- Otorgar permisos
GRANT SELECT, INSERT, UPDATE, DELETE ON test.* TO 'fredy'@'%';

-- Aplicar cambios
FLUSH PRIVILEGES;
```

### Paso 3: Compartir Credenciales

Envía a Fredy:

```
🗄️ Acceso a Base de Datos TiDB Cloud

Host:     gateway01.us-east-1.prod.aws.tidbcloud.com
Port:     4000
Usuario:  fredy (o 2LdZoyWhLHQtZn9.root si usas el principal)
Password: [la que definiste]
Database: test

URL de conexión MySQL:
mysql://fredy:password_seguro_123@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test?sslaccept=strict

Panel de control:
https://tidbcloud.com
```

---

## 💻 Método 2: Conexión vía MySQL CLI

### Instalar cliente MySQL

**Windows:**
```powershell
# Descargar desde https://dev.mysql.com/downloads/installer/
# O usar Chocolatey
choco install mysql
```

**Mac:**
```bash
brew install mysql-client
```

**Linux:**
```bash
sudo apt-get install mysql-client
```

### Conectar

```bash
mysql -h gateway01.us-east-1.prod.aws.tidbcloud.com \
      -P 4000 \
      -u 2LdZoyWhLHQtZn9.root \
      -p \
      --ssl-mode=VERIFY_IDENTITY
```

Luego ingresar la contraseña: `xyEkAnrwVNNZ1QFI`

---

## 🔧 Método 3: Conexión con DBeaver (GUI)

1. **Descargar DBeaver**: https://dbeaver.io/download/
2. **Nueva conexión**: Database → New Database Connection
3. **Seleccionar**: MySQL
4. **Configurar**:
   - Server Host: `gateway01.us-east-1.prod.aws.tidbcloud.com`
   - Port: `4000`
   - Database: `test`
   - Username: `2LdZoyWhLHQtZn9.root`
   - Password: `xyEkAnrwVNNZ1QFI`
5. **SSL**: Activar SSL (REQUERIDO para TiDB Cloud)
6. **Test Connection** → OK

---

## 📊 Comandos SQL Útiles para el Profesor

### Ver estructura de tablas

```sql
-- Listar todas las tablas
SHOW TABLES;

-- Ver estructura de una tabla
DESCRIBE users;
DESCRIBE conversations;
DESCRIBE messages;

-- O usando información del schema
SELECT * FROM information_schema.tables WHERE table_schema = 'test';
```

### Consultar datos

```sql
-- Ver usuarios
SELECT * FROM users;

-- Ver conversaciones con conteo de mensajes
SELECT 
    c.id,
    c.title,
    c.created_at,
    COUNT(m.id) as total_mensajes
FROM conversations c
LEFT JOIN messages m ON c.id = m.conversation_id
GROUP BY c.id;

-- Ver mensajes con info del remitente
SELECT 
    m.id,
    m.content,
    m.created_at,
    u.name as autor,
    c.title as canal
FROM messages m
JOIN users u ON m.sender_id = u.id
JOIN conversations c ON m.conversation_id = c.id
ORDER BY m.created_at DESC
LIMIT 20;
```

### Estadísticas del chat

```sql
-- Total de mensajes por usuario
SELECT 
    u.name,
    COUNT(*) as mensajes_enviados
FROM messages m
JOIN users u ON m.sender_id = u.id
GROUP BY u.id
ORDER BY mensajes_enviados DESC;

-- Actividad por hora
SELECT 
    HOUR(created_at) as hora,
    COUNT(*) as mensajes
FROM messages
GROUP BY HOUR(created_at)
ORDER BY hora;

-- Conversaciones más activas
SELECT 
    c.title,
    COUNT(m.id) as total_mensajes,
    MAX(m.created_at) as ultimo_mensaje
FROM conversations c
LEFT JOIN messages m ON c.id = m.conversation_id
GROUP BY c.id
ORDER BY total_mensajes DESC;
```

---

## 🔗 Método 4: Acceso vía Prisma Studio

Si el profesor tiene acceso al código del proyecto:

```bash
cd discord-chat-tidb/backend
npm install
npm run db:studio
```

Esto abrirá Prisma Studio en `http://localhost:5555` con interfaz visual para explorar y editar datos.

---

## 🌐 Método 5: SQL Editor de TiDB Cloud

El forma más sencilla para el profesor:

1. Ve a [https://tidbcloud.com](https://tidbcloud.com)
2. Selecciona el cluster
3. Click en **"SQL Editor"** en el menú lateral
4. Ejecuta queries directamente desde el navegador

No requiere instalación de ningún software.

---

## ⚠️ Notas de Seguridad

1. **No compartir contraseñas por email** - Usar herramientas seguras como:
   - [1Password](https://1password.com)
   - [Bitwarden](https://bitwarden.com)
   - WhatsApp/Telegram (mejor que email)

2. **Restringir IPs** - En lugar de `0.0.0.0/0`, usar la IP específica del profesor

3. **Usar usuario limitado** - El usuario `fredy` solo tiene permisos sobre la BD `test`, no sobre todo el cluster

4. **Rotar contraseñas** - Cambiar la contraseña después de la revisión del proyecto

---

## 📞 Soporte

Si hay problemas de conexión:

1. Verificar que la IP del profesor está en la lista blanca de TiDB Cloud
2. Confirmar que usa SSL/TLS obligatoriamente
3. Verificar que el puerto 4000 está abierto en el firewall del profesor
4. Contactar soporte de TiDB: https://docs.pingcap.com/tidbcloud/tidb-cloud-support

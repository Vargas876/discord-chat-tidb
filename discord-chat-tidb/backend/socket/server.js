/**
 * Servidor WebSocket para Chat en Tiempo Real
 * 
 * Este servidor maneja las conexiones en tiempo real para el chat.
 * Se ejecuta en paralelo con el backend de Next.js.
 * 
 * Puerto por defecto: 3002
 */

require('dotenv').config();
const { Server } = require('socket.io');
const { createServer } = require('http');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Crear servidor HTTP
const httpServer = createServer();

// Configurar Socket.IO con CORS
const allowedOrigins = [
  'http://localhost:5173', 
  'http://127.0.0.1:5173',
  'http://localhost:3000', 
  'http://localhost:3001',
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? allowedOrigins : '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Mapa para rastrear usuarios conectados
const connectedUsers = new Map();

// Eventos de Socket.IO
io.on('connection', (socket) => {
  console.log(`🔌 Nueva conexión: ${socket.id}`);

  // Usuario se une a una conversación
  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`👤 ${socket.id} se unió a conversación: ${conversationId}`);
    
    // Notificar a otros usuarios en la sala
    socket.to(conversationId).emit('user-joined', {
      socketId: socket.id,
      timestamp: new Date().toISOString(),
    });
  });

  // Usuario sale de una conversación
  socket.on('leave-conversation', (conversationId) => {
    socket.leave(conversationId);
    console.log(`👤 ${socket.id} salió de conversación: ${conversationId}`);
  });

  // Recibir y retransmitir mensaje
  socket.on('send-message', async (data) => {
    const { content, conversation_id, sender_id, type = "TEXT", attachment_url } = data;

    try {
      // Validar datos
      if (!conversation_id || !sender_id) {
        socket.emit('message-error', { error: 'Datos incompletos' });
        return;
      }

      // Guardar mensaje en la base de datos
      const message = await prisma.message.create({
        data: {
          content: content?.trim() || null,
          conversation_id,
          sender_id,
          type,
          attachment_url
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          reactions: true
        },
      });

      // Enviar a todos los usuarios en la conversación
      io.to(conversation_id).emit('new-message', message);

      console.log(`💬 Mensaje [${type}] enviado a sala ${conversation_id}`);
    } catch (error) {
      console.error('Error al procesar mensaje:', error);
      socket.emit('message-error', { 
        error: 'Error al enviar mensaje',
        details: error.message 
      });
    }
  });

  // Reacciones
  socket.on('add-reaction', async (data) => {
    const { message_id, user_id, emoji, conversation_id } = data;
    try {
      const reaction = await prisma.reaction.create({
        data: { message_id, user_id, emoji },
        include: { user: { select: { id: true, name: true } } }
      });
      io.to(conversation_id).emit('reaction-added', { message_id, reaction });
    } catch (error) {
       // Si ya existe, probablemente es un toggle que falló aquí, ya lo manejamos en API pero sockets son extra
       console.error("Error adding reaction", error);
    }
  });

  socket.on('remove-reaction', async (data) => {
    const { message_id, user_id, emoji, conversation_id } = data;
    try {
      const reaction = await prisma.reaction.findUnique({
        where: { message_id_user_id_emoji: { message_id, user_id, emoji } }
      });
      if (reaction) {
        await prisma.reaction.delete({ where: { id: reaction.id } });
        io.to(conversation_id).emit('reaction-removed', { message_id, user_id, emoji });
      }
    } catch (error) {
      console.error("Error removing reaction", error);
    }
  });

  // Editar/Eliminar
  socket.on('edit-message', async (data) => {
    const { message_id, content, conversation_id } = data;
    try {
      const updated = await prisma.message.update({
        where: { id: message_id },
        data: { content },
        include: { sender: true, reactions: true }
      });
      io.to(conversation_id).emit('message-updated', updated);
    } catch (error) {
      console.error("Error editing message", error);
    }
  });

  socket.on('delete-message', async (data) => {
    const { message_id, conversation_id } = data;
    try {
      await prisma.message.delete({ where: { id: message_id } });
      io.to(conversation_id).emit('message-deleted', { message_id });
    } catch (error) {
      console.error("Error deleting message", error);
    }
  });

  // Usuario está escribiendo
  socket.on('typing', (data) => {
    const { conversation_id, user_name } = data;
    socket.to(conversation_id).emit('user-typing', {
      user_name,
      conversation_id,
    });
  });

  // Dejar de escribir
  socket.on('stop-typing', (data) => {
    const { conversation_id, user_name } = data;
    socket.to(conversation_id).emit('user-stop-typing', {
      user_name,
      conversation_id,
    });
  });

  // Desconexión
  socket.on('disconnect', (reason) => {
    console.log(`❌ Desconexión: ${socket.id} (razón: ${reason})`);
    connectedUsers.delete(socket.id);
    
    // Notificar a todas las salas que el usuario se desconectó
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.to(room).emit('user-disconnected', {
          socketId: socket.id,
          timestamp: new Date().toISOString(),
        });
      }
    });
  });
});

// Puerto del servidor WebSocket (Render usa process.env.PORT)
const WS_PORT = process.env.PORT || process.env.WS_PORT || 3002;

// Iniciar servidor
httpServer.listen(WS_PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('🚀 Servidor WebSocket iniciado');
  console.log(`📡 Puerto: ${WS_PORT}`);
  console.log(`🌐 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log('✅ Listo para recibir conexiones...');
  console.log('========================================\n');
});

// Manejar errores del servidor HTTP
httpServer.on('error', (err) => {
  console.error('❌ Error en el servidor HTTP del Socket:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`🚨 El puerto ${WS_PORT} ya está en uso. Cierra otras instancias de Node.`);
  }
});

// Manejar cierre graceful
process.on('SIGTERM', async () => {
  console.log('👋 Cerrando servidor WebSocket...');
  await prisma.$disconnect();
  httpServer.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('👋 Cerrando servidor WebSocket...');
  await prisma.$disconnect();
  httpServer.close(() => {
    process.exit(0);
  });
});

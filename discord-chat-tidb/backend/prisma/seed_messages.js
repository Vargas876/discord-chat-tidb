const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Iniciando siembra de datos tecnológicos...');

    // 1. Asegurar que exista una conversación "General"
    let general = await prisma.conversation.findFirst({
      where: { title: 'General' }
    });

    if (!general) {
      general = await prisma.conversation.create({
        data: { title: 'General' }
      });
      console.log('✅ Canal General creado');
    }

    // 2. Crear usuarios tecnológicos/bots
    const usersData = [
      { name: 'CyberNet AI', email: 'cyber@network.ai', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyber' },
      { name: 'Galaxy Explorer', email: 'galaxy@void.space', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Galaxy' },
      { name: 'Root Admin', email: 'admin@system.io', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Admin' }
    ];

    const users = [];
    for (const u of usersData) {
      const user = await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          name: u.name,
          email: u.email,
          avatar: u.avatar,
          password: '$2b$10$EpJSqhWp68.zP.6cEisSre8.B9NnQk/e6.c8Gf6oN1G6X6S6S6S6S' // Dummy pass
        }
      });
      users.push(user);
    }
    console.log('✅ Usuarios bots listos');

    // 3. Añadir mensajes variados
    const messages = [
      { sender: users[0], content: 'Sistemas operativos. Conexión establecida con éxito. 🚀', type: 'TEXT' },
      { sender: users[1], content: '¿Alguien ha visto el último despliegue en la red TiDB? Es increíblemente rápido.', type: 'TEXT' },
      { sender: users[2], content: 'Recordatorio: Mañana tenemos mantenimiento de los protocolos de seguridad a las 04:00 GMT.', type: 'TEXT' },
      { sender: users[0], content: 'Cargando visualización del servidor...', type: 'TEXT' },
      { sender: users[0], content: '', type: 'IMAGE', attachment_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000' },
      { sender: users[1], content: '¡Esa vista es espectacular! Definitivamente futurista.', type: 'TEXT' },
      { sender: users[2], content: 'He actualizado los esquemas de la base de datos para soportar reacciones en tiempo real. ¡Pruébenlo!', type: 'TEXT' },
      { sender: users[0], content: 'Protocolo de bienvenida activado para nuevos nodos.', type: 'TEXT' },
      { sender: users[1], content: '✨', type: 'STICKER', attachment_url: 'https://api.dicebear.com/7.x/icons/svg?seed=star&backgroundColor=5865f2' }
    ];

    for (const msg of messages) {
      await prisma.message.create({
        data: {
          conversation_id: general.id,
          sender_id: msg.sender.id,
          content: msg.content,
          type: msg.type,
          attachment_url: msg.attachment_url,
          created_at: new Date(Date.now() - Math.random() * 10000000) // Fechas aleatorias recientes
        }
      });
    }

    console.log('✅ Mensajes de prueba inyectados correctamente');
    
  } catch (error) {
    console.error('❌ Error en el seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

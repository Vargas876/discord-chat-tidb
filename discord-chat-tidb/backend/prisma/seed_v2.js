const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('--- SEEDING REAL PEOPLE/TECH CHAT ---');

    // 1. Get or Create "General" channel
    let general = await prisma.conversation.findFirst({
      where: { title: 'General' }
    });
    if (!general) {
      general = await prisma.conversation.create({ data: { title: 'General' } });
    }

    // 2. Technical and "Momeado" users
    const userPool = [
      { name: 'Linus Torvaldsen', email: 'git_master@kernel.org', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linus' },
      { name: 'Ada Lovelace 2.0', email: 'ada@enigma.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ada' },
      { name: 'Grok_Bot', email: 'grok@x.ai', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Grok' },
      { name: 'Zero Cool', email: 'zero@hackers.net', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Zero' }
    ];

    const seededUsers = [];
    for (const u of userPool) {
      const user = await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          name: u.name,
          email: u.email,
          avatar: u.avatar,
          password: '$2b$10$EpJSqhWp68.zP.6cEisSre8.B9NnQk/e6.c8Gf6oN1G6X6S6S6S6S'
        }
      });
      seededUsers.push(user);
    }

    // 3. Dynamic messages
    const chatHistory = [
      { sender: seededUsers[0], content: '¿Alguien sabe por qué el build de Vercel falló de nuevo? 😅', type: 'TEXT' },
      { sender: seededUsers[1], content: 'Probablemente falta el "prisma generate" en el build pipeline.', type: 'TEXT' },
      { sender: seededUsers[2], content: 'ANALIZANDO LOGS... Error detectado en el middleware de autenticación.', type: 'TEXT' },
      { sender: seededUsers[3], content: 'Oye, mira este servidor que monté en TiDB Cloud. ¡Espectacular!', type: 'TEXT' },
      { sender: seededUsers[3], content: '', type: 'IMAGE', attachment_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800' },
      { sender: seededUsers[0], content: 'Hahaha, Zero Cool nunca cambia. Sigue siendo un hacker de la vieja escuela.', type: 'TEXT' },
      { sender: seededUsers[1], content: 'He actualizado las reacciones. Ahora pueden mandar emojis locos.', type: 'TEXT' },
      { sender: seededUsers[2], content: 'MANTENIMIENTO COMPLETADO. Nodo sincronizado al 100%.', type: 'TEXT' },
      { sender: seededUsers[1], content: '', type: 'STICKER', attachment_url: 'https://api.dicebear.com/7.x/icons/svg?seed=sparkles&backgroundColor=5865f2' }
    ];

    for (const msg of chatHistory) {
      await prisma.message.create({
        data: {
          conversation_id: general.id,
          sender_id: msg.sender.id,
          content: msg.content,
          type: msg.type,
          attachment_url: msg.attachment_url,
          created_at: new Date(Date.now() - Math.random() * 5000000)
        }
      });
    }

    console.log('✅ SEED COMPLETADO: El chat ahora tiene vida.');
  } catch (error) {
    console.error('❌ SEED FAILED:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

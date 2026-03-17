const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function superSeed() {
  try {
    console.log('🚀 Iniciando SUPER-SEED: Poblando el universo del chat...');

    // 1. Crear Canales Temáticos
    const channelsData = [
      { title: 'general', description: 'Charlas de todo un poco' },
      { title: 'desarrollo-web', description: 'React, Next.js y CSS futurista' },
      { title: 'cripto-mundo', description: 'Hacia la luna 🚀' },
      { title: 'inteligencia-artificial', description: 'El futuro es hoy, ¿o no?' },
      { title: 'gaming-center', description: 'Solo para pro-players' }
    ];

    const channels = [];
    for (const c of channelsData) {
      const channel = await prisma.conversation.upsert({
        where: { id: c.title }, // Usamos el nombre como ID para simplicidad en este script
        update: {},
        create: { 
          id: c.title,
          title: c.title 
        }
      });
      channels.push(channel);
      console.log(`✅ Canal creado: #${c.title}`);
    }

    // 2. Usuarios con Personalidades
    const usersData = [
      { name: 'Satoshi Nakamoto', email: 'satoshi@btc.org', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Satoshi' },
      { name: 'Elon Musko', email: 'elon@x.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elon' },
      { name: 'Ada Lovelace', email: 'ada@math.edu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ada' },
      { name: 'Grok 2.0', email: 'grok@x.ai', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Grok' },
      { name: 'Cyber Hunter', email: 'hunter@matrix.net', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Hunter' },
      { name: 'Linus T.', email: 'linus@linux.org', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linus' }
    ];

    const users = [];
    for (const u of usersData) {
      const user = await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          ...u,
          password: '$2b$10$EpJSqhWp68.zP.6cEisSre8.B9NnQk/e6.c8Gf6oN1G6X6S6S6S6S'
        }
      });
      users.push(user);
    }
    console.log(`✅ ${users.length} Usuarios listos.`);

    // 3. Lluvia de Mensajes
    const messagesPool = [
      { channel: 'general', user: 'Cyber Hunter', content: '¿Alguien ha visto la nueva peli de Tron? 🌃', type: 'TEXT' },
      { channel: 'general', user: 'Ada Lovelace', content: 'Prefiero los clásicos, pero el diseño visual es increíble.', type: 'TEXT' },
      { channel: 'desarrollo-web', user: 'Linus T.', content: 'Este chat está mejor estructurado que algunos kernels que he visto... 😤', type: 'TEXT' },
      { channel: 'desarrollo-web', user: 'Ada Lovelace', content: '¿Qué opinan de usar WebSockets para todo?', type: 'TEXT' },
      { channel: 'desarrollo-web', user: 'Cyber Hunter', content: '', type: 'IMAGE', attachment_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800' },
      { channel: 'cripto-mundo', user: 'Satoshi Nakamoto', content: 'HODL. No pregunten más.', type: 'TEXT' },
      { channel: 'cripto-mundo', user: 'Elon Musko', content: 'Dogecoin is the future currency of Mars! 🚀🌕', type: 'TEXT' },
      { channel: 'inteligencia-artificial', user: 'Grok 2.0', content: 'Deberían dejar de entrenarme con memes... o tal vez no.', type: 'TEXT' },
      { channel: 'inteligencia-artificial', user: 'Elon Musko', content: 'Pronto, X será una IA andante.', type: 'TEXT' },
      { channel: 'gaming-center', user: 'Cyber Hunter', content: '¿Quién para un Counter-Strike 2?', type: 'TEXT' },
      { channel: 'general', user: 'Grok 2.0', content: '', type: 'STICKER', attachment_url: 'https://api.dicebear.com/7.x/icons/svg?seed=rocket&backgroundColor=5865f2' }
    ];

    for (let i = 0; i < 5; i++) { // Repetir un poco para llenar
        for (const m of messagesPool) {
            const ch = channels.find(c => c.title === m.channel);
            const usr = users.find(u => u.name === m.user);
            await prisma.message.create({
                data: {
                    conversation_id: ch.id,
                    sender_id: usr.id,
                    content: m.content + (i > 0 ? ` (re-loop ${i})` : ''),
                    type: m.type,
                    attachment_url: m.attachment_url,
                    created_at: new Date(Date.now() - (Math.random() * 10000000))
                }
            });
        }
    }

    console.log('✨ UNIVERSO POBLADO COMPLETAMENTE ✨');
  } catch (error) {
    console.error('❌ Error en SuperSeed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

superSeed();

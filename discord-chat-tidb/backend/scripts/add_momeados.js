const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addMessages() {
  try {
    let general = await prisma.conversation.findFirst({ where: { title: 'General' } });
    if (!general) {
      general = await prisma.conversation.create({ data: { title: 'General' } });
    }

    const people = [
      { name: 'Satoshi Nakamoto', email: 'satoshi@bitcoin.org', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Satoshi' },
      { name: 'Sam Altman', email: 'sam@openai.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' },
      { name: 'Elon Musko', email: 'elon@x.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elon' },
      { name: 'Vitalik B.', email: 'vitalik@ethereum.org', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vitalik' }
    ];

    const users = [];
    for (const p of people) {
      const user = await prisma.user.upsert({
        where: { email: p.email },
        update: {},
        create: { ...p, password: 'hashed_dummy_password' }
      });
      users.push(user);
    }

    const rawMessages = [
      { sender: users[0], content: 'El protocolo de consenso está funcionando perfecto. ⛓️' },
      { sender: users[1], content: '¿Alguien ha probado el nuevo modelo GPT-5? Ah espera, que no ha salido todavía. 😉' },
      { sender: users[2], content: 'DOGE TO THE MOON! 🚀🌕' },
      { sender: users[3], content: 'The Merge fue solo el comienzo. Escalabilidad es la clave.' },
      { sender: users[0], content: '¿Qué estamos construyendo hoy, equipo?' }
    ];

    for (const m of rawMessages) {
      await prisma.message.create({
        data: {
          conversation_id: general.id,
          sender_id: m.sender.id,
          content: m.content,
          type: 'TEXT'
        }
      });
    }

    console.log('--- Mensajes "Momeados" inyectados ---');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

addMessages();

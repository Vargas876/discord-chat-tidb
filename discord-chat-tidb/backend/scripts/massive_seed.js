const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addEverything() {
  try {
    console.log('--- STARTING MASSIVE SEED ---');
    
    // 1. Ensure users exist
    const userPool = [
      { name: 'Satoshi Nakamoto', email: 'satoshi@btc.org', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Satoshi' },
      { name: 'Elon Musko', email: 'elon@x.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elon' },
      { name: 'Vitalik Buterin', email: 'vitalik@eth.org', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vitalik' },
      { name: 'Jensen Huang', email: 'jensen@nvidia.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jensen' },
      { name: 'Sam Altman', email: 'sam@openai.com', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' }
    ];

    const users = [];
    for (const u of userPool) {
      const dbUser = await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: { ...u, password: 'hashed_dummy_password_123' }
      });
      users.push(dbUser);
    }
    console.log(`Users ready: ${users.length}`);

    // 2. Comprehensive Channel List
    const channelTitles = [
      'anuncios-importantes',
      'debate-tecnico',
      'memes-y-shitpost',
      'cripto-alerta',
      'ia-generativa',
      'off-topic',
      'musica-chill',
      'showcase-proyectos'
    ];

    for (const title of channelTitles) {
      const conv = await prisma.conversation.create({
        data: { title }
      });
      console.log(`Channel created: #${title}`);

      // 3. Add 10-15 messages per channel
      for (let i = 0; i < 12; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const contents = [
          `¿Habéis visto el nuevo paper de ${title}? 🔥`,
          `Acabo de terminar un deploy en este canal de ${title}.`,
          `Increíble el avance que estamos teniendo aquí.`,
          `¿Alguien para charlar un rato sobre ${title}?`,
          `HODL ${title}! (bueno, si fuera una coin)`,
          `Checkeando los logs de ${title}... todo verde.`,
          `Me encanta la vibra de #${title}.`,
          `¿Para cuándo la próxima reunión de ${title}?`,
          `Miren esta imagen que encontré de ${title}:`,
          `En el futuro, ${title} será operado por IAs.`
        ];
        
        const type = Math.random() > 0.85 ? (Math.random() > 0.5 ? 'IMAGE' : 'STICKER') : 'TEXT';
        let content = contents[Math.floor(Math.random() * contents.length)];
        let attachment_url = null;

        if (type === 'IMAGE') {
           attachment_url = `https://images.unsplash.com/photo-${1550000000000 + Math.floor(Math.random()*1000000)}?auto=format&fit=crop&q=80&w=800`;
           content = '';
        } else if (type === 'STICKER') {
           attachment_url = `https://api.dicebear.com/7.x/icons/svg?seed=${title}${i}&backgroundColor=5865f2`;
           content = '';
        }

        await prisma.message.create({
          data: {
            conversation_id: conv.id,
            sender_id: randomUser.id,
            content: content,
            type: type,
            attachment_url: attachment_url,
            created_at: new Date(Date.now() - (Math.random() * 10000000))
          }
        });
      }
      console.log(`  -> Added 12 messages to #${title}`);
    }

    console.log('--- MASSIVE SEED COMPLETED SUCCESSFULLY ---');
  } catch (error) {
    console.error('ERROR SEEDING:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addEverything();

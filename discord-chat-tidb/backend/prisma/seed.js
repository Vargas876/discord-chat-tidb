/**
 * Script de inicialización de datos (Seed)
 * 
 * Este script crea automáticamente datos de prueba si la base de datos está vacía.
 * Se ejecuta con: npm run db:seed
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Datos de prueba
const USERS_DATA = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  },
  {
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
  },
];

const CONVERSATIONS_DATA = [
  { title: '💬 General' },
  { title: '🔧 Técnico' },
  { title: '🎮 Gaming' },
];

const MESSAGES_TEMPLATES = [
  '¡Hola a todos! 👋',
  '¿Cómo va el proyecto?',
  'Estoy trabajando en la nueva funcionalidad',
  '¡Genial! Avísame si necesitas ayuda',
  'La base de datos TiDB está funcionando perfecto 🚀',
  '¿Alguien quiere jugar más tarde?',
  'Estoy revisando el código ahora mismo',
  'El diseño de Discord se ve increíble',
  '¡Los WebSockets están funcionando en tiempo real!',
  '¿Ya vieron las métricas del servidor?',
  'Voy a crear un nuevo canal para el equipo de frontend',
  'El chat está muy fluido, me encanta 🔥',
  '¿Podemos reunirnos mañana a las 3pm?',
  'Claro, me funciona perfecto ese horario',
  'Voy a documentar los cambios en el README',
];

async function seed() {
  console.log('🌱 Iniciando seed de la base de datos...\n');

  try {
    // Verificar si ya existen datos
    const existingUsers = await prisma.user.count();
    
    if (existingUsers > 0) {
      console.log('✅ La base de datos ya tiene datos. Saltando seed.');
      return;
    }

    console.log('📦 Creando usuarios...');
    const users = [];
    for (const userData of USERS_DATA) {
      const user = await prisma.user.create({ data: userData });
      users.push(user);
      console.log(`  ✓ Usuario creado: ${user.name} (${user.email})`);
    }

    console.log('\n📦 Creando conversaciones...');
    const conversations = [];
    for (const convData of CONVERSATIONS_DATA) {
      const conv = await prisma.conversation.create({ data: convData });
      conversations.push(conv);
      console.log(`  ✓ Conversación creada: ${conv.title}`);
    }

    console.log('\n📦 Creando mensajes...');
    let messageCount = 0;
    
    // Distribuir mensajes entre conversaciones
    for (let i = 0; i < MESSAGES_TEMPLATES.length; i++) {
      const conversation = conversations[i % conversations.length];
      const sender = users[i % users.length];
      
      await prisma.message.create({
        data: {
          content: MESSAGES_TEMPLATES[i],
          conversation_id: conversation.id,
          sender_id: sender.id,
          // Distribuir mensajes en el tiempo (últimas 24 horas)
          created_at: new Date(Date.now() - (MESSAGES_TEMPLATES.length - i) * 30 * 60 * 1000),
        },
      });
      messageCount++;
    }
    console.log(`  ✓ ${messageCount} mensajes creados`);

    console.log('\n✅ Seed completado exitosamente!');
    console.log('\nResumen:');
    console.log(`  👤 Usuarios: ${users.length}`);
    console.log(`  💬 Conversaciones: ${conversations.length}`);
    console.log(`  📝 Mensajes: ${messageCount}`);

  } catch (error) {
    console.error('\n❌ Error durante el seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar seed
seed();

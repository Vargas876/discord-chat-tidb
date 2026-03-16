import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request, { params }) {
  try {
    const { id: messageId } = params;
    const { userId, emoji } = await request.json();

    if (!userId || !emoji) {
      return NextResponse.json(
        { error: 'userId y emoji son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si ya existe la reacción para el usuario
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        message_id_user_id_emoji: {
          message_id: messageId,
          user_id: userId,
          emoji: emoji
        }
      }
    });

    if (existingReaction) {
      // Si ya existe, la quitamos (toggle feature)
      await prisma.reaction.delete({
        where: { id: existingReaction.id }
      });
      return NextResponse.json({ message: 'Reacción eliminada', action: 'removed' });
    }

    // Crear nueva reacción
    const reaction = await prisma.reaction.create({
      data: {
        message_id: messageId,
        user_id: userId,
        emoji: emoji
      }
    });

    return NextResponse.json({ message: 'Reacción agregada', action: 'added', data: reaction });
  } catch (error) {
    console.error('Error en reacciones:', error);
    return NextResponse.json(
      { error: 'Error al procesar reacción' },
      { status: 500 }
    );
  }
}

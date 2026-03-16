import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET /api/conversations - Obtener todas las conversaciones
export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    // Formatear la respuesta
    const formattedConversations = conversations.map((conv) => ({
      id: conv.id,
      title: conv.title,
      created_at: conv.created_at,
      message_count: conv._count.messages,
    }));

    return NextResponse.json({ success: true, data: formattedConversations });
  } catch (error) {
    console.error('Error al obtener conversaciones:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener conversaciones' },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Crear una nueva conversación
export async function POST(request) {
  try {
    const body = await request.json();
    const { title } = body;

    // Validaciones
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'El título es requerido' },
        { status: 400 }
      );
    }

    if (title.length > 100) {
      return NextResponse.json(
        { success: false, error: 'El título no puede exceder 100 caracteres' },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.create({
      data: { title: title.trim() },
    });

    return NextResponse.json(
      { 
        success: true, 
        data: conversation, 
        message: 'Conversación creada exitosamente' 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear conversación:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear conversación' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET /api/messages?conversationId=xxx - Obtener mensajes
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: 'conversationId es requerido' },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: { conversation_id: conversationId },
      orderBy: { created_at: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      take: 100,
    });

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener mensajes' },
      { status: 500 }
    );
  }
}

// POST /api/messages - Crear un nuevo mensaje
export async function POST(request) {
  try {
    const body = await request.json();
    const { content, conversation_id, sender_id, type = "TEXT", attachment_url } = body;

    // Validaciones
    if (!conversation_id || !sender_id) {
      return NextResponse.json(
        { success: false, error: 'conversation_id y sender_id son requeridos' },
        { status: 400 }
      );
    }

    if (type === "TEXT" && (!content || content.trim().length === 0)) {
      return NextResponse.json(
        { success: false, error: 'El mensaje de texto no puede estar vacío' },
        { status: 400 }
      );
    }

    // Crear el mensaje
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

    return NextResponse.json(
      { success: true, data: message },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear mensaje:', error);
    return NextResponse.json(
      { success: false, error: 'Error al enviar mensaje' },
      { status: 500 }
    );
  }
}

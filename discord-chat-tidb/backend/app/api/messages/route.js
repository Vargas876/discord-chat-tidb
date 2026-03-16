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
      },
      take: 100, // Limitar a últimos 100 mensajes
    });

    // Formatear respuesta
    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      created_at: msg.created_at,
      conversation_id: msg.conversation_id,
      sender: msg.sender,
    }));

    return NextResponse.json({ success: true, data: formattedMessages });
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
    const { content, conversation_id, sender_id } = body;

    // Validaciones
    if (!content || !conversation_id || !sender_id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'content, conversation_id y sender_id son requeridos' 
        },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'El mensaje no puede estar vacío' },
        { status: 400 }
      );
    }

    // Verificar que la conversación existe
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversation_id },
    });

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversación no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: sender_id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Crear el mensaje
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        conversation_id,
        sender_id,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        data: message, 
        message: 'Mensaje enviado exitosamente' 
      },
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

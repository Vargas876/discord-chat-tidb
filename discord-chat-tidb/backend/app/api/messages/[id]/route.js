import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE /api/messages/[id]
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await prisma.message.delete({
      where: { id }
    });
    return NextResponse.json({ message: 'Mensaje eliminado' });
  } catch (error) {
    console.error('Error al eliminar mensaje:', error);
    return NextResponse.json({ error: 'Error al eliminar mensaje' }, { status: 500 });
  }
}

// PATCH /api/messages/[id] - Editar mensaje
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: 'Contenido requerido' }, { status: 400 });
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { content: content.trim() },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true }
        },
        reactions: true
      }
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error('Error al editar mensaje:', error);
    return NextResponse.json({ error: 'Error al editar mensaje' }, { status: 500 });
  }
}

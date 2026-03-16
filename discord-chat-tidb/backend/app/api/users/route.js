import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// GET /api/users - Obtener todos los usuarios
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        created_at: true,
      },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener usuarios' },
      { status: 500 }
    );
  }
}

// POST /api/users - Crear un nuevo usuario
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, avatar } = body;

    // Validaciones básicas
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Crear avatar automático si no se proporciona
    const userAvatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        avatar: userAvatar,
      },
    });

    return NextResponse.json(
      { success: true, data: user, message: 'Usuario creado exitosamente' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear usuario:', error);
    
    // Manejar error de email duplicado
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'El email ya está registrado' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Error al crear usuario' },
      { status: 500 }
    );
  }
}

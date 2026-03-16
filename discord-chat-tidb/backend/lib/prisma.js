/**
 * Configuración del cliente Prisma para TiDB Cloud
 * 
 * Este archivo crea una instancia singleton del cliente Prisma
 * para evitar múltiples conexiones en desarrollo (hot reload)
 */

import { PrismaClient } from '@prisma/client';

// Configuración de Prisma con logging en desarrollo
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

// Singleton pattern para evitar múltiples instancias en desarrollo
globalThis.prismaGlobal = globalThis.prismaGlobal || prismaClientSingleton();

const prisma = globalThis.prismaGlobal;

export default prisma;

// Exportar para usar en seed y otros scripts
export { prisma };

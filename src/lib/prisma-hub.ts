import { PrismaClient } from '@prisma/client';

const globalForPrismaHub = globalThis as unknown as {
  prismaHub: PrismaClient | undefined;
};

export const prismaHub = globalForPrismaHub.prismaHub ?? new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://dafel_user:dafel_password@localhost:5432/dafel_hub_db"
    }
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrismaHub.prismaHub = prismaHub;
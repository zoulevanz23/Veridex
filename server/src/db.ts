// Prisma / DB Client wrapper with fallback for standalone dev mode

class MockPrismaClient {
  user = {
    findUnique: async (_args: any) => null as any,
    create: async (args: any) => ({ id: 'user_1', ...args.data, createdAt: new Date(), updatedAt: new Date() }),
  };
  apiKey = {
    create: async (args: any) => ({ id: 'key_1', ...args.data, createdAt: new Date(), lastUsed: null }),
    delete: async (_args: any) => ({ id: 'key_1' }),
    findMany: async (_args: any) => [],
  };
}

let prismaClient: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaClient } = require('@prisma/client');
  prismaClient = new PrismaClient();
} catch {
  prismaClient = new MockPrismaClient();
}

export const prisma = prismaClient;
export default prisma;
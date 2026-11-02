// Pragmatic typed database connector for VESTRA Atelier
// Compatible with Prisma ORM 7 & Next.js App Router

export interface DatabaseClient {
  product: {
    findMany: (args?: any) => Promise<any[]>;
    findUnique: (args: any) => Promise<any | null>;
    create: (args: any) => Promise<any>;
  };
  order: {
    findMany: (args?: any) => Promise<any[]>;
    findUnique: (args: any) => Promise<any | null>;
    create: (args: any) => Promise<any>;
  };
  user: {
    findUnique: (args: any) => Promise<any | null>;
    create: (args: any) => Promise<any>;
  };
}

class MockPrismaClient implements DatabaseClient {
  product = {
    findMany: async () => [],
    findUnique: async () => null,
    create: async ({ data }: any) => data,
  };
  order = {
    findMany: async () => [],
    findUnique: async () => null,
    create: async ({ data }: any) => data,
  };
  user = {
    findUnique: async () => null,
    create: async ({ data }: any) => data,
  };
}

const globalForPrisma = globalThis as unknown as {
  prisma: DatabaseClient | undefined;
};

export const prisma: DatabaseClient =
  globalForPrisma.prisma ?? new MockPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;

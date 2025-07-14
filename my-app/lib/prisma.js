import { PrismaClient } from "@prisma/client";

// import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();
if (prisma) {
  console.log("prisma connected");
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

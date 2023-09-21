import { PrismaClient } from "@prisma/client";

export const primaClient = new PrismaClient({ log: ["query"] });

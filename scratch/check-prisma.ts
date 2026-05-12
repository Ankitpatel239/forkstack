import { prisma } from "@/lib/db";


async function main() {
    console.log('Prisma keys:', Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')));
} 

main();

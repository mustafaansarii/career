const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://4f118d51c34d314e64e0391797dbdb1b7ade0671da14740d29bcaf4c3dc04b87:sk_oiuZci5qT11IQPO8HZ9Wd@db.prisma.io:5432/postgres?sslmode=require"
    }
  }
});

async function main() {
  await prisma.$executeRawUnsafe('TRUNCATE TABLE "JobApplication" CASCADE;');
  console.log("Cleared JobApplication");
}
main().catch(console.error).finally(() => prisma.$disconnect());

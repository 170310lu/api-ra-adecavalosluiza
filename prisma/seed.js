require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const racasIniciais = require('../src/data/racas');

const prisma = new PrismaClient();

async function main() {
  for (const raca of racasIniciais) {
    await prisma.raca.upsert({
      where: { id: raca.id },
      update: raca,
      create: raca
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
const prisma = require('../config/database');

function buscarPorEmail(email) {
  return prisma.usuario.findUnique({ where: { email } });
}

function criar(dados) {
  return prisma.usuario.create({ data: dados });
}

function buscarPorId(id) {
  return prisma.usuario.findUnique({
    where: { id },
    select: { id: true, nome: true, email: true, createdAt: true }
  });
}

module.exports = { buscarPorEmail, criar, buscarPorId };
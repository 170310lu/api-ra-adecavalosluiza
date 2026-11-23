const prisma = require('../config/database');

function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

function listarTodas() {
  return prisma.raca.findMany({ orderBy: { id: 'asc' } });
}

function buscarPorId(id) {
  return prisma.raca.findUnique({ where: { id } });
}

function buscarPorNome(nome) {
  return prisma.raca.findMany({ orderBy: { id: 'asc' } }).then((racas) => {
    const termo = normalizar(nome);
    return racas.filter((raca) => normalizar(raca.nome).includes(termo));
  });
}

function criar(dados) {
  return prisma.raca.create({ data: dados });
}

function atualizar(id, dados) {
  return prisma.raca.update({ where: { id }, data: dados });
}

function excluir(id) {
  return prisma.raca.delete({ where: { id } });
}

module.exports = { listarTodas, buscarPorId, buscarPorNome, criar, atualizar, excluir };
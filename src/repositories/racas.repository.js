const racasIniciais = require('../data/racas');

function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

const racas = [...racasIniciais];

function listarTodas() {
  return [...racas];
}

function buscarPorId(id) {
  return racas.find((raca) => raca.id === id) || null;
}

function buscarPorNome(nome) {
  const termo = normalizar(nome);
  return racas.filter((raca) => normalizar(raca.nome).includes(termo));
}

module.exports = { listarTodas, buscarPorId, buscarPorNome };
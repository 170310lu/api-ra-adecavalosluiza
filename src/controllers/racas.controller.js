const racasRepository = require('../repositories/racas.repository');

const camposTexto = [
  'nome', 'origem', 'pelagem', 'temperamento', 'finalidade', 'descricao'
];
const camposNumero = ['alturaMediaCm', 'pesoMedioKg'];
const camposPermitidos = new Set([...camposTexto, ...camposNumero]);

function validarId(id) {
  const valor = Number(id);
  return Number.isInteger(valor) && valor > 0 ? valor : null;
}

function validarDados(dados, parcial = false) {
  const chaves = Object.keys(dados || {});
  if (chaves.some((chave) => !camposPermitidos.has(chave))) {
    return { erro: 'A requisição contém campos não permitidos.' };
  }
  if (parcial && chaves.length === 0) {
    return { erro: 'Informe ao menos um campo para atualizar.' };
  }

  const resultado = {};
  for (const campo of camposTexto) {
    if (!(campo in (dados || {}))) {
      if (!parcial) return { erro: `O campo ${campo} é obrigatório.` };
      continue;
    }
    if (typeof dados[campo] !== 'string' || !dados[campo].trim()) {
      return { erro: `O campo ${campo} deve ser um texto não vazio.` };
    }
    resultado[campo] = dados[campo].trim();
  }
  for (const campo of camposNumero) {
    if (!(campo in (dados || {}))) {
      if (!parcial) return { erro: `O campo ${campo} é obrigatório.` };
      continue;
    }
    if (!Number.isInteger(dados[campo]) || dados[campo] <= 0) {
      return { erro: `O campo ${campo} deve ser um inteiro positivo.` };
    }
    resultado[campo] = dados[campo];
  }
  return { dados: resultado };
}

function erroValidacao(res, message) {
  return res.status(400).json({
    error: { code: 'DADOS_INVALIDOS', message }
  });
}

async function listarTodas(req, res) {
  const racas = await racasRepository.listarTodas();
  return res.status(200).json({ data: racas, total: racas.length });
}

async function buscarPorId(req, res) {
  const id = validarId(req.params.id);
  if (!id) {
    return res.status(400).json({
      error: { code: 'ID_INVALIDO', message: 'O ID deve ser um número inteiro positivo.' }
    });
  }

  const raca = await racasRepository.buscarPorId(id);
  if (!raca) {
    return res.status(404).json({
      error: { code: 'RACA_NAO_ENCONTRADA', message: `Nenhuma raça foi encontrada com o ID ${id}.` }
    });
  }
  return res.status(200).json({ data: raca });
}

async function buscarPorNome(req, res) {
  const nome = req.params.nome.trim();
  if (!nome) {
    return res.status(400).json({
      error: { code: 'NOME_INVALIDO', message: 'Informe um nome de raça para a pesquisa.' }
    });
  }

  const racas = await racasRepository.buscarPorNome(nome);
  if (racas.length === 0) {
    return res.status(404).json({
      error: { code: 'RACA_NAO_ENCONTRADA', message: `Nenhuma raça corresponde à pesquisa "${nome}".` }
    });
  }
  return res.status(200).json({ data: racas, total: racas.length });
}

async function criar(req, res) {
  const validacao = validarDados(req.body);
  if (validacao.erro) return erroValidacao(res, validacao.erro);
  const raca = await racasRepository.criar(validacao.dados);
  return res.status(201).json({ data: raca });
}

async function atualizar(req, res) {
  const id = validarId(req.params.id);
  if (!id) {
    return res.status(400).json({
      error: { code: 'ID_INVALIDO', message: 'O ID deve ser um número inteiro positivo.' }
    });
  }
  const validacao = validarDados(req.body, true);
  if (validacao.erro) return erroValidacao(res, validacao.erro);
  const raca = await racasRepository.atualizar(id, validacao.dados);
  return res.status(200).json({ data: raca });
}

async function excluir(req, res) {
  const id = validarId(req.params.id);
  if (!id) {
    return res.status(400).json({
      error: { code: 'ID_INVALIDO', message: 'O ID deve ser um número inteiro positivo.' }
    });
  }
  await racasRepository.excluir(id);
  return res.status(200).json({ message: 'Raça excluída com sucesso.' });
}

module.exports = { listarTodas, buscarPorId, buscarPorNome, criar, atualizar, excluir };
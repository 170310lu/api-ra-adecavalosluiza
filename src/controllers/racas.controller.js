const racasRepository = require('../repositories/racas.repository');

function listarTodas(req, res, next) {
  try {
    const racas = racasRepository.listarTodas();
    return res.status(200).json({ data: racas, total: racas.length });
  } catch (error) {
    return next(error);
  }
}

function buscarPorId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      error: {
        code: 'ID_INVALIDO',
        message: 'O ID deve ser um número inteiro positivo.'
      }
    });
  }

  try {
    const raca = racasRepository.buscarPorId(id);

    if (!raca) {
      return res.status(404).json({
        error: {
          code: 'RACA_NAO_ENCONTRADA',
          message: `Nenhuma raça foi encontrada com o ID ${id}.`
        }
      });
    }

    return res.status(200).json({ data: raca });
  } catch (error) {
    return next(error);
  }
}

function buscarPorNome(req, res, next) {
  const nome = req.params.nome.trim();

  if (!nome) {
    return res.status(400).json({
      error: {
        code: 'NOME_INVALIDO',
        message: 'Informe um nome de raça para a pesquisa.'
      }
    });
  }

  try {
    const racas = racasRepository.buscarPorNome(nome);

    if (racas.length === 0) {
      return res.status(404).json({
        error: {
          code: 'RACA_NAO_ENCONTRADA',
          message: `Nenhuma raça corresponde à pesquisa "${nome}".`
        }
      });
    }

    return res.status(200).json({ data: racas, total: racas.length });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listarTodas, buscarPorId, buscarPorNome };
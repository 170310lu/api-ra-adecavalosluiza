function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.code === 'P2002') {
    return res.status(409).json({
      error: { code: 'REGISTRO_DUPLICADO', message: 'Já existe um registro com esses dados.' }
    });
  }
  if (error.code === 'P2025') {
    return res.status(404).json({
      error: { code: 'REGISTRO_NAO_ENCONTRADO', message: 'O registro solicitado não foi encontrado.' }
    });
  }
  if (['P1001', 'P1002', 'P1003', 'P1017'].includes(error.code)) {
    return res.status(503).json({
      error: { code: 'BANCO_INDISPONIVEL', message: 'Não foi possível conectar ao banco de dados.' }
    });
  }
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({
      error: { code: 'JSON_INVALIDO', message: 'O corpo da requisição deve conter JSON válido.' }
    });
  }

  console.error(error);
  return res.status(error.status || 500).json({
    error: {
      code: error.status ? 'REQUISICAO_INVALIDA' : 'ERRO_INTERNO',
      message: error.status
        ? 'Não foi possível processar o corpo da requisição.'
        : 'Ocorreu um erro interno ao processar a solicitação.'
    }
  });
}

module.exports = errorHandler;
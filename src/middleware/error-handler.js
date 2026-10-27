function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  console.error(error);
  return res.status(500).json({
    error: {
      code: 'ERRO_INTERNO',
      message: 'Ocorreu um erro interno ao processar a solicitação.'
    }
  });
}

module.exports = errorHandler;
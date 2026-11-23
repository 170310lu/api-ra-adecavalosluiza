const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      error: { code: 'TOKEN_AUSENTE', message: 'Informe um token Bearer válido.' }
    });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({
      error: { code: 'TOKEN_INVALIDO', message: 'O token é inválido ou expirou.' }
    });
  }
}

module.exports = autenticar;
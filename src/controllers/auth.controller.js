const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuariosRepository = require('../repositories/usuarios.repository');

const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarConfiguracaoJwt() {
  if (!process.env.JWT_SECRET) {
    throw new Error('A variável JWT_SECRET não foi configurada.');
  }
}

async function cadastrar(req, res) {
  const nome = typeof req.body.nome === 'string' ? req.body.nome.trim() : '';
  const email = typeof req.body.email === 'string'
    ? req.body.email.trim().toLowerCase()
    : '';
  const senha = typeof req.body.senha === 'string' ? req.body.senha : '';

  if (!nome || !email || !senha) {
    return res.status(400).json({
      error: { code: 'CAMPOS_OBRIGATORIOS', message: 'Nome, email e senha são obrigatórios.' }
    });
  }
  if (!emailValido.test(email)) {
    return res.status(400).json({
      error: { code: 'EMAIL_INVALIDO', message: 'Informe um endereço de email válido.' }
    });
  }
  if (senha.length < 8) {
    return res.status(400).json({
      error: { code: 'SENHA_INVALIDA', message: 'A senha deve ter pelo menos 8 caracteres.' }
    });
  }

  if (await usuariosRepository.buscarPorEmail(email)) {
    return res.status(409).json({
      error: { code: 'EMAIL_CADASTRADO', message: 'Este email já está cadastrado.' }
    });
  }

  const senhaHash = await bcrypt.hash(senha, 12);
  const usuario = await usuariosRepository.criar({ nome, email, senhaHash });

  return res.status(201).json({
    data: { id: usuario.id, nome: usuario.nome, email: usuario.email }
  });
}

async function login(req, res) {
  const email = typeof req.body.email === 'string'
    ? req.body.email.trim().toLowerCase()
    : '';
  const senha = typeof req.body.senha === 'string' ? req.body.senha : '';

  if (!email || !senha) {
    return res.status(400).json({
      error: { code: 'CAMPOS_OBRIGATORIOS', message: 'Email e senha são obrigatórios.' }
    });
  }

  const usuario = await usuariosRepository.buscarPorEmail(email);
  if (!usuario || !(await bcrypt.compare(senha, usuario.senhaHash))) {
    return res.status(401).json({
      error: { code: 'CREDENCIAIS_INVALIDAS', message: 'Email ou senha incorretos.' }
    });
  }

  validarConfiguracaoJwt();
  const token = jwt.sign(
    { sub: String(usuario.id), nome: usuario.nome },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );

  return res.status(200).json({
    data: {
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
    }
  });
}

async function perfil(req, res) {
  const usuario = await usuariosRepository.buscarPorId(Number(req.usuario.sub));
  if (!usuario) {
    return res.status(404).json({
      error: { code: 'USUARIO_NAO_ENCONTRADO', message: 'Usuário não encontrado.' }
    });
  }
  return res.status(200).json({ data: usuario });
}

module.exports = { cadastrar, login, perfil };
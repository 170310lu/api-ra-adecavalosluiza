const test = require('node:test');
const { after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = require('../src/config/database');
const app = require('../src/app');

let token;

after(async () => prisma.$disconnect());

test('GET /api/racas lista as oito raças em JSON', async () => {
  const response = await request(app).get('/api/racas');

  assert.equal(response.status, 200);
  assert.equal(response.headers['content-type'].includes('application/json'), true);
  assert.equal(response.body.total, 8);
  assert.equal(response.body.data[0].nome, 'Árabe');
});

test('GET /api/racas/:id retorna a raça solicitada', async () => {
  const response = await request(app).get('/api/racas/2');

  assert.equal(response.status, 200);
  assert.equal(response.body.data.nome, 'Quarto de Milha');
});

test('GET /api/racas/buscar/:nome pesquisa sem diferenciar acentos ou caixa', async () => {
  const response = await request(app).get('/api/racas/buscar/arabe');

  assert.equal(response.status, 200);
  assert.equal(response.body.data[0].nome, 'Árabe');
});

test('responde com erros JSON para IDs inválidos e raças inexistentes', async () => {
  const invalidId = await request(app).get('/api/racas/abc');
  const missingBreed = await request(app).get('/api/racas/999');

  assert.equal(invalidId.status, 400);
  assert.equal(invalidId.body.error.code, 'ID_INVALIDO');
  assert.equal(missingBreed.status, 404);
  assert.equal(missingBreed.body.error.code, 'RACA_NAO_ENCONTRADA');
});

test('cadastra usuário, rejeita duplicidade e autentica com JWT', async () => {
  const cadastro = await request(app)
    .post('/api/auth/cadastro')
    .send({ nome: 'Luiza', email: 'LUiza@example.com', senha: 'senha-segura-123' });

  assert.equal(cadastro.status, 201);
  assert.equal(cadastro.body.data.email, 'luiza@example.com');
  const usuarioSalvo = await prisma.usuario.findUnique({ where: { email: 'luiza@example.com' } });
  assert.notEqual(usuarioSalvo.senhaHash, 'senha-segura-123');

  const duplicado = await request(app)
    .post('/api/auth/cadastro')
    .send({ nome: 'Luiza', email: 'luiza@example.com', senha: 'senha-segura-123' });
  assert.equal(duplicado.status, 409);

  const credenciaisInvalidas = await request(app)
    .post('/api/auth/login')
    .send({ email: 'luiza@example.com', senha: 'senha-errada' });
  assert.equal(credenciaisInvalidas.status, 401);

  const login = await request(app)
    .post('/api/auth/login')
    .send({ email: 'luiza@example.com', senha: 'senha-segura-123' });
  assert.equal(login.status, 200);
  token = login.body.data.token;
  assert.equal(jwt.verify(token, process.env.JWT_SECRET).sub, String(cadastro.body.data.id));

  const perfilSemToken = await request(app).get('/api/auth/me');
  const perfil = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${token}`);
  assert.equal(perfilSemToken.status, 401);
  assert.equal(perfil.status, 200);
  assert.equal(perfil.body.data.email, 'luiza@example.com');
});

test('protege e executa o CRUD de raças com persistência no SQLite', async () => {
  const dados = {
    nome: 'Raça de Teste',
    origem: 'Brasil',
    alturaMediaCm: 150,
    pesoMedioKg: 450,
    pelagem: 'Variada',
    temperamento: 'Dócil',
    finalidade: 'Sela',
    descricao: 'Registro usado pela suíte de integração.'
  };

  const semToken = await request(app).post('/api/racas').send(dados);
  assert.equal(semToken.status, 401);

  const criada = await request(app)
    .post('/api/racas')
    .set('Authorization', `Bearer ${token}`)
    .send(dados);
  assert.equal(criada.status, 201);
  const id = criada.body.data.id;

  const clienteDepoisDoRestart = new PrismaClient();
  await prisma.$disconnect();
  const persistida = await clienteDepoisDoRestart.raca.findUnique({ where: { id } });
  await clienteDepoisDoRestart.$disconnect();
  assert.equal(persistida.nome, dados.nome);

  const atualizada = await request(app)
    .patch(`/api/racas/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ nome: 'Raça Atualizada' });
  assert.equal(atualizada.status, 200);
  assert.equal(atualizada.body.data.nome, 'Raça Atualizada');

  const consultada = await request(app).get(`/api/racas/${id}`);
  assert.equal(consultada.status, 200);

  const excluida = await request(app)
    .delete(`/api/racas/${id}`)
    .set('Authorization', `Bearer ${token}`);
  assert.equal(excluida.status, 200);

  const removida = await request(app).get(`/api/racas/${id}`);
  assert.equal(removida.status, 404);
});
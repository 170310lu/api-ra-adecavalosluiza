const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');

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
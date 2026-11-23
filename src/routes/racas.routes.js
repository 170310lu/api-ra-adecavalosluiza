const express = require('express');
const racasController = require('../controllers/racas.controller');
const autenticar = require('../middleware/auth');
const asyncHandler = require('../utils/async-handler');

const router = express.Router();

router.get('/buscar/:nome', asyncHandler(racasController.buscarPorNome));
router.get('/', asyncHandler(racasController.listarTodas));
router.get('/:id', asyncHandler(racasController.buscarPorId));
router.post('/', autenticar, asyncHandler(racasController.criar));
router.patch('/:id', autenticar, asyncHandler(racasController.atualizar));
router.delete('/:id', autenticar, asyncHandler(racasController.excluir));

module.exports = router;
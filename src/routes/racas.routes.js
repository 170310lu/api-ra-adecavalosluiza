const express = require('express');
const racasController = require('../controllers/racas.controller');

const router = express.Router();

router.get('/buscar/:nome', racasController.buscarPorNome);
router.get('/', racasController.listarTodas);
router.get('/:id', racasController.buscarPorId);

module.exports = router;
const express = require('express');
const authController = require('../controllers/auth.controller');
const autenticar = require('../middleware/auth');
const asyncHandler = require('../utils/async-handler');

const router = express.Router();

router.post('/cadastro', asyncHandler(authController.cadastrar));
router.post('/login', asyncHandler(authController.login));
router.get('/me', autenticar, asyncHandler(authController.perfil));

module.exports = router;
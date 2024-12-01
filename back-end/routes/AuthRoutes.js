const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

// Definição das rotas
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);


module.exports = router;

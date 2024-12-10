const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

// Definição das rotas
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/listProfessor',AuthController.listProfessors);
router.get('/listStudents',AuthController.listStudents);




module.exports = router;

const express = require('express');
const router = express.Router();
const ApiUsuarioController = require('../controllers_api/ApiUsuarioController');
const ApiEmpresaController = require('../controllers_api/ApiEmpresaController')

// Rota para obter todos os usuários
router.get('/api/usuarios', ApiUsuarioController.apiGetAll);

// Rota para obter um usuário específico
router.get('/api/usuarios/:id', ApiUsuarioController.apiGetOne);

// Rota para criar um novo usuário
router.post('/api/usuarios', ApiUsuarioController.apiStore);

// Rota para atualizar um usuário
router.put('/api/usuarios/:id', ApiUsuarioController.apiUpdate);

// Rota para excluir um usuário
router.delete('/api/usuarios/:id', ApiUsuarioController.apiDestroy);


// Rota para obter todos os usuários
router.get('/api/empresa', ApiEmpresaController.apiGetAll);

// Rota para obter um usuário específico
router.get('/api/empresa/:id', ApiEmpresaController.apiGetOne);

// Rota para criar um novo usuário
router.post('/api/empresa', ApiEmpresaController.apiStore);

// Rota para atualizar um usuário
router.put('/api/empresa/:id', ApiEmpresaController.apiUpdate);

// Rota para excluir um usuário
router.delete('/api/empresa/:id', ApiEmpresaController.apiDestroy);

module.exports = router;
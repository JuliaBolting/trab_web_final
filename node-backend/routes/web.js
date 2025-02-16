const express = require('express');
const webUsuarioController = require('../controllers_web/WebUsuarioController');
const webEmpresaController = require('../controllers_web/WebEmpresaController');
const webCurriculoController = require('../controllers_web/WebCurriculoController');
const router = express.Router();

router.get("/", (req, res) => {
    const message = req.session.message;
    req.session.message = null; // Limpa a mensagem após exibir
    res.render("index", {layout: "Layout/main", title: "Página inicial", message});
});

// =================== Rotas para Candidato ===================


// Atualizar candidato
//router.post('/candidato/edit/:id', webUsuarioController.update);

// Exibir detalhes do candidato

// =================== Rotas para Empresa ===================

// Exibir formulário de criação de empresa
router.get('/Empresa/create', webEmpresaController.create);

// Criar uma nova empresa
router.post('/Empresa/create', webEmpresaController.store);

// Exibir formulário de edição de empresa
router.get('/Empresa/edit/:id', webEmpresaController.edit);

// Atualizar empresa
router.post('/Empresa/edit/:id', webEmpresaController.update);

// Exibir detalhes da empresa
router.get('/Empresa/show/:id', webEmpresaController.show);


// =================== Rotas para Usuário ===================

router.get('/usuario/create', webUsuarioController.index);
router.get('/usuario/password', webUsuarioController.password);

router.post('/usuario/create', webUsuarioController.store);
router.post('/login', webUsuarioController.login);
router.post('/usuario/password', webUsuarioController.recuperarSenha);
router.post('/usuario/new-password', webUsuarioController.novaSenha);


router.get('/candidato/show/:id', webCurriculoController.show);
router.get('/candidato/edit/:id', webCurriculoController.index);
router.post('/candidato/edit/:id', webCurriculoController.edit);



module.exports = router;
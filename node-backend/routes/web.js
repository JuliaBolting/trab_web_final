const express = require('express');
const webUsuarioController = require('../controllers_web/WebUsuarioController');
const webEmpresaController = require('../controllers_web/WebEmpresaController');
const webCurriculoController = require('../controllers_web/WebCurriculoController');
const webVagaController = require('../controllers_web/WebVagaController');
const router = express.Router();

router.get("/", (req, res) => {
    const message = req.session.message;
    req.session.message = null; // Limpa a mensagem após exibir
    res.render("index", {layout: "Layout/main", title: "Página inicial", message});
});

router.get('/usuario/create', webUsuarioController.index);
router.get('/usuario/password', webUsuarioController.password);

router.post('/usuario/create', webUsuarioController.store);
router.post('/login', webUsuarioController.login);
router.post('/usuario/password', webUsuarioController.recuperarSenha);
router.post('/usuario/new-password', webUsuarioController.novaSenha);


router.get('/candidato/show/:id', webCurriculoController.show);
router.get('/candidato/index/:id', webCurriculoController.index);
router.get('/candidato/vagas', webVagaController.show);
router.get('/candidato/inscricoes', webUsuarioController.inscricoes);

router.post('/candidato/cancelar/inscricao/:id', webUsuarioController.cancelarInscricao);
router.post('/candidato/aplicar/vaga/:vaga', webVagaController.candidatar);
router.post('/candidato/edit/:id', webCurriculoController.edit);
router.post('/candidato/atualizarDisponibilidade/:id', webCurriculoController.atualizarDisponibilidade);


router.get('/empresa/index', webEmpresaController.index);
router.get('/empresa/vagas/cadastrar', webEmpresaController.show);
router.post('/empresa/vagas/criar', webEmpresaController.create);




module.exports = router;
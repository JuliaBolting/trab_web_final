const UsuarioModel = require('../models/UsuarioModel');
const NotificacaoModel = require('../models/NotificacaoModel');
const VagaModel = require('../models/VagaModel');
const EmpresaModel = require('../models/EmpresaModel');

class webEmpresaController {
  // Exibe as vagas da empresa com candidatos
  async index(req, res) {
    try {
      const usuarioId = req.session.usuario.id; // Identifica a empresa logada
      // Buscar a empresa associada ao usuário
      const empresaUsuario = await VagaModel.findOneByOne(usuarioId);
      console.log("empresaUsuario", empresaUsuario);

      if (!empresaUsuario) {
        return res.status(400).send('Usuário não está associado a nenhuma empresa.');
      }
      const vagas = await VagaModel.findAll(empresaUsuario);

      res.render('empresa/index', {
        vagas,
        message: req.session.message || null,
      });
    } catch (error) {
      console.error("Erro ao buscar vagas", error);
      res.status(500).send('Erro ao buscar vagas');
    }
  }

  // Página para criar uma nova vaga
  async show(req, res) {
    try {
      res.render('empresa/create', { message: req.session.message || null });
    } catch (error) {
      console.error('Erro ao carregar página de criar vaga:', error);
      res.status(500).send('Erro interno do servidor');
    }
  }

  // Criação de uma nova vaga
  async create(req, res) {
    try {
      const { titulo, descricao, salario, quantidade } = req.body;
      const usuarioId = req.session.usuario.id; // Id do usuário logado
      console.log("WebEmpresa create usuarioId", usuarioId, req.body);

      // Buscar a empresa associada ao usuário
      const empresaUsuario = await VagaModel.findOneByOne(usuarioId);

      if (!empresaUsuario) {
        return res.status(400).send('Usuário não está associado a nenhuma empresa.');
      }

      // Criar a nova vaga com a empresa_id
      const novaVagaInstance = new VagaModel();
      novaVagaInstance.empresa_id = empresaUsuario; // Atribuir corretamente o empresa_id
      novaVagaInstance.titulo = titulo;
      novaVagaInstance.descricao = descricao;
      novaVagaInstance.salario = salario;
      novaVagaInstance.quantidade = quantidade;
      novaVagaInstance.status = "aberta";

      // Salvar a vaga usando o método save da instância
      await novaVagaInstance.save();

      res.redirect('/empresa/index'); // Redireciona após criar a vaga
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao criar vaga');
    }
  }


}

module.exports = new webEmpresaController();
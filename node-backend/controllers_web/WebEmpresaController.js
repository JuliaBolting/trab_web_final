const UsuarioModel = require('../models/UsuarioModel');
const NotificacaoModel = require('../models/NotificacaoModel');
const VagaModel = require('../models/VagaModel');

class webEmpresaController {
  // Exibe as vagas da empresa com candidatos
  async index(req, res) {
    try {
      const empresaId = req.session.usuario.id; // Identifica a empresa logada
      const vagas = await VagaModel.findAll({
        where: { empresa_id: empresaId, status: 'aberta' },
        include: [{
          model: VagaModel, // Aqui deve ser CandidaturaModel
          include: [UsuarioModel], // Inclui o candidato
        }],
      });
      console.log("vagas", vagas);

      res.render('empresa/index', {
        vagas,
        message: req.session.message || null,
      });
    } catch (error) {
      console.log("error", error);
      console.error(error);
      res.status(500).send('Erro ao buscar vagas');
    }
  }

  // Funções para aprovar, recusar ou marcar entrevista
  async atualizarStatusCandidatura(req, res) {
    const { candidaturaId, status } = req.body;

    try {
      const candidatura = await VagaModel.findByPk(candidaturaId); // Alterado para CandidaturaModel
      if (!candidatura) {
        return res.status(404).send('Candidatura não encontrada');
      }

      candidatura.status = status;
      await candidatura.save();

      // Enviar notificação ao candidato
      await NotificacaoModel.save({
        usuario_id: candidatura.usuario_id, // Corrigido para usar o usuario_id da candidatura
        mensagem: `Sua candidatura foi ${status === 'aprovado' ? 'aprovada' : status === 'reprovado' ? 'reprovada' : 'marcada para entrevista'}`,
        tipo: 'outro'
      });

      req.session.message = { text: 'Status atualizado com sucesso!', type: 'success' };
      res.redirect('/empresa');
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao atualizar status');
    }
  }
}

module.exports = new webEmpresaController();
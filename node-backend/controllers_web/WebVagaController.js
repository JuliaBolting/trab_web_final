const VagaModel = require('../models/VagaModel');
const CurriculoModel = require('../models/CurriculoModel');

class WebVagaController {

    async show(req, res) {
        try {
            const vaga = await VagaModel.findAll();
            console.log("show vagas", vaga);
            
            // Passando a mensagem da sessão para a view
            const message = req.session.message;
            req.session.message = null;  // Limpa a mensagem após exibir

            res.render('candidato/vagas', {
                vaga,
                message // Passa a mensagem para o template
            });
        } catch (error) {
            console.error('Erro ao buscar currículo:', error);
            res.status(500).send('Erro interno do servidor');
        }
    }

    async candidatar(req, res) {
        console.log("candidatar");

        const usuarioId = req.session.usuario ? req.session.usuario.id : null; 
        const vagaId = req.params.vaga;
        console.log(usuarioId, vagaId);

        if (!usuarioId) {
            req.session.message = { type: "danger", text: "Usuário não autenticado." };
            return res.redirect('/candidato/vagas'); // Redireciona para as vagas, após definir a mensagem
        }

        try {
            const candidato = await CurriculoModel.findCandidatoId(usuarioId);
            if (!candidato) {
                req.session.message = { type: "danger", text: "Candidato não encontrado." };
                return res.redirect('/candidato/vagas'); // Redireciona para as vagas, após definir a mensagem
            }

            const vaga = await VagaModel.findOne(vagaId);
            if (!vaga) {
                req.session.message = { type: "danger", text: "Vaga não encontrada." };
                return res.redirect('/candidato/vagas'); // Redireciona para as vagas, após definir a mensagem
            }

            // Cria a candidatura
            await VagaModel.store(candidato.id, vagaId);

            // Mensagem de sucesso
            req.session.message = { type: "success", text: "Candidatura realizada com sucesso!" };
            return res.redirect('/candidato/vagas'); // Redireciona para as vagas, após definir a mensagem

        } catch (error) {
            console.error('Erro ao candidatar-se:', error);
            req.session.message = { type: "danger", text: "Erro ao processar a candidatura." };
            return res.redirect('/candidato/vagas'); // Redireciona para as vagas, após definir a mensagem
        }
    }

}

module.exports = new WebVagaController();
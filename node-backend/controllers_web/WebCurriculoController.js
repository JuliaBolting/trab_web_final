const UsuarioModel = require('../models/UsuarioModel');
const CurriculoModel = require('../models/CurriculoModel');

class WebCurriculoController {

    async show(req, res) {
        try {
            const { id } = req.params;
            console.log(id);

            // Buscar candidato pelo ID
            let candidato = await CurriculoModel.findCandidatoId(id);

            // Caso não tenha candidato, use as informações do usuário
            if (!candidato) {
                const usuario = req.session.usuario;
                if (!usuario) {
                    return res.status(404).send('Usuário não encontrado');
                }
                candidato = {
                    id: usuario.id,
                    nome: usuario.nome,
                    foto: null, // Adapte conforme necessário, por exemplo, defina uma foto padrão
                    foto_capa: null, // Adapte conforme necessário
                    localizacao: null, // Deixe vazio ou defina um valor padrão
                    setor: null, // Deixe vazio ou defina um valor padrão
                    resumo: null, // Deixe vazio ou defina um valor padrão
                    disponivel: true, // Defina como verdadeiro ou de acordo com sua lógica
                    notificacoes: [] // Deixe vazio ou ajuste conforme a necessidade
                };
            }

            // Buscar formações acadêmicas do candidato
            const formacoes = await CurriculoModel.findFormacaoCandidatoId(id);
            console.log(formacoes);

            // Buscar certificações do candidato
            const certificacoes = await CurriculoModel.findCerificacaoCandidatoId(id);
            console.log(certificacoes);

            // Renderizar a view passando os dados
            res.render('candidato/show', {
                candidato,
                formacoes,
                certificacoes
            });
        } catch (error) {
            console.error('Erro ao buscar currículo:', error);
            res.status(500).send('Erro interno do servidor');
        }
    }

    async index(req, res) {
        try {
            const { id } = req.params;
            console.log("id index", id);

            // Buscar candidato pelo ID
            const candidato = await CurriculoModel.findCandidatoId(id);
            if (!candidato) {
                return res.status(404).send('Candidato não encontrado');
            }
            console.log("aqui", candidato);

            // Buscar formações acadêmicas do candidato
            const formacoes = await CurriculoModel.findFormacaoCandidatoId(id);
            console.log(formacoes);

            // Buscar certificações do candidato
            const certificacoes = await CurriculoModel.findCerificacaoCandidatoId(id);
            console.log(certificacoes);


            res.render('candidato/edit', {
                candidato,
                formacoes: formacoes,
                certificacoes: certificacoes
            });
        } catch (error) {
            console.error('Erro ao editar currículo:', error);
            res.status(500).send('Erro interno do servidor');
        }
    }

    async edit(req, res) {
        try {
            console.log("Dados recebidos:", req.body);
            console.log("Arquivo recebido:", req.file);

            const candidato = new CurriculoModel({
                id: req.params.id,
                nome: req.body.nome || null,
                foto: req.file ? req.file.path : req.body.foto || null,
                localizacao: req.body.localizacao || null,
                setor: req.body.setor || null,
                resumo: req.body.resumo || null,
                disponivel: req.body.disponivel ? 1 : 0,
                area_id: req.body.area_id || null,
                area: req.body.area || null,
                formacoes: req.body.formacao ? Object.values(req.body.formacao) : [],
                certificacoes: req.body.certificacao ? Object.values(req.body.certificacao) : []
            });

            await candidato.save();

            req.session.message = "Currículo atualizado com sucesso!";
            res.redirect(`/candidato/show/${candidato.id}`);
        } catch (error) {
            console.error("Erro ao atualizar currículo:", error);
            res.status(500).send("Erro ao atualizar currículo.");
        }
    }

    async atualizarDisponibilidade(req, res) {
        try {
            const { id } = req.params;
            const { disponivel } = req.body;

            console.log("Recebido:", { id, disponivel });

            if (typeof disponivel === 'undefined') {
                return res.status(400).json({ success: false, message: "Campo 'disponivel' é obrigatório" });
            }

            await CurriculoModel.atualizarDisponibilidade(id, disponivel);

            res.json({ success: true, message: "Disponibilidade atualizada!" });
        } catch (error) {
            console.error("Erro ao atualizar disponibilidade:", error);
            res.status(500).json({ success: false, message: "Erro interno do servidor" });
        }
    }


}

module.exports = new WebCurriculoController();
const UsuarioModel = require("../models/UsuarioModel");
const RecuperacaoSenhaModel = require("../models/RecuperacaoSenhaModel");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Console } = require("console");

class WebUsuarioController {

    // Exibir formulário de criação
    async index(req, res) {
        return res.render('usuario/create');
    }

    async create(req, res) {
        try {
            return res.render("Usuario/create", {
                layout: "Layouts/main",
                title: "Criar Usuário",
                csrfToken: req.csrfToken()
            });
        } catch (error) {
            req.session.message = ["danger", JSON.stringify(error)];
        }
        return res.redirect("/usuario");
    }

    // Criar candidato
    async store(req, res) {
        try {
            const { nome, email, senha } = req.body;
            console.log("Método recebido:", req.method, req.body);

            // Verificar se todos os campos foram preenchidos
            if (!nome || !email || !senha) {
                console.log("Campos vazios");
                req.session.message = ["warning", "Todos os campos são obrigatórios para cadastrar um usuário."];
                return res.redirect("/usuario/create");
            }

            const usuarioExistente = await UsuarioModel.findOneByEmail(email);
            if (usuarioExistente) {
                req.session.message = ["warning", "E-mail já cadastrado."];
                return res.redirect("/usuario");
            }

            const usuario = new UsuarioModel();
            usuario.nome = nome;
            usuario.email = email;
            usuario.senha = senha;
            await usuario.save();

            req.session.message = { type: "success", text: "Usuário cadastrado com sucesso." };
            return res.redirect("/"); // Redireciona para a página de listagem de usuários ou outra página que desejar
        } catch (error) {
            req.session.message = ["danger", "Erro ao cadastrar usuário. " + error.message];
            return res.redirect("/usuario/create"); // Redireciona de volta para o formulário de criação
        }
    }


    // Exibir formulário de edição
    async edit(req, res) {
        try {
            const candidato = await UsuarioModel.findById(req.params.id);
            return res.render('candidato/edit', { candidato }); // Usa render em vez de redirect
        } catch (error) {
            req.session.message = ["danger", "Erro ao carregar os dados do candidato."];
            return res.redirect('/'); // Redireciona em caso de erro
        }
    }

    // Atualizar candidato
    async update(req, res) {
        try {
            await UsuarioModel.update(req.params.id, req.body);
            req.session.message = { type: "success", text: "Usuário cadastrado com sucesso." };
            return res.redirect(`/candidato/show/${req.params.id}`);
        } catch (error) {
            req.session.message = ["danger", "Erro ao atualizar candidato."];
            return res.redirect(`/candidato/edit/${req.params.id}`);
        }
    }

    // Exibir detalhes
    async show(req, res) {
        const candidato = await UsuarioModel.findById(req.params.id);
        return res.render('candidato/show', { candidato });
    }

    // Função de login
    async login(req, res) {
        try {
            const { email, senha } = req.body;
            console.log("Método recebido:", req.method, req.body);

            if (!email || !senha) {
                req.session.message = ["warning", "E-mail e senha são obrigatórios."];
                return res.redirect("index");
            }

            // Valida o usuário através do método do modelo
            console.log("aqui");
            const usuario = await UsuarioModel.validateUser(email, senha);
            console.log("apos validateUser", usuario);
            if (usuario === null) {
                req.session.message = { type: "danger", text: "E-mail ou senha inválidos." };
                console.log("danger");
                return res.redirect("/");
            }

            // Armazena as informações do usuário na sessão
            console.log("req.session.usuario");
            req.session.usuario = { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo };
            console.log("danger req.session.usuario");
            req.session.message = ["success", `Bem-vindo, ${usuario.nome}!`];

            // Verifica o tipo de usuário e redireciona para a view correta
            console.log(usuario.tipo);
            if (usuario.tipo === 'candidato') {
                console.log("candidato");
                return res.redirect(`/Candidato/show/${usuario.id}`);
            } else if (usuario.tipo === 'funcionario') {
                console.log("funcionario");
                return res.redirect(`/Empresa/show/${usuario.id}`);
            } else {
                req.session.message = ["danger", "Tipo de usuário inválido."];
                console.log("inválido");
                return res.redirect("index");
            }

        } catch (error) {
            console.log("error");
            req.session.message = ["danger", JSON.stringify(error)];
            return res.redirect("index");
        }
    }

    // Exibir o formulário de recuperação de senha
    async password(req, res) {
        return res.render('usuario/password', {
            title: 'Recuperar Senha'
        });
    }

    // Processar a recuperação de senha
    async recuperarSenha(req, res) {
        const { email } = req.body;

        try {
            const usuario = await UsuarioModel.findOneByEmail(email);

            if (!usuario) {
                return res.render('usuario/password', {
                    error: 'E-mail não encontrado. Verifique e tente novamente.'
                });
            } else {
                return res.render('usuario/newPassword', { usuario: { id: usuario.id } });

            }

        } catch (err) {
            console.error(err);
            console.log("error");
            res.render('usuario/password', {
                error: 'Erro ao processar sua solicitação. Tente novamente.'
            });
        }
    }

    // Exibir o formulário de redefinição de senha
    async novaSenha(req, res) {
        console.log("Dados recebidos:", req.body); // Verifica os valores recebidos
        const { id, senha } = req.body;
    
        if (!id || !senha) {
            return res.render('usuario/newPassword', {
                error: 'ID ou senha ausente. Tente novamente.'
            });
        }
    
        try {
            await UsuarioModel.updatePassword(id, senha);
            res.render('usuario/newPassword', {
                success: 'Senha atualizada com sucesso!'
            });
        } catch (err) {
            console.error(err);
            res.render('usuario/newPassword', {
                error: 'Erro ao atualizar a senha. Tente novamente.'
            });
        }
    }
    

}

module.exports = new WebUsuarioController();
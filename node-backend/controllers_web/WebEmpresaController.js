const EmpresaModel = require("../models/EmpresaModel.js");

class WebEmpresaController {
    async create(req, res) {
        return res.render('empresa/create');
    }

    async store(req, res) {
        try {
            const { nome, email, senha } = req.body;
            await EmpresaModel.create({ nome, email, senha });

            req.session.message = ["success", "Empresa cadastrada com sucesso!"];
            return res.redirect('/Empresa/show');
        } catch (error) {
            req.session.message = ["danger", "Erro ao cadastrar empresa."];
            return res.redirect('/Empresa/create');
        }
    }

    async edit(req, res) {
        const empresa = await EmpresaModel.findById(req.params.id);
        return res.render('Empresa/edit', { empresa });
    }

    async update(req, res) {
        try {
            await EmpresaModel.update(req.params.id, req.body);
            req.session.message = ["success", "Empresa atualizada com sucesso!"];
            return res.redirect(`/Empresa/show/${req.params.id}`);
        } catch (error) {
            req.session.message = ["danger", "Erro ao atualizar empresa."];
            return res.redirect(`/Empresa/edit/${req.params.id}`);
        }
    }

    async show(req, res) {
        const empresa = await EmpresaModel.findById(req.params.id);
        return res.render('Empresa/show', { empresa });
    }
}

module.exports = new WebEmpresaController();
const EmpresaModel = require("../models/EmpresaModel");

class ApiEmpresaController {

    /**
     * Recupera todos os usuários.
     * @param {express.Request} req O objeto de requisição do Express.
     * @param {express.Response} res O objeto de resposta do Express.
     * @returns {Promise<Object>} A resposta contendo todos os usuários.
     */
    async apiGetAll(req, res) {
        try {
            const usuarios = await EmpresaModel.findAll();
            return res.status(200).json(usuarios);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar usuários.", details: error });
        }
    }

    /**
     * Recupera um usuário pelo ID.
     * @param {express.Request} req O objeto de requisição do Express.
     * @param {express.Response} res O objeto de resposta do Express.
     * @param {Number} req.params.id Parâmetro passado pela rota do express
     * @returns {Promise<Object>} A resposta contendo o usuário solicitado.
     */
    async apiGetOne(req, res) {
        try {
            const usuario = await EmpresaModel.findOne(req.params.id);
            if (!usuario) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
            return res.status(200).json(usuario);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar o usuário.", details: error });
        }
    }

    /**
     * Cria um novo usuário.
     * @param {express.Request} req O objeto de requisição do Express.
     * @param {express.Response} res O objeto de resposta do Express.
     * @returns {Promise<Object>} A resposta contendo o usuário recém-criado.
     */
    async apiStore(req, res) {
        try {
            const { nome, email, senha } = req.body;

            if (!nome || !email || !senha) {
                return res.status(400).json({ error: "Campos nome, email e senha são obrigatórios." });
            }

            const usuarioExistente = await EmpresaModel.findOneByEmail(email);
            if (usuarioExistente) {
                return res.status(400).json({ error: "E-mail já cadastrado." });
            }

            const usuario = new EmpresaModel();
            usuario.nome = nome;
            usuario.email = email;
            usuario.senha = senha; // Lembre-se de tratar a senha adequadamente com hashing no modelo

            const result = await usuario.save();
            return res.status(201).json(result);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao criar usuário.", details: error });
        }
    }

    /**
     * Atualiza um usuário existente.
     * @param {express.Request} req O objeto de requisição do Express.
     * @param {express.Response} res O objeto de resposta do Express.
     * @param {Number} req.params.id Parâmetro passado pela rota do express
     * @returns {Promise<Object>} A resposta contendo o usuário atualizado.
     */
    async apiUpdate(req, res) {
        try {
            const usuario = await EmpresaModel.findOne(req.params.id);
            if (!usuario) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            const { nome, email, senha } = req.body;
            usuario.nome = nome || usuario.nome;
            usuario.email = email || usuario.email;
            usuario.senha = senha || usuario.senha; // Lembre-se de tratar a senha adequadamente com hashing no modelo

            const result = await usuario.update();
            return res.status(200).json(result);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao atualizar usuário.", details: error });
        }
    }

    /**
     * Exclui um usuário.
     * @param {express.Request} req O objeto de requisição do Express.
     * @param {express.Response} res O objeto de resposta do Express.
     * @param {Number} req.params.id Parâmetro passado pela rota do express
     * @returns {Promise<Object>} A resposta indicando o status da exclusão.
     */
    async apiDestroy(req, res) {
        try {
            const usuario = await EmpresaModel.findOne(req.params.id);
            if (!usuario) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            await usuario.delete();
            return res.status(200).json({ message: "Usuário removido com sucesso." });
        } catch (error) {
            return res.status(500).json({ error: "Erro ao remover usuário.", details: error });
        }
    }
}

module.exports = new ApiEmpresaController();
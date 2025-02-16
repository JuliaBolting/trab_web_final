const DataBase = require('../database/DataBase'); // Conexão com o banco de dados
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // Para a criação de token de redefinição de senha

class UsuarioModel {
    /** 
     * Os atributos da classe Model precisam ser correspondentes às colunas do banco de dados.
     */
    id = null;
    nome = null;
    email = null;
    senha = null;
    tipo = null;
    dataAtualizacao = null;
    dataCriacao = null;

    /**
     * Construtor da Classe UsuarioModel
     * @param {UsuarioModel}     usuario     O objeto de entrada é simples (precisa conter apenas chave e valor, sem métodos) e precisa conter as chaves: id, nome, email, senha, dataAtualizacao e dataCriacao. Esses campos são as colunas da tabela no banco de dados. Caso não passe um objeto com esses campos, um model vazio será criado.
     */
    constructor(usuario) {
        if (usuario &&
            "id" in usuario &&
            "nome" in usuario &&
            "email" in usuario &&
            "senha" in usuario &&
            "tipo" in usuario &&
            "dataAtualizacao" in usuario &&
            "dataCriacao" in usuario
        ) {
            this.id = usuario.id;
            this.nome = usuario.nome;
            this.email = usuario.email;
            this.senha = usuario.senha;
            this.tipo = usuario.tipo;
            this.dataAtualizacao = usuario.dataAtualizacao;
            this.dataCriacao = usuario.dataCriacao;
        }
    }

    /**
     * Busca todos os usuários.
     * @returns {Promise<Array>} Lista de todos os usuários.
     */
    static async findAll() {
        try {
            const [rows] = await DataBase.execute('SELECT id, nome, email FROM usuario');
            return rows;
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Busca um objeto UsuarioModel no banco de dados pelo e-mail.
     * @param {string} email - O e-mail do usuário a ser procurado no banco de dados.
     * @return {UsuarioModel | null} Retorna um objeto UsuarioModel com as informações encontradas, caso não encontre, retorna null.
     */
    static async findOneByEmail(email) {
        console.log("findOneByEmail");
        const result = await DataBase.executeSQLQuery(`SELECT * FROM usuario WHERE email = ? LIMIT 1`, [email]);
        console.log(result);

        if (result && result.length === 1) {
            return new UsuarioModel(result[0]);
        }
        return null;
    }

    static async findById(id) {
        console.log("findById");
        const result = await DataBase.executeSQLQuery(`SELECT * FROM usuario WHERE id = ? LIMIT 1`, [id]);
        console.log(result);

        if (result && result.length === 1) {
            return new UsuarioModel(result[0]);
        }
        return null;
    }

    // Buscar usuário pelo token de redefinição de senha
    static async findOneByToken(token) {
        try {
            return await findOne({
                where: {
                    resetToken: token,
                    resetTokenExpiration: { [Op.gte]: new Date() }
                }
            });
        } catch (error) {
            console.error("Erro ao buscar usuário pelo token:", error);
            return null;
        }
    }

    // Atualizar usuário (por exemplo, senha ou resetToken)
    static async update(dados, where) {
        console.log("update");
        try {
            return await usuario.update(dados, { where });
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            return null;
        }
    }

    /**
     * Salva um objeto UsuarioModel no banco de dados. O atributo que deve ser informado: "numero", "estado". Os atributos: "id" "dataAtualizacao" e "dataCriacao" são criados automaticamente.
     * @returns {UsuarioModel} Retorna um objeto UsuarioModel com as informações recém inseridas no banco de dados.
     */
    async save() {
        console.log("save");
        // Gera um timestamp no formato "YYYY-MM-DD HH:MM:SS" com a data e horário atual
        const timestamp = (new Date()).toISOString().slice(0, 19).replace('T', ' ');
        // Concatena a senha com o email antes de aplicar o hash
        const senhaCombinada = this.senha + this.email;
        const hashSenha = crypto.createHash('sha512').update(senhaCombinada).digest('hex'); // 128 caracteres
        const result = await DataBase.executeSQLQuery(`INSERT INTO usuario VALUES (null, ?, ?, ?, ?, ?, ?);`,
            [
                this.nome,
                this.email,
                hashSenha,
                "candidato",
                timestamp,
                timestamp
            ]
        );
        console.log("executou", result);
        // Atualiza a senha
        this.senha = hashSenha;
        const usuario = await DataBase.executeSQLQuery(`SELECT * FROM usuario WHERE usuario.id = ?`, [result.insertId]);
        return new UsuarioModel(usuario[0]);
    }

    /**
     * Atualiza um usuário existente.
     * @returns {Promise<Object>} Usuário atualizado.
     */
    async update() {
        try {
            let query = 'UPDATE usuario SET nome = ?, email = ?';
            let params = [this.nome, this.email];

            if (this.senha) {
                const hashedPassword = await bcrypt.hash(this.senha, 10);
                query += ', senha = ?';
                params.push(hashedPassword);
            }

            query += ' WHERE id = ?';
            params.push(this.id);

            await DataBase.execute(query, params);
            return { id: this.id, nome: this.nome, email: this.email };
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
     * Remove um usuário do banco de dados.
     * @returns {Promise<void>}
     */
    async delete() {
        try {
            await DataBase.execute('DELETE FROM usuario WHERE id = ?', [this.id]);
        } catch (error) {
            throw new Error(error);
        }
    }

    /**
    * Valida um usuário pelo e-mail e senha.
    * @param {string} email - O e-mail do usuário.
    * @param {string} senha - A senha do usuário.
    * @returns {UsuarioModel | null} Retorna um objeto UsuarioModel se a validação for bem-sucedida, caso contrário, retorna null.
    */
    static async validateUser(email, senha) {
        console.log("validateUser");
        const result = await DataBase.executeSQLQuery(`SELECT * FROM usuario WHERE email = ?`, [email]);

        if (result && result.length === 1) {
            const usuario = result[0];

            // Gera o hash da senha fornecida
            const senhaCombinada = senha + email;
            const hashSenha = crypto.createHash('sha512').update(senhaCombinada).digest('hex');

            // Compara o hash gerado com o armazenado no banco
            if (usuario.senha === hashSenha) {
                console.log(usuario);
                return new UsuarioModel(usuario);
            }
        }
        console.log("null");

        return null;
    }


    /**
     * Atualiza a senha do usuário usando o token de redefinição.
     * @param {String} token Token de redefinição de senha.
     * @param {String} novaSenha Nova senha do usuário.
     * @returns {Promise<void>}
     */
    static async updatePassword(usuarioId, novaSenha) {
        try {
            const senhaCriptografada = await bcrypt.hash(novaSenha, 10);
            await DataBase.executeSQLQuery(
                'UPDATE usuario SET senha = ? WHERE id = ?',
                [senhaCriptografada, usuarioId]
            );
        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
        }
    }

    // Método para verificar se o usuário é candidato ou funcionário
    getTipo() {
        return this.tipo; // onde 'tipo' é 'candidato' ou 'funcionario'
    }
}

module.exports = UsuarioModel;
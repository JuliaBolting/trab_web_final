const DataBase = require('../database/DataBase'); // Conexão com o banco de dados

class RecuperacaoSenhaModel {
    
    // Criar um novo token de recuperação de senha
    static async create(usuarioId, token, expiracao) {
        try {
            await DataBase.executeSQLQuery(
                'INSERT INTO RecuperacaoSenha (usuario_id, token, expiracao, usado) VALUES (?, ?, ?, ?)',
                [usuarioId, token, expiracao, false]
            );
        } catch (error) {
            console.error('Erro ao criar token de recuperação de senha:', error);
            throw error;
        }
    }

    // Buscar o token de recuperação de senha
    static async findByToken(token) {
        try {
            const [rows] = await DataBase.execute(
                'SELECT * FROM RecuperacaoSenha WHERE token = ? AND expiracao > NOW() AND usado = FALSE LIMIT 1',
                [token]
            );
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error('Erro ao buscar token de recuperação:', error);
            return null;
        }
    }

    // Marcar o token como usado
    static async markAsUsed(id) {
        try {
            await DataBase.executeSQLQuery(
                'UPDATE RecuperacaoSenha SET usado = TRUE WHERE id = ?',
                [id]
            );
        } catch (error) {
            console.error('Erro ao marcar token como usado:', error);
        }
    }
}

module.exports = RecuperacaoSenhaModel;
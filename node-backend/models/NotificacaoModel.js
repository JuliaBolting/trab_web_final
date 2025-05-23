const DataBase = require("../database/DataBase");

class NotificacaoModel {
    id = null;
    usuario_id = null;
    mensagem = null;
    tipo = null;
    dataCriacao = null;

    constructor(notificacao) {
        if (notificacao &&
            "id" in notificacao &&
            "usuario_id" in notificacao &&
            "mensagem" in notificacao &&
            "tipo" in notificacao &&
            "dataCriacao" in notificacao
        ) {
            this.id = notificacao.id;
            this.usuario_id = notificacao.usuario_id;
            this.mensagem = notificacao.mensagem;
            this.tipo = notificacao.tipo;
            this.dataCriacao = notificacao.dataCriacao;
        }
    }

    static async findOne(id) {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Notificacao WHERE Notificacao.id = ?`, [id]);
        if (result && result.length === 1) {
            return new NotificacaoModel(result[0]);
        }
        return null;
    }

    static async findAll() {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Notificacao`);
        if (result && result.length > 0) {
            return result.map(obj => new NotificacaoModel(obj));
        }
        return [];
    }

    static async save() {
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');  // Formata a data
        const result = await DataBase.executeSQLQuery(
            `INSERT INTO Notificacao (usuario_id, mensagem, tipo, dataCriacao) VALUES (?, ?, ?, ?)`,
            [this.usuario_id, this.mensagem, this.tipo, timestamp]
        );
        const notificacao = await DataBase.executeSQLQuery(
            `SELECT * FROM Notificacao WHERE id = ?`, 
            [result.insertId]
        );
        return new NotificacaoModel(notificacao[0]);
    }

    async delete() {
        await DataBase.executeSQLQuery(`DELETE FROM Notificacao WHERE id = ?`, [this.id]);
        return this;
    }
}

module.exports = NotificacaoModel;
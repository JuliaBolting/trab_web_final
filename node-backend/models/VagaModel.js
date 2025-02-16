const DataBase = require("../database/DataBase");

class VagaModel {
    id = null;
    empresa_id = null;
    titulo = null;
    descricao = null;
    salario = null;
    quantidade = null;
    status = null;
    dataCriacao = null;
    dataAtualizacao = null;

    constructor(vaga) {
        if (vaga &&
            "id" in vaga &&
            "empresa_id" in vaga &&
            "titulo" in vaga &&
            "descricao" in vaga &&
            "salario" in vaga &&
            "quantidade" in vaga &&
            "status" in vaga &&
            "dataCriacao" in vaga &&
            "dataAtualizacao" in vaga
        ) {
            this.id = vaga.id;
            this.empresa_id = vaga.empresa_id;
            this.titulo = vaga.titulo;
            this.descricao = vaga.descricao;
            this.salario = vaga.salario;
            this.quantidade = vaga.quantidade;
            this.status = vaga.status;
            this.dataCriacao = vaga.dataCriacao;
            this.dataAtualizacao = vaga.dataAtualizacao;
        }
    }

    static async findOne(id) {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Vaga WHERE Vaga.id = ?`, [id]);
        if (result && result.length == 1)
            return new VagaModel(result[0]);
        return null;
    }

    static async findAll() {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Vaga`);
        if (result && result.length > 0) {
            const modelArray = result.map(function (obj) {
                obj = new VagaModel(obj);
                return obj;
            });
            return modelArray;
        }
        return [];
    }

    async save() {
        const timestamp = (new Date()).toISOString().slice(0, 19).replace('T', ' ');
        const result = await DataBase.executeSQLQuery(`INSERT INTO Vaga VALUES (null, ?, ?, ?, ?, ?, ?, ?);`,
            [
                this.empresa_id,
                this.titulo,
                this.descricao,
                this.salario,
                this.quantidade,
                this.status,
                timestamp,
                timestamp
            ]
        );
        const vaga = await DataBase.executeSQLQuery(`SELECT * FROM Vaga WHERE Vaga.id = ?`, [result.insertId]);
        return new VagaModel(vaga[0]);
    }

    async update() {
        const timestamp = (new Date()).toISOString().slice(0, 19).replace('T', ' ');
        const result = await DataBase.executeSQLQuery(`UPDATE Vaga
                                                       SET titulo = ?, descricao = ?, salario = ?, quantidade = ?, status = ?, dataAtualizacao = ?
                                                       WHERE Vaga.id = ?`,
            [
                this.titulo,
                this.descricao,
                this.salario,
                this.quantidade,
                this.status,
                timestamp,
                this.id
            ]
        );
        const vaga = await DataBase.executeSQLQuery(`SELECT * FROM Vaga WHERE Vaga.id = ?`, [this.id]);
        return new VagaModel(vaga[0]);
    }

    async delete() {
        const result = await DataBase.executeSQLQuery(`DELETE FROM Vaga WHERE Vaga.id = ?`, [this.id]);
        return this;
    }
}

module.exports = VagaModel;
const DataBase = require("../database/DataBase");

class EmpresaModel {
    id = null;
    nome = null;
    email = null;
    senha = null;
    dataCriacao = null;
    dataAtualizacao = null;

    constructor(empresa) {
        if (empresa &&
            "id" in empresa &&
            "nome" in empresa &&
            "email" in empresa &&
            "senha" in empresa &&
            "dataCriacao" in empresa &&
            "dataAtualizacao" in empresa
        ) {
            this.id = empresa.id;
            this.nome = empresa.nome;
            this.email = empresa.email;
            this.senha = empresa.senha;
            this.dataCriacao = empresa.dataCriacao;
            this.dataAtualizacao = empresa.dataAtualizacao;
        }
    }

    static async findOne(id) {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Empresa WHERE Empresa.id = ?`, [id]);
        if (result && result.length == 1)
            return new EmpresaModel(result[0]);
        return null;
    }


    static async findAll() {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Empresa`);
        if (result && result.length > 0) {
            const modelArray = result.map(function (obj) {
                obj = new EmpresaModel(obj);
                return obj;
            });
            return modelArray;
        }
        return [];
    }

    async save() {
        const timestamp = (new Date()).toISOString().slice(0, 19).replace('T', ' ');
        const result = await DataBase.executeSQLQuery(`INSERT INTO Empresa VALUES (null, ?, ?, ?, ?, ?);`,
            [
                this.nome,
                this.email,
                this.senha,
                timestamp,
                timestamp
            ]
        );
        const empresa = await DataBase.executeSQLQuery(`SELECT * FROM Empresa WHERE Empresa.id = ?`, [result.insertId]);
        return new EmpresaModel(empresa[0]);
    }

    async update() {
        const timestamp = (new Date()).toISOString().slice(0, 19).replace('T', ' ');
        const result = await DataBase.executeSQLQuery(`UPDATE Empresa
                                                       SET nome = ?, email = ?, senha = ?, dataAtualizacao = ?
                                                       WHERE Empresa.id = ?`,
            [
                this.nome,
                this.email,
                this.senha,
                timestamp,
                this.id
            ]
        );
        const empresa = await DataBase.executeSQLQuery(`SELECT * FROM Empresa WHERE Empresa.id = ?`, [this.id]);
        return new EmpresaModel(empresa[0]);
    }

    async delete() {
        const result = await DataBase.executeSQLQuery(`DELETE FROM Empresa WHERE Empresa.id = ?`, [this.id]);
        return this;
    }
}

module.exports = EmpresaModel;
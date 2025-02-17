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
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Vaga WHERE id = ?`, [id]);
        if (result && result.length === 1) {
            return new VagaModel(result[0]);
        }
        return null;
    }
    
    static async findByPk(id) {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Vaga WHERE id = ?`, [id]);
        if (result && result.length === 1) {
            return new VagaModel(result[0]);
        }
        return null;
    }

    static async findAll(empresaId) {
        try {
            console.log("findAll(empresaId", empresaId);
            const vagas = await DataBase.executeSQLQuery(
                `SELECT * FROM Vaga WHERE empresa_id = ? AND status = 'aberta'`,
                [parseInt(empresaId)]
            );

            for (let vaga of vagas) {
                vaga.candidatos = await DataBase.executeSQLQuery(
                    `SELECT U.id, U.nome, U.foto, U.setor, U.localizacao, U.resumo, U.disponivel,
                            F.curso, F.instituicao, F.ano_inicio, F.ano_conclusao,
                            C.nome AS certificacao_nome, C.instituicao AS certificacao_instituicao, C.data_obtencao, C.validade, C.link_certificado
                     FROM Candidatura C
                     JOIN Usuario U ON C.candidato_id = U.id
                     LEFT JOIN Formacao F ON U.id = F.usuario_id
                     LEFT JOIN Certificacao C ON U.id = C.usuario_id
                     WHERE C.vaga_id = ?`,
                    [vaga.id]
                );
            }
            

            return vagas;
        } catch (error) {
            console.error("Erro ao buscar vagas:", error);
            throw error;
        }
    }
    

    static async findOneByOne(usuarioId) {
        const result = await DataBase.executeSQLQuery(`SELECT * FROM Empresa_Usuario WHERE usuario_id = ?`, [usuarioId]);
        
        if (result && result.length === 1) {
            const empresaId = result[0].empresa_id; // Pega o id da empresa associada ao usuário
            
            // Agora, busque as informações completas da empresa usando o empresa_id
            const empresaResult = await DataBase.executeSQLQuery(`SELECT * FROM Empresa WHERE id = ?`, [empresaId]);
            
            if (empresaResult && empresaResult.length === 1) {
                console.log(empresaResult[0].id);
                return empresaResult[0].id;
            }
        }
        
        return null;
    }

    async save() {
        console.log("EmpresaModel save", this.empresa_id);
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');  // Formata a data
        const result = await DataBase.executeSQLQuery(
            `INSERT INTO Vaga (empresa_id, titulo, descricao, salario, quantidade, status, dataCriacao, dataAtualizacao) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [this.empresa_id, this.titulo, this.descricao, this.salario, this.quantidade, this.status, timestamp, timestamp]
        );
        const vaga = await DataBase.executeSQLQuery(
            `SELECT * FROM Vaga WHERE id = ?`, 
            [result.insertId]
        );
        return new VagaModel(vaga[0]);
    }

    async update() {
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');  // Formata a data
        const result = await DataBase.executeSQLQuery(
            `UPDATE Vaga SET titulo = ?, descricao = ?, salario = ?, quantidade = ?, status = ?, dataAtualizacao = ? WHERE id = ?`,
            [this.titulo, this.descricao, this.salario, this.quantidade, this.status, timestamp, this.id]
        );
        const vaga = await DataBase.executeSQLQuery(
            `SELECT * FROM Vaga WHERE id = ?`, 
            [this.id]
        );
        return new VagaModel(vaga[0]);
    }

    async delete() {
        await DataBase.executeSQLQuery(`DELETE FROM Vaga WHERE id = ?`, [this.id]);
        return this;
    }

    static async store(candidatoId, vagaId) {
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');  // Formata a data

        const result = await DataBase.executeSQLQuery(
            `INSERT INTO Candidatura (candidato_id, vaga_id, status, dataCriacao, dataAtualizacao) 
            VALUES (?, ?, 'pendente', ?, ?)`,
            [candidatoId, vagaId, timestamp, timestamp]
        );

        return result;
    }
}

module.exports = VagaModel;
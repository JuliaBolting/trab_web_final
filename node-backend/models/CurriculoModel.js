const DataBase = require('../database/DataBase'); // Conexão com o banco de dados

class CurriculoModel {

    constructor(candidato) {
        this.id = candidato.id;
        this.nome = candidato.nome;
        this.foto = candidato.foto;
        this.localizacao = candidato.localizacao;
        this.setor = candidato.setor;
        this.resumo = candidato.resumo;
        this.disponivel = candidato.disponivel;
        this.area_id = candidato.area_id; // Agora podemos garantir que a área será validada ou criada
        this.area = candidato.area; // Agora podemos garantir que a área será validada ou criada
        this.formacoes = candidato.formacoes || []; // Array de formações
        this.certificacoes = candidato.certificacoes || []; // Array de certificações
        this.dataCriacao = candidato.dataCriacao;
        this.dataAtualizacao = candidato.dataAtualizacao;
    }

    async save() {

        const candidatoExistente = await DataBase.executeSQLQuery(
            `SELECT * FROM Candidato WHERE id = ?`,
            [this.id]
        );


        // Primeiro, garantir que a área existe ou criar uma nova área
        console.log(this.area);
        if (this.area) {
            const areaExistente = await DataBase.executeSQLQuery(
                `SELECT id FROM Area WHERE nome = ?`, [this.area]
            );

            // Se a área não existir, crie uma nova
            if (areaExistente.length === 0) {
                const result = await DataBase.executeSQLQuery(
                    `INSERT INTO Area (nome) VALUES (?)`, [this.area]
                );
                this.area_id = result.insertId; // Use o id gerado para a nova área
            } else {
                this.area_id = areaExistente[0].id; // Caso a área já exista, usamos o id dela
            }
            console.log(this.area, this.area_id);
        }

        if (candidatoExistente.length > 0) {

            await DataBase.executeSQLQuery(
                `UPDATE Candidato 
                 SET nome = ?, foto = ?, localizacao = ?, setor = ?, resumo = ?, 
                     disponivel = ?, dataAtualizacao = NOW() 
                 WHERE id = ?`,
                [
                    this.nome, this.foto, this.localizacao, this.setor, this.resumo,
                    this.disponivel, this.id
                ]
            );

            // Atualizar Formações Acadêmicas
            await DataBase.executeSQLQuery(`DELETE FROM formacaoacademica WHERE candidato_id = ?`, [this.id]);
            for (let formacao of this.formacoes) {
                await DataBase.executeSQLQuery(
                    `INSERT INTO formacaoacademica (candidato_id, instituicao, grau, curso, ano_inicio, ano_conclusao) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [this.id, formacao.instituicao, formacao.grau, formacao.curso, formacao.ano_inicio, formacao.ano_conclusao]
                );
            }

            // Atualizar Certificações
            await DataBase.executeSQLQuery(`DELETE FROM Certificacao WHERE candidato_id = ?`, [this.id]);
            for (let certificacao of this.certificacoes) {
                await DataBase.executeSQLQuery(
                    `INSERT INTO Certificacao (candidato_id, nome, instituicao, data_obtencao, validade, link_certificado) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [this.id, certificacao.nome, certificacao.instituicao, certificacao.data_obtencao, certificacao.validade, certificacao.link_certificado]
                );
            }
        } else {
            await DataBase.executeSQLQuery(
                `INSERT INTO Candidato (id, nome, foto, localizacao, setor, resumo, disponivel) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    this.id, this.nome, this.foto, this.localizacao, this.setor, this.resumo,
                    this.disponivel
                ]
            );

            // Inserir Formações Acadêmicas
            for (let formacao of this.formacoes) {
                await DataBase.executeSQLQuery(
                    `INSERT INTO formacaoacademica (candidato_id, instituicao, grau, curso, ano_inicio, ano_conclusao) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [this.id, formacao.instituicao, formacao.grau, formacao.curso, formacao.ano_inicio, formacao.ano_conclusao]
                );
            }

            // Inserir Certificações
            for (let certificacao of this.certificacoes) {
                await DataBase.executeSQLQuery(
                    `INSERT INTO Certificacao (candidato_id, nome, instituicao, data_obtencao, validade, link_certificado) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [this.id, certificacao.nome, certificacao.instituicao, certificacao.data_obtencao, certificacao.validade, certificacao.link_certificado]
                );
            }
        }
    }

    static async atualizarDisponibilidade(id, disponivel) {
        return await DataBase.executeSQLQuery(
            `UPDATE Candidato SET disponivel = ? WHERE id = ?`, 
            [disponivel, id]
        );
    }

    static async findCandidatoId (candidatoId) {
        try {
            const query = 'SELECT * FROM candidato WHERE id = ?';
            const [rows] = await DataBase.executeSQLQuery(query, [candidatoId]);
            return rows;
        } catch (error) {
            console.error('Erro ao buscar formações:', error);
            throw error;
        }
    }

    static async findFormacaoCandidatoId (candidatoId) {
        try {
            const query = 'SELECT * FROM formacaoacademica WHERE candidato_id = ?;';
            const rows = await DataBase.executeSQLQuery(query, [candidatoId]);
            if (rows && rows.length > 0)
                return rows;
            return [];
        } catch (error) {
            console.error('Erro ao buscar formações:', error);
            throw error;
        }
    }

    static async findCerificacaoCandidatoId (candidatoId) {
        try {
            const query = 'SELECT * FROM certificacao WHERE candidato_id = ?;';
            const rows = await DataBase.executeSQLQuery(query, [candidatoId]);
            if (rows && rows.length > 0)
                return rows;
            return [];
        } catch (error) {
            console.error('Erro ao buscar formações:', error);
            throw error;
        }
    }
}

module.exports = CurriculoModel;
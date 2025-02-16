const Vaga = require('../models/VagaModel');

exports.criar = async (req, res) => {
    try {
        const vaga = await Vaga.create(req.body);
        res.status(201).json(vaga);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar vaga' });
    }
};

exports.listar = async (req, res) => {
    try {
        const vagas = await Vaga.find();
        res.json(vagas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar vagas' });
    }
};
const Curriculo = require('../models/CurriculoModel');

exports.criar = async (req, res) => {
    try {
        const curriculo = await Curriculo.create(req.body);
        res.status(201).json(curriculo);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar currículo' });
    }
};

exports.listar = async (req, res) => {
    try {
        const curriculos = await Curriculo.find();
        res.json(curriculos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar currículos' });
    }
};
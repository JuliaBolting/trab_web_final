const Notificacao = require('../models/NotificacaoModel');

exports.enviar = async (req, res) => {
    try {
        const notificacao = await Notificacao.create(req.body);
        res.status(201).json(notificacao);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao enviar notificação' });
    }
};

exports.listar = async (req, res) => {
    try {
        const notificacoes = await Notificacao.find();
        res.json(notificacoes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar notificações' });
    }
};
const express = require('express');
const Genero = require('../models/Genero');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Listar todos os gêneros
router.get('/', async (req, res) => {
  try {
    const generos = await Genero.buscarTodos();
    res.json(generos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar gêneros' });
  }
});

// Criar gênero (apenas autenticados)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ error: 'Nome do gênero é obrigatório' });
    }

    await Genero.criar(nome);
    res.status(201).json({ message: 'Gênero criado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar gênero' });
  }
});

module.exports = router;

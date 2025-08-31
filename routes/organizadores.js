const express = require('express');
const Organizador = require('../models/Organizador');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Listar todos os organizadores
router.get('/', async (req, res) => {
  try {
    const organizadores = await Organizador.buscarTodos();
    res.json(organizadores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar organizadores' });
  }
});

// Buscar organizador por ID
router.get('/:id', async (req, res) => {
  try {
    const organizador = await Organizador.buscarPorId(req.params.id);
    if (!organizador) {
      return res.status(404).json({ error: 'Organizador não encontrado' });
    }
    res.json(organizador);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar organizador' });
  }
});

// Atualizar perfil do organizador (apenas próprio)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { nome, descricao } = req.body;
    await Organizador.atualizar(req.params.id, { nome, descricao });
    
    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

module.exports = router;

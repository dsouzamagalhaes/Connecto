const express = require('express');
const Evento = require('../models/Evento');
const { authenticateToken, isOrganizador } = require('../middleware/auth');

const router = express.Router();

// Listar todos os eventos
router.get('/', async (req, res) => {
  try {
    const eventos = await Evento.buscarTodos();
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
});

// Buscar evento por ID
router.get('/:id', async (req, res) => {
  try {
    const evento = await Evento.buscarPorId(req.params.id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar evento' });
  }
});

// Criar evento (apenas organizadores)
router.post('/', authenticateToken, isOrganizador, async (req, res) => {
  try {
    const { descricao, lugar, data } = req.body;
    const eventoId = await Evento.criar(req.user.id, descricao, lugar, data);
    
    res.status(201).json({ 
      message: 'Evento criado com sucesso', 
      id: eventoId 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
});

// Atualizar evento (apenas organizador dono)
router.put('/:id', authenticateToken, isOrganizador, async (req, res) => {
  try {
    const evento = await Evento.buscarPorId(req.params.id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    if (evento.organizador_id !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { descricao, lugar, data } = req.body;
    await Evento.atualizar(req.params.id, { descricao, lugar, data });
    
    res.json({ message: 'Evento atualizado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
});

// Adicionar artista ao evento (apenas organizador dono)
router.post('/:id/artistas/:artistaId', authenticateToken, isOrganizador, async (req, res) => {
  try {
    const evento = await Evento.buscarPorId(req.params.id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    if (evento.organizador_id !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await Evento.adicionarArtista(req.params.id, req.params.artistaId);
    res.json({ message: 'Artista adicionado ao evento' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar artista' });
  }
});

// Remover artista do evento (apenas organizador dono)
router.delete('/:id/artistas/:artistaId', authenticateToken, isOrganizador, async (req, res) => {
  try {
    const evento = await Evento.buscarPorId(req.params.id);
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    if (evento.organizador_id !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    await Evento.removerArtista(req.params.id, req.params.artistaId);
    res.json({ message: 'Artista removido do evento' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover artista' });
  }
});

// Listar artistas do evento
router.get('/:id/artistas', async (req, res) => {
  try {
    const artistas = await Evento.buscarArtistas(req.params.id);
    res.json(artistas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar artistas do evento' });
  }
});

module.exports = router;

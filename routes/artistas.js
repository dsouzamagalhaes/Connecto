const express = require('express');
const ArtistaController = require('../controllers/artistaController');
const { authenticateToken } = require('../middleware/auth');
const { artistaUpdateValidation } = require('../middleware/validation');

const router = express.Router();

// Listar todos os artistas
router.get('/', ArtistaController.listarTodos);

// Buscar artista por ID
router.get('/:id', ArtistaController.buscarPorId);

// Atualizar perfil do artista (apenas próprio)
router.put('/:id', authenticateToken, artistaUpdateValidation, ArtistaController.atualizar);

// Buscar artistas por gênero
router.get('/genero/:genero', ArtistaController.buscarPorGenero);

module.exports = router;

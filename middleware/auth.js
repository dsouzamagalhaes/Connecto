const { verifyToken } = require('../utils/jwt');
const Artista = require('../models/Artista');
const Organizador = require('../models/Organizador');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso necessário' });
  }

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
}

async function isArtista(req, res, next) {
  try {
    const artista = await Artista.existe(req.user.id);
    if (!artista) {
      return res.status(403).json({ error: 'Acesso permitido apenas para artistas' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar perfil' });
  }
}

async function isOrganizador(req, res, next) {
  try {
    const organizador = await Organizador.existe(req.user.id);
    if (!organizador) {
      return res.status(403).json({ error: 'Acesso permitido apenas para organizadores' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao verificar perfil' });
  }
}

module.exports = { authenticateToken, isArtista, isOrganizador };

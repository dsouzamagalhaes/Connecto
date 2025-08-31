const db = require('../config/database');
const bcrypt = require('bcrypt');

// Inicializar o banco de dados
async function initializeDatabase() {
  try {
    await db.connect();
    
    // Criar tabelas
    await db.run(`CREATE TABLE IF NOT EXISTS conta (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      senha_hash BLOB NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS artista (
      conta_id INTEGER PRIMARY KEY REFERENCES conta(id) ON DELETE CASCADE,
      nome TEXT NOT NULL,
      descricao TEXT DEFAULT "" NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS genero (
      nome TEXT PRIMARY KEY NOT NULL
    ) WITHOUT ROWID`);

    await db.run(`CREATE TABLE IF NOT EXISTS artista_genero (
      artista_id INTEGER NOT NULL REFERENCES artista(conta_id) ON DELETE CASCADE,
      genero_id TEXT NOT NULL REFERENCES genero(nome) ON DELETE CASCADE,
      PRIMARY KEY (artista_id, genero_id)
    ) WITHOUT ROWID`);

    await db.run(`CREATE TABLE IF NOT EXISTS organizador (
      conta_id INTEGER PRIMARY KEY REFERENCES conta(id) ON DELETE CASCADE,
      nome TEXT NOT NULL,
      descricao TEXT DEFAULT "" NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS evento (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organizador_id INTEGER NOT NULL REFERENCES organizador(conta_id) ON DELETE CASCADE,
      descricao TEXT NOT NULL,
      lugar TEXT NOT NULL,
      data TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    await db.run(`CREATE TABLE IF NOT EXISTS evento_artista (
      evento_id INTEGER NOT NULL REFERENCES evento(id) ON DELETE CASCADE,
      artista_id INTEGER NOT NULL REFERENCES artista(conta_id) ON DELETE CASCADE,
      PRIMARY KEY (evento_id, artista_id)
    ) WITHOUT ROWID`);

    // Inserir gêneros iniciais
    const generos = ['Rock', 'Funk', 'Trap', 'Pagode', 'Sertanejo'];
    for (const genero of generos) {
      await db.run('INSERT OR IGNORE INTO genero (nome) VALUES (?)', [genero]);
    }

    console.log('Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

module.exports = {
  db,
  initializeDatabase
};

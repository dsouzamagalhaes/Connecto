const { db } = require('./index');

class Genero {
  static async buscarTodos() {
    return await db.all('SELECT nome FROM genero ORDER BY nome');
  }

  static async criar(nome) {
    await db.run('INSERT INTO genero (nome) VALUES (?)', [nome]);
    return nome;
  }

  static async existe(nome) {
    const genero = await db.get('SELECT 1 FROM genero WHERE nome = ?', [nome]);
    return !!genero;
  }

  static async deletar(nome) {
    await db.run('DELETE FROM genero WHERE nome = ?', [nome]);
  }
}

module.exports = Genero;

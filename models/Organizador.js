const { db } = require('./index');

class Organizador {
  static async criar(contaId, nome, descricao = '') {
    await db.run(
      'INSERT INTO organizador (conta_id, nome, descricao) VALUES (?, ?, ?)',
      [contaId, nome, descricao]
    );
    return contaId;
  }

  static async buscarTodos() {
    return await db.all('SELECT * FROM organizador');
  }

  static async buscarPorId(id) {
    return await db.get('SELECT * FROM organizador WHERE conta_id = ?', [id]);
  }

  static async atualizar(id, dados) {
    const { nome, descricao } = dados;
    const updates = [];
    const params = [];

    if (nome) {
      updates.push('nome = ?');
      params.push(nome);
    }
    if (descricao !== undefined) {
      updates.push('descricao = ?');
      params.push(descricao);
    }

    if (updates.length > 0) {
      params.push(id);
      await db.run(
        `UPDATE organizador SET ${updates.join(', ')} WHERE conta_id = ?`,
        params
      );
    }
  }

  static async existe(id) {
    const organizador = await db.get('SELECT 1 FROM organizador WHERE conta_id = ?', [id]);
    return !!organizador;
  }
}

module.exports = Organizador;

const { db } = require('./index');

class Evento {
  static async criar(organizadorId, descricao, lugar, data) {
    const result = await db.run(
      'INSERT INTO evento (organizador_id, descricao, lugar, data) VALUES (?, ?, ?, ?)',
      [organizadorId, descricao, lugar, data]
    );
    return result.id;
  }

  static async buscarTodos() {
    const query = `
      SELECT e.*, o.nome as organizador_nome
      FROM evento e
      JOIN organizador o ON e.organizador_id = o.conta_id
    `;
    return await db.all(query);
  }

  static async buscarPorId(id) {
    const query = `
      SELECT e.*, o.nome as organizador_nome
      FROM evento e
      JOIN organizador o ON e.organizador_id = o.conta_id
      WHERE e.id = ?
    `;
    return await db.get(query, [id]);
  }

  static async buscarPorOrganizador(organizadorId) {
    const query = `
      SELECT e.*, o.nome as organizador_nome
      FROM evento e
      JOIN organizador o ON e.organizador_id = o.conta_id
      WHERE e.organizador_id = ?
    `;
    return await db.all(query, [organizadorId]);
  }

  static async atualizar(id, dados) {
    const { descricao, lugar, data } = dados;
    const updates = [];
    const params = [];

    if (descricao) {
      updates.push('descricao = ?');
      params.push(descricao);
    }
    if (lugar) {
      updates.push('lugar = ?');
      params.push(lugar);
    }
    if (data) {
      updates.push('data = ?');
      params.push(data);
    }

    if (updates.length > 0) {
      params.push(id);
      await db.run(
        `UPDATE evento SET ${updates.join(', ')} WHERE id = ?`,
        params
      );
    }
  }

  static async adicionarArtista(eventoId, artistaId) {
    await db.run(
      'INSERT INTO evento_artista (evento_id, artista_id) VALUES (?, ?)',
      [eventoId, artistaId]
    );
  }

  static async removerArtista(eventoId, artistaId) {
    await db.run(
      'DELETE FROM evento_artista WHERE evento_id = ? AND artista_id = ?',
      [eventoId, artistaId]
    );
  }

  static async buscarArtistas(eventoId) {
    const query = `
      SELECT a.conta_id as id, a.nome, a.descricao
      FROM artista a
      JOIN evento_artista ea ON a.conta_id = ea.artista_id
      WHERE ea.evento_id = ?
    `;
    return await db.all(query, [eventoId]);
  }

  static async deletar(id) {
    await db.run('DELETE FROM evento WHERE id = ?', [id]);
  }
}

module.exports = Evento;

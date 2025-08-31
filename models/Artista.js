const { db } = require('./index');

class Artista {
  static async criar(contaId, nome, descricao = '') {
    await db.run(
      'INSERT INTO artista (conta_id, nome, descricao) VALUES (?, ?, ?)',
      [contaId, nome, descricao]
    );
    return contaId;
  }

  static async buscarTodos() {
    const query = `
      SELECT a.conta_id as id, a.nome, a.descricao, 
             GROUP_CONCAT(ag.genero_id) as generos
      FROM artista a
      LEFT JOIN artista_genero ag ON a.conta_id = ag.artista_id
      GROUP BY a.conta_id
    `;
    const artistas = await db.all(query);
    return artistas.map(artista => ({
      ...artista,
      generos: artista.generos ? artista.generos.split(',') : []
    }));
  }

  static async buscarPorId(id) {
    const query = `
      SELECT a.conta_id as id, a.nome, a.descricao, 
             GROUP_CONCAT(ag.genero_id) as generos
      FROM artista a
      LEFT JOIN artista_genero ag ON a.conta_id = ag.artista_id
      WHERE a.conta_id = ?
      GROUP BY a.conta_id
    `;
    const artista = await db.get(query, [id]);
    if (artista) {
      artista.generos = artista.generos ? artista.generos.split(',') : [];
    }
    return artista;
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
        `UPDATE artista SET ${updates.join(', ')} WHERE conta_id = ?`,
        params
      );
    }
  }

  static async adicionarGeneros(artistaId, generos) {
    // Remover gêneros existentes
    await db.run('DELETE FROM artista_genero WHERE artista_id = ?', [artistaId]);
    
    // Adicionar novos gêneros
    for (const genero of generos) {
      await db.run(
        'INSERT INTO artista_genero (artista_id, genero_id) VALUES (?, ?)',
        [artistaId, genero]
      );
    }
  }

  static async buscarPorGenero(genero) {
    const query = `
      SELECT a.conta_id as id, a.nome, a.descricao
      FROM artista a
      JOIN artista_genero ag ON a.conta_id = ag.artista_id
      WHERE ag.genero_id = ?
    `;
    return await db.all(query, [genero]);
  }

  static async existe(id) {
    const artista = await db.get('SELECT 1 FROM artista WHERE conta_id = ?', [id]);
    return !!artista;
  }
}

module.exports = Artista;

const { db } = require('./index');
const bcrypt = require('bcrypt');

class Conta {
  static async criar(email, senha) {
    const senhaHash = await bcrypt.hash(senha, 10);
    const result = await db.run(
      'INSERT INTO conta (email, senha_hash) VALUES (?, ?)',
      [email, senhaHash]
    );
    return result.id;
  }

  static async buscarPorEmail(email) {
    return await db.get('SELECT * FROM conta WHERE email = ?', [email]);
  }

  static async buscarPorId(id) {
    return await db.get('SELECT id, email, created_at FROM conta WHERE id = ?', [id]);
  }

  static async verificarSenha(senha, senhaHash) {
    return await bcrypt.compare(senha, senhaHash);
  }

  static async deletar(id) {
    await db.run('DELETE FROM conta WHERE id = ?', [id]);
  }
}

module.exports = Conta;

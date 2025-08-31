const Conta = require('../models/Conta');
const Artista = require('../models/Artista');
const Organizador = require('../models/Organizador');
const { generateToken } = require('../utils/jwt');

class AuthController {
  static async register(req, res) {
    try {
      const { email, senha, tipo, nome, descricao = '' } = req.body;

      // Verificar se email já existe
      const contaExistente = await Conta.buscarPorEmail(email);
      if (contaExistente) {
        return res.status(400).json({ error: 'Email já existe' });
      }

      // Criar conta
      const contaId = await Conta.criar(email, senha);

      // Criar perfil específico
      if (tipo === 'artista') {
        await Artista.criar(contaId, nome, descricao);
      } else if (tipo === 'organizador') {
        await Organizador.criar(contaId, nome, descricao);
      } else {
        await Conta.deletar(contaId);
        return res.status(400).json({ error: 'Tipo de usuário inválido' });
      }

      const token = generateToken({ id: contaId, email, tipo });
      res.status(201).json({
        token,
        user: { id: contaId, email, tipo, nome }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      // Buscar conta
      const conta = await Conta.buscarPorEmail(email);
      if (!conta) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verificar senha
      const senhaValida = await Conta.verificarSenha(senha, conta.senha_hash);
      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Buscar tipo de usuário
      let usuario = await Artista.buscarPorId(conta.id);
      let tipo = 'artista';

      if (!usuario) {
        usuario = await Organizador.buscarPorId(conta.id);
        tipo = 'organizador';
      }

      if (!usuario) {
        return res.status(500).json({ error: 'Perfil de usuário não encontrado' });
      }

      const token = generateToken({ id: conta.id, email: conta.email, tipo });
      res.json({
        token,
        user: { id: conta.id, email: conta.email, tipo, nome: usuario.nome }
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = AuthController;

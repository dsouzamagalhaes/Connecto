const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./models');
const authRoutes = require('./routes/auth');
const artistaRoutes = require('./routes/artistas');
const organizadorRoutes = require('./routes/organizadores');
const eventoRoutes = require('./routes/eventos');
const generoRoutes = require('./routes/generos');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/artistas', artistaRoutes);
app.use('/api/organizadores', organizadorRoutes);
app.use('/api/eventos', eventoRoutes);
app.use('/api/generos', generoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API funcionando' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado' });
});

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();

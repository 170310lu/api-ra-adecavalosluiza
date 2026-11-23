const express = require('express');
const cors = require('cors');
const racasRoutes = require('./routes/racas.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/error-handler');

require('dotenv').config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));
app.use('/api/auth', authRoutes);
app.use('/api/racas', racasRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'ROTA_NAO_ENCONTRADA',
      message: 'A rota solicitada não foi encontrada.'
    }
  });
});

app.use(errorHandler);

module.exports = app;
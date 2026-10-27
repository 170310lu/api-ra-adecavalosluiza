const express = require('express');
const racasRoutes = require('./routes/racas.routes');
const errorHandler = require('./middleware/error-handler');

const app = express();

app.use(express.json());
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
import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import clienteRoutes from './routes/clienteRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/clientes', clienteRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Cliente Service está rodando!' });
});

sequelize.sync()
  .then(() => {
    console.log('✅ Banco de dados sincronizado');
    app.listen(PORT, () => {
      console.log(`Cliente Service rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco:', err);
  });

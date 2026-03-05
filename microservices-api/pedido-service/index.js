import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import pedidoRoutes from './routes/pedidoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// Rotas
app.use('/pedidos', pedidoRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Pedido Service está rodando!' });
});

// Sincronizar banco e iniciar servidor
sequelize.sync()
  .then(() => {
    console.log('✅ Banco de dados sincronizado');
    app.listen(PORT, () => {
      console.log(`🚀 Pedido Service rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao banco:', err);
  });

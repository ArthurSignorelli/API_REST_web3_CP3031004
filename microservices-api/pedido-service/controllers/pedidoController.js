import Pedido from '../models/Pedido.js';

// Validar se o cliente existe no serviço de clientes
const validarCliente = async (clienteId) => {
  try {
    const url = `${process.env.CLIENTE_SERVICE_URL}/${clienteId}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao validar cliente:', error);
    throw new Error('Erro ao comunicar com o serviço de clientes');
  }
};

// Criar novo pedido
export const createPedido = async (req, res) => {
  try {
    const { descricao, valor, clienteId } = req.body;
    
    if (!descricao || !valor || !clienteId) {
      return res.status(400).json({ 
        error: 'Descrição, valor e clienteId são obrigatórios' 
      });
    }

    // Validar se o cliente existe
    const clienteExiste = await validarCliente(clienteId);
    
    if (!clienteExiste) {
      return res.status(404).json({ 
        error: 'Cliente não encontrado' 
      });
    }

    const pedido = await Pedido.create({ descricao, valor, clienteId });
    res.status(201).json(pedido);
  } catch (error) {
    if (error.message === 'Erro ao comunicar com o serviço de clientes') {
      res.status(503).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erro ao criar pedido' });
    }
  }
};

// Listar todos os pedidos
export const getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
};

// Buscar pedido por ID
export const getPedidoById = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedido' });
  }
};

// Atualizar pedido
export const updatePedido = async (req, res) => {
  try {
    const { descricao, valor, clienteId } = req.body;
    const pedido = await Pedido.findByPk(req.params.id);
    
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    
    // Se o clienteId está sendo alterado, validar o novo cliente
    if (clienteId && clienteId !== pedido.clienteId) {
      const clienteExiste = await validarCliente(clienteId);
      
      if (!clienteExiste) {
        return res.status(404).json({ 
          error: 'Cliente não encontrado' 
        });
      }
    }
    
    await pedido.update({ descricao, valor, clienteId });
    res.json(pedido);
  } catch (error) {
    if (error.message === 'Erro ao comunicar com o serviço de clientes') {
      res.status(503).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Erro ao atualizar pedido' });
    }
  }
};

// Deletar pedido
export const deletePedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }
    
    await pedido.destroy();
    res.json({ message: 'Pedido deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar pedido' });
  }
};

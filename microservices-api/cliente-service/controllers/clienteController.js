import Cliente from '../models/Cliente.js';

export const createCliente = async (req, res) => {
  try {
    const { nome, email } = req.body;
    
    if (!nome || !email) {
      return res.status(400).json({ 
        error: 'Nome e email são obrigatórios' 
      });
    }

    const cliente = await Cliente.create({ nome, email });
    res.status(201).json(cliente);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Email já cadastrado' });
    } else {
      res.status(500).json({ error: 'Erro ao criar cliente' });
    }
  }
};

export const getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
};

export const getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
};

export const updateCliente = async (req, res) => {
  try {
    const { nome, email } = req.body;
    const cliente = await Cliente.findByPk(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    await cliente.update({ nome, email });
    res.json(cliente);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Email já cadastrado' });
    } else {
      res.status(500).json({ error: 'Erro ao atualizar cliente' });
    }
  }
};

export const deleteCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByPk(req.params.id);
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    await cliente.destroy();
    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar cliente' });
  }
};

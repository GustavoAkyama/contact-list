import Contacts from "../models/ContactModel.js";

// Retorna (ID, Nome e Telefone) de todos os contatos do usuário logado
export const getContacts = async (req, res) => {

  try {
    const contacts = await Contacts.findAll({
      attributes: ["id", "name", "phone"],
    });

    res.json(contacts);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }

};

// Cria um contato para o usuário logado
export const createContact = async (req, res) => {

  const { name, phone } = req.body;

  try {
    const contact = await Contacts.create({
      name,
      phone,
    });

    res.status(201).json(contact);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }

};

// Atualiza um contato do usuário logado
export const updateContact = async (req, res) => {

  try {
    const { id, name, phone } = req.body;
    const contact = await Contacts.findOne({
      where: { id },
    });

    if (!contact) return res.status(404).json({ msg: "Contato não encontrado" });

    await contact.update({ name, phone });

    res.status(200).json(contact);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }

};


// Deleta um contato do usuário logado
export const deleteContact = async (req, res) => {

  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'ID do contato não fornecido' });
    }

    const contact = await Contacts.findOne({
      where: { id },
    });

    if (!contact) {
      return res.status(404).json({ msg: 'Contato não encontrado' });
    }

    await contact.destroy();

    res.status(200).json({ msg: 'Contato deletado com sucesso' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }

};

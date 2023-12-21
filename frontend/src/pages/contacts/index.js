import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Card, CardContent, TextField, Button, Grid, Typography, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import BlankLayout from 'src/@core/layouts/BlankLayout';

const AddContactPage = () => {

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [contacts, setContacts] = useState([]);
  const [editingContactId, setEditingContactId] = useState(null);

  // adicionar novo contato
  const handleAddContact = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/contacts', { name, phone });
      setContacts([...contacts, res.data]);
      setName('');
      setPhone('');

    } catch (error) {
      console.error(error);
    }

  };

  // atualizar a lista de contato
  const handleUpdateContact = async (e) => {
    e.preventDefault();
  
    try {
      const updatedContact = { id: editingContactId, name, phone };
      await axios.put(`http://localhost:5000/contacts/${editingContactId}`, updatedContact);
  
      const updatedContacts = contacts.map((contact) =>
        contact.id === editingContactId ? { ...contact, name, phone } : contact
      );
  
      setContacts(updatedContacts);
      setEditingContactId(null);
      setName('');
      setPhone('');

    } catch (error) {
      console.error(error);
    }
  };

  // preenche os inputs com os valores do contato que irá ser atualizado
  const handleEditContact = (id) => {

    const contactToEdit = contacts.find((contact) => contact.id === id);

    if (contactToEdit) {
      setEditingContactId(id);
      setName(contactToEdit.name);
      setPhone(contactToEdit.phone);
    }

  };

  // busca a lsita de contatos
  const fetchContacts = async () => {

    try {
      const res = await axios.get('http://localhost:5000/contacts');
      setContacts(res.data);

    } catch (error) {
      console.error(error);
    }

  };

  useEffect(() => {
    fetchContacts();
  }, []);


  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      minHeight="100vh"
      paddingY={4}
    >
      <Card>
        <CardContent sx={{ padding: (theme) => `${theme.spacing(2, 2, 3)} !important` }}>
          <Typography
            variant="h6"
            sx={{
              ml: 3,
              lineHeight: 1,
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: '1.5rem !important',
              marginTop: 4,
              marginBottom: 4,
            }}
          >
            ADICIONAR CONTATO
          </Typography>
          <form onSubmit={editingContactId ? handleUpdateContact : handleAddContact}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} sx={{ marginBottom: 2, marginLeft: 2 }}>
                <TextField
                  label="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                  required
                  sx={{ width: '70%' }}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'flex-end', marginBottom: 2, marginLeft: '-70px' }}>
                <TextField
                  label="Telefone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                  required
                  sx={{ width: '300%' }}
                />
                <Button type="submit" variant="contained" sx={{ marginLeft: 3.5, width: '100%', height: '100%', marginRight: -14 }}>
                  {editingContactId ? 'Atualizar' : 'Adicionar'}
                </Button>
              </Grid>
            </Grid>
          </form>
          <Typography
            variant="h6"
            sx={{
              ml: 3,
              lineHeight: 1,
              fontWeight: 600,
              textTransform: 'uppercase',
              fontSize: '1.5rem !important',
              marginTop: 8,
              marginBottom: 4,
            }}
          >
            Lista de Contatos
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Editar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>{contact.id}</TableCell>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color="primary" onClick={() => handleEditContact(contact.id)}>
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

AddContactPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default AddContactPage;

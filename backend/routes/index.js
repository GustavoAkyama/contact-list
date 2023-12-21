import { getUsers, Register, Login, Logout } from "../controllers/Users.js";
import { getContacts, createContact, updateContact, deleteContact } from "../controllers/Contacts.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import express from "express";

const router = express.Router();

// Rotas Users
router.get('/users', verifyToken, getUsers);
router.post('/users', Register);
router.post('/login', Login);
router.delete('/logout', Logout);

// Rotas Contacts
router.get('/contacts', getContacts);
router.post("/contacts", createContact);
router.put("/contacts/:id", updateContact);
router.delete("/contacts/:id", deleteContact);

router.get('/token', refreshToken);


export default router;

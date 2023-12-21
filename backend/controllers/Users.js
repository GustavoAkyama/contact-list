import jwt from "jsonwebtoken";
import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";

// Retorna (ID, Nome) de todos os usuários
export const getUsers = async(req, res) => {

    try {
        const users = await Users.findAll({
            attributes: ['id', 'name']
        });

        res.json(users);

    } catch(error) {
        console.log(error);
    }

};

// Registro de usuário (Nome, Senha)
export const Register = async(req, res) => {

    const { name, password, passwordCheck } = req.body;

    const existingUser = await Users.findOne({ where: { name } });

    if (existingUser) {
        return res.status(400).json({ msg: 'Nome de usuário já existente.' });
    }

    if (!name || name.trim() === '') {
        return res.status(400).json({ msg: 'O campo nome de usuário é obrigatório.' });
    }

    if (password !== passwordCheck) {
        return res.status(400).json({ msg: 'Suas senhas não coincidem. Tente Novamente.' });
    }

    if (!password || password.trim() === '') {
      return res.status(400).json({ msg: 'O campo senha é obrigatório.' });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        await Users.create({
            name: name,
            password: hashPassword
        });

        res.json({msg: "Usuário registrado com sucesso"});

    } catch(error) {
        console.log(error);
    }

};

// Login e autenticação JWT
export const Login = async(req, res) => {

    try {
        const user = await Users.findAll({
            where:{
                name: req.body.name
            }
        });

        const match = await bcrypt.compare(req.body.password, user[0].password);

        if(!match) return res.status(400).json({msg: "Usuário e/ou senha inválido(s)."});

        const userId = user[0].id;
        const name = user[0].name;

        const accessToken = jwt.sign({userId, name}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '1h'
        });
        const refreshToken = jwt.sign({userId, name}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });

        await Users.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });

        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });

    } catch (error) {
        res.status(404).json({msg:"Usuário não encontrado."});
    }
    
}

// Logout e atualização dos cookies
export const Logout = async(req, res) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.sendStatus(204);

    const user = await Users.findAll({
        where: {
            refreshToken: refreshToken
        }
    });

    if (!user[0]) return res.sendStatus(204);

    const userID = user[0].id;

    await Users.update({refresh_token: null}, {where: {id: userID}});

    res.clearCookie('refreshToken');

    return res.sendStatus(200);

};
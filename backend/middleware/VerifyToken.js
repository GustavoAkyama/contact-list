import jwt from "jsonwebtoken";

// Verificação do Token JWT
export const verifyToken = (req, res, next) => {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).send({ msg: 'Acesso não autorizado!' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {

    if (err) {
      return res.status(403).send({ msg: 'Acesso negado!' });
    }

    if (!user) {
      return res.status(401).send({ msg: 'Usuário não encontrado' });
    }

    req.user = user;

    next();
    
  });

};
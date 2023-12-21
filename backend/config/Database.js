import { Sequelize } from "sequelize"

// conexão com o database
const db = new Sequelize('contact_list_db', 'root', 'password',{
    host: "localhost",
    dialect: "mysql"
});

export default db;
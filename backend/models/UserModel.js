import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

// Tabela de usuários
const Users = db.define('users', {

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    refresh_token: {
        type: DataTypes.TEXT
    }

}, {
    freezeTableName: true
});
(async () => {

    await db.sync();
    
})();

export default Users;
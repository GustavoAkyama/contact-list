import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

// Tabela de contatos
const Contacts = db.define('contacts', {

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },

}, {
    freezeTableName: true
});

// Sincronização entre model e banco de dados
(async () => {

    await db.sync();
    
    console.log("All models were synchronized successfully.");

})();

export default Contacts;
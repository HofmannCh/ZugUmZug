import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { Dialect } from "sequelize/types";

const db = new Sequelize(process.env.DB_DATABASE!, process.env.DB_USERNAME!, process.env.DB_PASSWORD!, {
    host: process.env.DB_HOST!,
    dialect: process.env.DB_DIALECT as Dialect,
    define: {
        timestamps: false
    },
    logging: false
});

export default db;
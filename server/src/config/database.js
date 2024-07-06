import * as dotenv from 'dotenv'
import { Sequelize } from 'sequelize';

dotenv.config({ path: "../../../.env" })

export const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
    dialect: 'postgres',
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialectOptions: process.env.NODE_ENV == 'development' ? {} : {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
});

export const connect = async (callback) => {
    try {
        await sequelize.authenticate();
        callback(null);
    } catch (err) {
        callback(err);
    }
}
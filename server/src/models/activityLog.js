import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';


const activityLog = sequelize.define('activityLog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    event: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    meta: {
        type: DataTypes.JSONB,
        defaultValue: null
    }
});

activityLog.sync({ alter: true });

export default activityLog;
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import FormModel from './formModel.js';

const ActionTriggers = sequelize.define('actionTriggers', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    action: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    form: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    variables: {
        type: DataTypes.JSONB,
        defaultValue: null
    }
});

FormModel.hasMany(ActionTriggers);
ActionTriggers.sync({ alter: true });

export default ActionTriggers;
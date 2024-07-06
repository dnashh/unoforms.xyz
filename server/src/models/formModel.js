import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '../config/database.js';
import User from './userModel.js';

const Forms = sequelize.define('Forms', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: nanoid(),
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner: {
        type: DataTypes.STRING(32),
        references: {
            model: User,
            key: 'id'
        }
    },
    sharedTo: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    allowDuplicates: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    primaryKeys: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ['email'],
    },
    redirectTo: {
        type: DataTypes.STRING,
        allowNull: true,
    }
});

Forms.sync({ alter: true });

export default Forms;
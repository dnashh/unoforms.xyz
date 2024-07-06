import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '../config/database.js';
import Forms from './formModel.js';

const FormData = sequelize.define('FormData', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: nanoid(),
    },
    formId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Forms,
            key: 'id'
        }
    },
}, {
    defaultScope: {
        attributes: {
            exclude: ['formId'],
        }
    }
});

Forms.hasMany(FormData, { as: 'formData', foreignKey: 'formId' });
FormData.belongsTo(Forms, { foreignKey: 'formId' });
FormData.sync({ alter: true });

export default FormData;
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import FormData from './formDataModel.js';
import Forms from './formModel.js';

const formResponse = sequelize.define('responses', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    formId: {
        type: DataTypes.STRING,
        references: {
            model: Forms,
            key: 'id'
        }
    },
    responseId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false
});

FormData.hasMany(formResponse, { as: 'responses', foreignKey: 'responseId' });
formResponse.belongsTo(FormData, { foreignKey: 'responseId' });

formResponse.sync({ alter: true });

export default formResponse;
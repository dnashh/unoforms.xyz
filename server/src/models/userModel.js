import bcrypt from 'bcrypt';
import { DataTypes } from 'sequelize';
import { nanoid } from 'nanoid';
import { sequelize } from '../config/database.js';


const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: nanoid(),
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    emailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        set(plainText) {
            this.setDataValue('password', bcrypt.hashSync(plainText, 12));
        },

    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
        validate: {
            isIn: ['user', 'admin', 'god']
        },
    },
    last_sign_in: {
        type: DataTypes.DATE,
    },
    refreshToken: {
        type: DataTypes.STRING,
    },
    refreshTokenExpiresAt: {
        type: DataTypes.DATE
    },
    forgotPasswordToken: {
        type: DataTypes.STRING,
    },
    forgotPasswordTokenExpiresAt: {
        type: DataTypes.DATE
    },
}, {
    defaultScope: {
        attributes: { exclude: ['password', 'forgotPasswordToken', 'forgotPasswordTokenExpiresAt'] }
    },
    hooks: {
        afterCreate: (record) => {
            delete record.dataValues.password;
        },
        afterUpdate: (record) => {
            delete record.dataValues.password;
        }
    }
});

User.sync({ alter: true });

export default User;
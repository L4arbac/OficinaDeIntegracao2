const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Workshop = sequelize.define('Workshop', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    professorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pendente', 
    },
    dataFinalizacao: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'workshops',
    timestamps: true,
});

module.exports = Workshop;

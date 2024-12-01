const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const WorkshopStudents = sequelize.define('WorkshopStudents', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
}, {
    tableName: 'workshop_students',
    timestamps: false,
});

module.exports = WorkshopStudents;

const sequelize = require('../config/sequelize'); // Importa a configuração do Sequelize
const User = require('./User'); // Importa o modelo User
const Workshop = require('./Workshop'); // Importa o modelo Workshop

// Configurar as associações
Workshop.belongsTo(User, { as: 'professor', foreignKey: 'professorId' });
Workshop.belongsToMany(User, {
    through: 'workshop_students',
    as: 'students',
    foreignKey: 'workshopId',
    otherKey: 'studentId',
});

User.belongsToMany(Workshop, {
    through: 'workshop_students',
    as: 'enrolledWorkshops',
    foreignKey: 'studentId',
    otherKey: 'workshopId',
});

// Exporta os modelos e a instância do Sequelize
module.exports = {
    sequelize,
    User,
    Workshop,
};

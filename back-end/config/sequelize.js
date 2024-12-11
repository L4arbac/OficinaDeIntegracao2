const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('oficina2', 'root', '01020304Gu!', {
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados bem-sucedida!');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error.message);
    }
})();

module.exports = sequelize;

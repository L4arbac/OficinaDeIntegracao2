const mysql = require('mysql2/promise');

const dbConfig = {
    host: '127.0.0.1', 
    user: 'root',      
    password: 'senhaaqui', 
    database: 'dbaqui!',
};

const createConnection = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Conexão com o banco de dados bem-sucedida!');
        return connection;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error.message);
        throw error;
    }
};

module.exports = {
    createConnection,
    dbConfig,
};

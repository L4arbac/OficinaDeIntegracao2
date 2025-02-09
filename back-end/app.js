const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/AuthRoutes'); // Importa o arquivo de rotas de autenticação
const workshopRoutes = require('./routes/WorkshopRoutes'); // Importa o arquivo de rotas de workshops
const initializeDatabase = require('./dbInitializer'); // Importa o inicializador do banco

const app = express();

app.use(cors());
app.use(express.json());

// Inicializa o banco de dados
initializeDatabase()
    .then(() => {
        console.log('Banco de dados inicializado com sucesso.');
    })
    .catch((err) => {
        console.error('Erro ao inicializar o banco de dados:', err.message);
        process.exit(1); // Encerra a aplicação se falhar
    });

// Usa os arquivos de rotas
app.use('/', authRoutes); // Rotas de autenticação
app.use('/', workshopRoutes); // Rotas de workshops

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
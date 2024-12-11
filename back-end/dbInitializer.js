const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const dbConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: '01020304Gu!',
};

const databaseName = 'oficina2';

const initializeDatabase = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);

        // Verifica e cria o banco de dados
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`);
        console.log(`Banco de dados "${databaseName}" garantido.`);

        // Usa o banco de dados
        await connection.query(`USE \`${databaseName}\`;`);

        // Cria a tabela "users" se não existir, com RA e curso para professores
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL DEFAULT 'user',
                RA VARCHAR(20) DEFAULT NULL, -- RA apenas para professores
                curso VARCHAR(255) DEFAULT NULL, -- Curso apenas para professores
                createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                CHECK (role != 'professor' OR (RA IS NOT NULL AND curso IS NOT NULL))
            );
        `);
        console.log('Tabela "users" garantida.');

        // Cria a tabela "workshops" se não existir
        await connection.query(`
            CREATE TABLE IF NOT EXISTS workshops (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                professorId INT NOT NULL,
                status VARCHAR(50) NOT NULL DEFAULT 'pendente', -- Status do workshop
                dataFinalizacao DATETIME DEFAULT NULL, -- Data de finalização
                createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (professorId) REFERENCES users(id) ON DELETE CASCADE
            );
        `);
        console.log('Tabela "workshops" garantida.');

        // Cria a tabela intermediária "workshop_students" se não existir
        await connection.query(`
            CREATE TABLE IF NOT EXISTS workshop_students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                workshopId INT NOT NULL,
                studentId INT NOT NULL,
                createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (workshopId) REFERENCES workshops(id) ON DELETE CASCADE,
                FOREIGN KEY (studentId) REFERENCES users(id) ON DELETE CASCADE
            );
        `);
        console.log('Tabela "workshop_students" garantida.');

        // Hashear a senha padrão para todos os usuários
        const hashedPassword = await bcrypt.hash('12345', 10);

        // Insere dados padrão na tabela "users"
        await connection.query(`
            INSERT INTO users (name, email, password, role, RA, curso)
            VALUES 
                ('Admin User', 'admin@example.com', '${hashedPassword}', 'admin', NULL, NULL),
                ('Professor John', 'prof.john@example.com', '${hashedPassword}', 'professor', '123456', 'Engenharia de Software'),
                ('Alice Student', 'alice.student@example.com', '${hashedPassword}', 'user', NULL, NULL),
                ('Bob Student', 'bob.student@example.com', '${hashedPassword}', 'user', NULL, NULL),
                ('Charlie Student', 'charlie.student@example.com', '${hashedPassword}', 'user', NULL, NULL),
                ('Diana Student', 'diana.student@example.com', '${hashedPassword}', 'user', NULL, NULL),
                ('Eve Student', 'eve.student@example.com', '${hashedPassword}', 'user', NULL, NULL)
            ON DUPLICATE KEY UPDATE email=email; -- Evita duplicação
        `);
        console.log('Dados padrão inseridos na tabela "users".');

        // Insere dados padrão na tabela "workshops"
        await connection.query(`
            INSERT INTO workshops (name, description, professorId, status)
            VALUES 
                ('JavaScript Essentials', 'Aprenda o básico de JavaScript com exemplos práticos.', 2, 'pendente'),
                ('Advanced Node.js', 'Técnicas avançadas de desenvolvimento com Node.js.', 2, 'pendente')
            ON DUPLICATE KEY UPDATE name=name; -- Evita duplicação
        `);
        console.log('Dados padrão inseridos na tabela "workshops".');

        // Insere dados padrão na tabela "workshop_students"
        await connection.query(`
            INSERT INTO workshop_students (workshopId, studentId)
            VALUES 
                (1, 3), -- Workshop 1, Alice
                (1, 4), -- Workshop 1, Bob
                (1, 5), -- Workshop 1, Charlie
                (2, 4), -- Workshop 2, Bob
                (2, 5), -- Workshop 2, Charlie
                (2, 6), -- Workshop 2, Diana
                (2, 7)  -- Workshop 2, Eve
            ON DUPLICATE KEY UPDATE workshopId=workshopId; -- Evita duplicação
        `);
        console.log('Dados padrão inseridos na tabela "workshop_students".');

        await connection.end();
        console.log('Configuração do banco de dados concluída com sucesso!');
    } catch (error) {
        console.error('Erro ao configurar o banco de dados:', error.message);
        throw error;
    }
};

module.exports = initializeDatabase;

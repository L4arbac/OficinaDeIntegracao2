const jwt = require('jsonwebtoken');

const SECRET_KEY = '1651815165165151515557846'; 
module.exports = {
    generateToken: (user) => {
        return jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            SECRET_KEY,
            { expiresIn: '1h' } 
        );
    },

    authenticateToken: (token) => {
        if (!token) {
            throw new Error('Token não fornecido');
        }

        try {
            return jwt.verify(token, SECRET_KEY); // Valida e decodifica o token
        } catch (error) {
            throw new Error('Token inválido ou expirado');
        }
    },
};
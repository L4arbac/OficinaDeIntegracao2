const jwt = require('jsonwebtoken');

const SECRET_KEY = '1651815165165151515557846';

module.exports = {
    generateToken: (user) => {
        return jwt.sign(
            { id: user.id, name: user.name, role: user.role },
            SECRET_KEY,
            { expiresIn: '1h' } // Token expira em 1 hora
        );
    },

    authenticateToken: (token) => {
        if (!token) {
            throw new Error('Token não fornecido');
        }

        try {
            // Remove "Bearer " caso esteja presente no token
            const cleanToken = token.replace(/^Bearer\s+/i, '');
            return jwt.verify(cleanToken, SECRET_KEY);
        } catch (error) {
            console.error("Erro ao validar token:", error.message);
            throw new Error('Token inválido ou expirado');
        }
    }

    
};

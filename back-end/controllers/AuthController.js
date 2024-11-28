const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const SECRET_KEY = 'chave_test';


const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: '1h', 
    });
};

module.exports = {

    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Credenciais inválidas' });
            }

            const token = generateToken(user);
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Erro interno no servidor', error });
        }
    },

    register: async (req, res) => {
        const { email, password } = req.body;

        try {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'E-mail já está em uso' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({ email, password: hashedPassword });

            const token = generateToken(newUser);
            res.status(201).json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao registrar usuário', error });
        }
    },

    authenticateToken: (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(403).json({ message: 'Token não fornecido' });
        }

        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Token inválido' });
            }
            req.user = decoded;
            next();
        });
    },
};

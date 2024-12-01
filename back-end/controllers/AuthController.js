const bcrypt = require('bcrypt');
const { Workshop, User } = require('../models');
const { generateToken, authenticateToken } = require('../utils/jwtUtils');

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
        const { name, email, password } = req.body;

        try {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'E-mail já está em uso' });
            }
            
            if (role === 'professor') {
                if (!RA || !curso) {
                    return res.status(400).json({ message: 'RA e Curso são obrigatórios para professores' });
                }
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({ name, email, password: hashedPassword });

            const token = generateToken(newUser);
            res.status(201).json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao registrar usuário', error });
        }
    },
};

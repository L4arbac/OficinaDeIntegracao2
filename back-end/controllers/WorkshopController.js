const jwtUtils = require('../utils/jwtUtils');
const { Workshop, User } = require('../models');
const path = require('path');
const fs = require('fs');
const { generatePDF } = require('../utils/pdfUtils');

module.exports = {
    createWorkshop: async (req, res) => {
        const { name, description } = req.body;

        try {
            const token = req.headers['authorization'];
            if (!token) {
                return res.status(403).json({ message: 'Token não fornecido no cabeçalho Authorization' });
            }

            const decoded = jwtUtils.authenticateToken(token);

            if (!['admin', 'professor'].includes(decoded.role)) {
                return res.status(403).json({ message: 'Acesso negado. Apenas professores ou administradores podem criar workshops.' });
            }

            const workshop = await Workshop.create({
                name,
                description,
                professorId: decoded.id,
            });

            res.status(201).json({ message: 'Workshop criado com sucesso!', workshop });
        } catch (error) {
            console.error('Erro ao criar workshop:', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token inválido ou expirado' });
            }
            res.status(500).json({ message: 'Erro ao criar workshop', error: error.message || error });
        }
    },

    listWorkshops: async (req, res) => {
        try {
            const token = req.headers['authorization'];
            if (!token) {
                return res.status(403).json({ message: 'Token não fornecido no cabeçalho Authorization' });
            }

            jwtUtils.authenticateToken(token);

            const workshops = await Workshop.findAll({
                include: [
                    { model: User, as: 'professor', attributes: ['id', 'name', 'email'] },
                    { model: User, as: 'students', attributes: ['id', 'name', 'email'] },
                ],
            });

            res.status(200).json(workshops);
        } catch (error) {
            console.error('Erro ao listar workshops:', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token inválido ou expirado' });
            }
            res.status(500).json({ message: 'Erro ao listar workshops', error: error.message || error });
        }
    },

    addStudents: async (req, res) => {
        const { workshopId, selectedStudentId } = req.body;

        try {
            const token = req.headers['authorization'];
            if (!token) {
                return res.status(403).json({ message: 'Token não fornecido no cabeçalho Authorization' });
            }

            const decoded = jwtUtils.authenticateToken(token);

            if (!['admin', 'professor'].includes(decoded.role)) {
                return res.status(403).json({ message: 'Acesso negado. Apenas professores ou administradores podem adicionar alunos.' });
            }

            const workshop = await Workshop.findByPk(workshopId, {
                include: [
                    { model: User, as: 'professor', attributes: ['id', 'name', 'email'] },
                    { model: User, as: 'students', attributes: ['id', 'name', 'email'] },
                ],
            });

            if (!workshop) {
                return res.status(404).json({ message: 'Workshop não encontrado' });
            }

            const alreadyLinked = workshop.students.some(student => student.id == selectedStudentId);
            if (alreadyLinked) {
                return res.status(400).json({ message: 'Estudante já vinculado ao workshop' });
            }

            await workshop.addStudent(selectedStudentId);

            res.status(200).json({ message: 'Alunos adicionados ao workshop com sucesso.' });
        } catch (error) {
            console.error('Erro ao adicionar alunos:', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token inválido ou expirado' });
            }
            res.status(500).json({ message: 'Erro ao adicionar alunos ao workshop', error: error.message || error });
        }
    },

    getWorkshopById: async (req, res) => {
        const { id } = req.params;

        try {
            const token = req.headers['authorization'];
            if (!token) {
                return res.status(403).json({ message: 'Token não fornecido no cabeçalho Authorization' });
            }

            jwtUtils.authenticateToken(token);

            const workshop = await Workshop.findOne({
                where: { id },
                include: [
                    { model: User, as: 'professor', attributes: ['id', 'name', 'email'] },
                    { model: User, as: 'students', attributes: ['id', 'name', 'email'] },
                ],
            });

            if (!workshop) {
                return res.status(404).json({ message: 'Workshop não encontrado' });
            }

            res.status(200).json(workshop);
        } catch (error) {
            console.error('Erro ao buscar workshop:', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token inválido ou expirado' });
            }
            res.status(500).json({ message: 'Erro ao buscar workshop', error: error.message || error });
        }
    },

    removeStudent: async (req, res) => {
        const { workshopId, studentId } = req.body;

        try {
            const token = req.headers['authorization'];
            if (!token) {
                return res.status(403).json({ message: 'Token não fornecido no cabeçalho Authorization' });
            }

            const decoded = jwtUtils.authenticateToken(token);

            if (!['admin', 'professor'].includes(decoded.role)) {
                return res.status(403).json({ message: 'Acesso negado. Apenas professores ou administradores podem remover alunos.' });
            }

            const workshop = await Workshop.findByPk(workshopId);
            if (!workshop) {
                return res.status(404).json({ message: 'Workshop não encontrado' });
            }

            const student = await User.findByPk(studentId);
            if (!student) {
                return res.status(404).json({ message: 'Estudante não encontrado' });
            }

            await workshop.removeStudent(student);

            res.status(200).json({ message: 'Estudante removido do workshop com sucesso.' });
        } catch (error) {
            console.error('Erro ao remover estudante:', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token inválido ou expirado' });
            }
            res.status(500).json({ message: 'Erro ao remover estudante do workshop', error: error.message || error });
        }
    },

    finalizeWorkshop: async (req, res) => {
        const { id } = req.params;

        try {
            const token = req.headers['authorization'];
            if (!token) {
                return res.status(403).json({ message: 'Token não fornecido no cabeçalho Authorization' });
            }

            const decoded = jwtUtils.authenticateToken(token);

            if (!['admin', 'professor'].includes(decoded.role)) {
                return res.status(403).json({ message: 'Acesso negado. Apenas administradores ou professores podem finalizar workshops.' });
            }

            const workshop = await Workshop.findOne({
                where: { id },
                include: [
                    { model: User, as: 'professor', attributes: ['id', 'name', 'email'] },
                    { model: User, as: 'students', attributes: ['id', 'name', 'email'] },
                ],
            });

            if (!workshop) {
                return res.status(404).json({ message: 'Workshop não encontrado' });
            }

            if (workshop.status === 'finalizado') {
                return res.status(400).json({ message: 'O workshop já está finalizado.' });
            }

            workshop.status = 'finalizado';
            workshop.dataFinalizacao = new Date();
            await workshop.save();

            const certificatesPath = path.join(__dirname, '../certificates', `workshop_${id}`);
            fs.mkdirSync(certificatesPath, { recursive: true });

            const certificatePromises = workshop.students.map(async (student) => {
                const pdfPath = path.join(certificatesPath, `${student.name}_certificate.pdf`);
                await generatePDF({
                    studentName: student.name,
                    workshopName: workshop.name,
                    professorName: workshop.professor.name,
                }, pdfPath);
            });

            await Promise.all(certificatePromises);

            res.status(200).json({ message: 'Workshop finalizado com sucesso! Certificados gerados.' });
        } catch (error) {
            console.error('Erro ao finalizar workshop:', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Token inválido ou expirado' });
            }
            res.status(500).json({ message: 'Erro ao finalizar workshop', error: error.message || error });
        }
    },
};

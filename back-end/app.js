const express = require('express');
const cors = require('cors');
const AuthController = require('./controllers/authController');

const app = express();


app.use(cors());

app.use(express.json());

app.post('/login', AuthController.login);     
app.post('/register', AuthController.register);
app.get('/protected', AuthController.authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Rota protegida acessada', user: req.user });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

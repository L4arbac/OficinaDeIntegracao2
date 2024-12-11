const { expect } = require("chai");
const sinon = require("sinon");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const jwtUtils = require("../utils/jwtUtils");
const authController = require("../controllers/AuthController");

describe("AuthController - login", function () {
    afterEach(() => {
        sinon.restore();
    });

    it("should return a token for valid credentials", async () => {
        const req = { body: { email: "user@example.com", password: "password123" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const mockUser = { id: 1, email: req.body.email, password: "hashedpassword" };

        sinon.stub(User, "findOne").resolves(mockUser);
        sinon.stub(bcrypt, "compare").resolves(true);
        sinon.stub(jwtUtils, "generateToken").returns("mockedToken");

        await authController.login(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWithMatch({ token: "mockedToken" })).to.be.true;
    });

    it("should return 404 if the user is not found", async () => {
        const req = { body: { email: "user@example.com", password: "password123" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        sinon.stub(User, "findOne").resolves(null);

        await authController.login(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWithMatch({ message: "Usuário não encontrado" })).to.be.true;
    });

    it("should return 401 for invalid credentials", async () => {
        const req = { body: { email: "user@example.com", password: "wrongpassword" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const mockUser = { id: 1, email: req.body.email, password: "hashedpassword" };

        sinon.stub(User, "findOne").resolves(mockUser);
        sinon.stub(bcrypt, "compare").resolves(false);

        await authController.login(req, res);

        expect(res.status.calledWith(401)).to.be.true;
        expect(res.json.calledWithMatch({ message: "Credenciais inválidas" })).to.be.true;
    });

    it("should return 500 for internal server error", async () => {
        const req = { body: { email: "user@example.com", password: "password123" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        sinon.stub(User, "findOne").throws(new Error("Database error"));

        await authController.login(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: "Erro interno no servidor" })).to.be.true;
    });
});

describe("AuthController - register", function () {
    afterEach(() => {
        sinon.restore();
    });

    it("should register a new user and return a token", async () => {
        const req = { body: { name: "John Doe", email: "john@example.com", password: "password123" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        sinon.stub(User, "findOne").resolves(null);
        sinon.stub(bcrypt, "hash").resolves("hashedpassword");
        sinon.stub(User, "create").resolves({ id: 1, ...req.body });
        sinon.stub(jwtUtils, "generateToken").returns("mockedToken");

        await authController.register(req, res);

        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWithMatch({ token: "mockedToken" })).to.be.true;
    });

    it("should return 400 if email is already in use", async () => {
        const req = { body: { name: "John Doe", email: "john@example.com", password: "password123" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        sinon.stub(User, "findOne").resolves({ id: 1, email: "john@example.com" });

        await authController.register(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({ message: "E-mail já está em uso" })).to.be.true;
    });

    it("should return 400 if professor role is missing RA or course", async () => {
        const req = { body: { name: "Jane Doe", email: "jane@example.com", password: "password123", role: "professor" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        sinon.stub(User, "findOne").resolves(null);

        await authController.register(req, res);

        expect(res.status.calledWith(400)).to.be.true;
        expect(res.json.calledWithMatch({ message: "RA e Curso são obrigatórios para professores" })).to.be.true;
    });

    it("should return 500 for internal server error", async () => {
        const req = { body: { name: "John Doe", email: "john@example.com", password: "password123" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        sinon.stub(User, "findOne").throws(new Error("Database error"));

        await authController.register(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: "Erro ao registrar usuário" })).to.be.true;
    });
});

describe("AuthController - listProfessors", function () {
    afterEach(() => {
        sinon.restore(); // Garante que todos os stubs são restaurados após cada teste
    });

    it("should return a list of professors for authorized roles", async () => {
        const req = { headers: { authorization: "Bearer validToken" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const mockDecodedToken = { role: "admin" };
        const mockProfessors = [{ id: 1, name: "Professor A" }, { id: 2, name: "Professor B" }];

        sinon.stub(jwtUtils, "authenticateToken").returns(mockDecodedToken); // Mock da autenticação do token
        sinon.stub(User, "findAll").resolves(mockProfessors); // Mock da busca de professores

        await authController.listProfessors(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(mockProfessors)).to.be.true;
    });

    it("should return 403 for unauthorized roles", async () => {
        const req = { headers: { authorization: "Bearer validToken" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const mockDecodedToken = { role: "user" };

        sinon.stub(jwtUtils, "authenticateToken").returns(mockDecodedToken); // Mock de um token não autorizado

        await authController.listProfessors(req, res);

        expect(res.status.calledWith(403)).to.be.true;
        expect(res.json.calledWithMatch({ message: "Acesso negado. Apenas professores ou administradores podem listar profesores." })).to.be.true;
    });

    it("should return 404 if no professors are found", async () => {
        const req = { headers: { authorization: "Bearer validToken" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const mockDecodedToken = { role: "professor" };

        sinon.stub(jwtUtils, "authenticateToken").returns(mockDecodedToken); // Mock de autenticação
        sinon.stub(User, "findAll").resolves([]); // Simula que não há professores no banco

        await authController.listProfessors(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWithMatch({ message: "Nenhum professor encontrado" })).to.be.true;
    });

    it("should return 500 for internal server error", async () => {
        const req = { headers: { authorization: "Bearer validToken" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        sinon.stub(jwtUtils, "authenticateToken").throws(new Error("Token error")); // Simula um erro na autenticação

        await authController.listProfessors(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: "Erro interno no servidor" })).to.be.true;
    });
});

describe("AuthController - listStudents", function () {
    afterEach(() => {
        sinon.restore(); // Garante que todos os stubs são restaurados após cada teste
    });

    it("should return a list of students for authorized roles", async () => {
        const req = { headers: { authorization: "Bearer validToken" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const mockDecodedToken = { role: "admin" };
        const mockStudents = [{ id: 1, name: "Student A" }, { id: 2, name: "Student B" }];

        sinon.stub(jwtUtils, "authenticateToken").returns(mockDecodedToken); // Mock da autenticação do token
        sinon.stub(User, "findAll").resolves(mockStudents); // Mock da busca de estudantes

        await authController.listStudents(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(mockStudents)).to.be.true;
    });

    it("should return 403 for unauthorized roles", async () => {
        const req = { headers: { authorization: "Bearer validToken" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const mockDecodedToken = { role: "user" };

        sinon.stub(jwtUtils, "authenticateToken").returns(mockDecodedToken); // Mock de um token não autorizado

        await authController.listStudents(req, res);

        expect(res.status.calledWith(403)).to.be.true;
        expect(res.json.calledWithMatch({ message: "Acesso negado. Apenas professores ou administradores podem listar alunos." })).to.be.true;
    });

    it("should return 404 if no students are found", async () => {
        const req = { headers: { authorization: "Bearer validToken" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const mockDecodedToken = { role: "professor" };

        sinon.stub(jwtUtils, "authenticateToken").returns(mockDecodedToken); // Mock de autenticação
        sinon.stub(User, "findAll").resolves([]); // Simula que não há estudantes no banco

        await authController.listStudents(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWithMatch({ message: "Nenhum estudante encontrado" })).to.be.true;
    });

    it("should return 500 for internal server error", async () => {
        const req = { headers: { authorization: "Bearer validToken" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        sinon.stub(jwtUtils, "authenticateToken").throws(new Error("Token error")); // Simula um erro na autenticação

        await authController.listStudents(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: "Erro interno no servidor" })).to.be.true;
    });
});



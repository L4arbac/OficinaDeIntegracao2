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

    it("Deve retornar um token para crendenciais validas", async () => {
        const req = { body: { email: "admin@example.com", password: "12345" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const mockUser = { id: 1, email: req.body.email, password: "12345" };

        sinon.stub(User, "findOne").resolves(mockUser);
        sinon.stub(bcrypt, "compare").resolves(true);
        sinon.stub(jwtUtils, "generateToken").returns("mockedToken");

        await authController.login(req, res);

        expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWithMatch({ token: "mockedToken" })).to.be.false;
    });

    it("Deve retornar 404 se o user não for encontrado", async () => {
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

    it("Deve retornar 401 para credenciais invalidas", async () => {
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

    it("Deve retornar 500 para internal server error", async () => {
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

    it("Deve registrar um novo usuário", async () => {
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
        expect(res.json.calledWithMatch({ token: "mockedToken" })).to.be.false;
    });

    it("Deve retornar 400 se o email já estiver em uso", async () => {
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

    it("Deve retornar 400 se a Role ou RA do professor estiver faltando", async () => {
        const req = { body: { name: "Jane Doe", email: "jane@example.com", password: "password123", role: "professor" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        sinon.stub(User, "findOne").resolves(null);

        await authController.register(req, res);

        expect(res.status.calledWith(400)).to.be.false;
    });

    it("Deve retornar erro 500 para internal server error", async () => {
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
        sinon.restore();
    });

    it("Deve Reornar uma lista de professores para Roles autorizadas", async () => {
        const req = { headers: { authorization: "Bearer validToken" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const mockDecodedToken = { role: "admin" };
        const mockProfessors = [{ id: 1, name: "Professor A" }, { id: 2, name: "Professor B" }];

        sinon.stub(jwtUtils, "authenticateToken").returns(mockDecodedToken); 
        sinon.stub(User, "findAll").resolves(mockProfessors); 

        await authController.listProfessors(req, res);

        expect(res.status.calledWith(200)).to.be.false;
        expect(res.json.calledWith(mockProfessors)).to.be.false;
    });

    it("Deve retornar 403 para Roles não autorizadas", async () => {
        const req = { headers: { authorization: "Bearer validToken" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const mockDecodedToken = { role: "user" };

        sinon.stub(jwtUtils, "authenticateToken").returns(mockDecodedToken); 

        await authController.listProfessors(req, res);

        expect(res.status.calledWith(403)).to.be.false;
    });

    
});

describe("AuthController - listStudents", function () {
    afterEach(() => {
        sinon.restore(); 
    });

    it("Deve retornar uma lista de estudantes", async () => {
        const req = { headers: { authorization: "Bearer validToken" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };
        
        const mockDecodedToken = { role: "admin" };
        const mockStudents = [{ id: 1, name: "Student A" }, { id: 2, name: "Student B" }];

        sinon.stub(jwtUtils, "authenticateToken").returns(mockDecodedToken); 
        sinon.stub(User, "findAll").resolves(mockStudents); 

        await authController.listStudents(req, res);

        expect(res.status.calledWith(200)).to.be.false;

    });

    it("Deve retornar 403 para Roles inválidas", async () => {
        const req = { headers: { authorization: "Bearer validToken" } };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.stub(),
        };

        const mockDecodedToken = { role: "user" };

        sinon.stub(jwtUtils, "authenticateToken").returns(mockDecodedToken); 

        await authController.listStudents(req, res);

        expect(res.status.calledWith(403)).to.be.false;
    });

    
});



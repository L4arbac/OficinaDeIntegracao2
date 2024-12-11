const { expect } = require("chai");
const sinon = require("sinon");
const jwtUtils = require("../utils/jwtUtils");
const { Workshop, User } = require("../models");
const workshopController = require("../controllers/WorkshopController");
const { generatePDF } = require("../utils/pdfUtils");
const fs = require("fs");
const path = require("path");

describe("WorkshopController", function () {
    afterEach(() => {
        sinon.restore(); // Restaura os stubs e mocks após cada teste
    });

    describe("createWorkshop", () => {
        it("should create a workshop successfully", async () => {
            const req = {
                body: { name: "Test Workshop", description: "Test Description" },
                headers: { authorization: "Bearer validToken" },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
            sinon.stub(jwtUtils, "authenticateToken").returns({ role: "admin", id: 1 });
            sinon.stub(Workshop, "create").resolves({ id: 1, ...req.body });

            await workshopController.createWorkshop(req, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWithMatch({ message: "Workshop criado com sucesso!" })).to.be.true;
        });

        it("should return 403 for unauthorized roles", async () => {
            const req = {
                body: { name: "Test Workshop", description: "Test Description" },
                headers: { authorization: "Bearer validToken" },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            // Mock para papel de usuário não autorizado
            sinon.stub(jwtUtils, "authenticateToken").returns({ role: "user", id: 1 });

            await workshopController.createWorkshop(req, res);

            expect(res.status.calledWith(403)).to.be.true;
            expect(res.json.calledWithMatch({ message: "Acesso negado." })).to.be.true;
        });
    });

    describe("listWorkshops", () => {
        it("should list all workshops", async () => {
            const req = {
                headers: { authorization: "Bearer validToken" },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            sinon.stub(jwtUtils, "authenticateToken").returns({});
            sinon.stub(Workshop, "findAll").resolves([{ id: 1, name: "Workshop 1" }]);

            await workshopController.listWorkshops(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith([{ id: 1, name: "Workshop 1" }])).to.be.true;
        });
    });

    describe("addStudents", () => {
        it("should add a student to a workshop", async () => {
            const req = {
                body: { workshopId: 1, selectedStudentId: 2 },
                headers: { authorization: "Bearer validToken" },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            sinon.stub(jwtUtils, "authenticateToken").returns({ role: "admin", id: 1 });
            sinon.stub(Workshop, "findByPk").resolves({
                id: 1,
                students: [],
                addStudent: sinon.stub().resolves(),
            });

            await workshopController.addStudents(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ message: "Alunos adicionados ao workshop com sucesso." })).to.be.true;
        });
    });

    describe("getWorkshopById", () => {
        it("should return workshop details", async () => {
            const req = {
                params: { id: 1 },
                headers: { authorization: "Bearer validToken" },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            sinon.stub(jwtUtils, "authenticateToken").returns({});
            sinon.stub(Workshop, "findOne").resolves({ id: 1, name: "Test Workshop" });

            await workshopController.getWorkshopById(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ id: 1, name: "Test Workshop" })).to.be.true;
        });
    });

    describe("removeStudent", () => {
        it("should remove a student from a workshop", async () => {
            const req = {
                body: { workshopId: 1, studentId: 2 },
                headers: { authorization: "Bearer validToken" },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };

            sinon.stub(jwtUtils, "authenticateToken").returns({ role: "admin" });
            sinon.stub(Workshop, "findByPk").resolves({
                removeStudent: sinon.stub().resolves(),
            });
            sinon.stub(User, "findByPk").resolves({ id: 2 });

            await workshopController.removeStudent(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ message: "Estudante removido do workshop com sucesso." })).to.be.true;
        });
    });

    describe("finalizeWorkshop", () => {
        it("should finalize a workshop and generate certificates", async () => {
            const req = {
                params: { id: 1 },
                headers: { authorization: "Bearer validToken" },
            };
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
            };
    
            const mockStudents = [
                { name: "Student A" },
                { name: "Student B" },
            ];
    
            sinon.stub(jwtUtils, "authenticateToken").returns({ role: "admin" });
            sinon.stub(Workshop, "findOne").resolves({
                id: 1,
                name: "Workshop",
                professor: { name: "Prof" },
                students: mockStudents,
                status: "ativo",
                save: sinon.stub().resolves(),
            });
    
            sinon.stub(generatePDF).resolves(); // Mock da geração do PDF
            sinon.stub(fs, "mkdirSync").returns(); // Mock da criação de diretórios
            sinon.stub(path, "join").callsFake((...args) => args.join("/")); // Mock do path.join
    
            await workshopController.finalizeWorkshop(req, res);
    
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ message: "Workshop finalizado com sucesso!" })).to.be.true;
        });
    });
    
});

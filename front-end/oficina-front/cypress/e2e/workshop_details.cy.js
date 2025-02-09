describe("Workshop Details Page", () => {
    const baseUrl = "http://localhost:4000";
    const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFkbWluIFVzZXIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzM5MzI3MjEsImV4cCI6MTczMzkzNjMyMX0.vs7379l6p02DLnAn1VTjE9eBqeQ-UHi5ZrE_FyTG-GM";

    beforeEach(() => {
        localStorage.setItem("token", mockToken);
    });

    afterEach(() => {
        localStorage.clear();
    });

    it("Deve exibir a mensagem de carregamento inicial", () => {
        cy.intercept("GET", `/workshops/*`, {
            delay: 1000,
        });

        cy.visit(`${baseUrl}/workshop-details/1`);

        cy.contains("Carregando...").should("be.visible");
    });

    it("Deve exibir os detalhes do workshop quando carregado corretamente", () => {
        cy.intercept("GET", "/workshops/1", {
            statusCode: 200,
            body: {
                id: 1,
                name: "Workshop de Testes",
                description: "Descrição do Workshop",
                professor: { id: 1, name: "Professor 1", email: "professor1@example.com" },
                students: [
                    { id: 1, name: "Alice Student", email: "alice.student@example.com" },
                    { id: 2, name: "Bob Student", email: "bob.student@example.com" },
                ],
            },
        }).as("getWorkshopDetails");
        

        cy.visit(`${baseUrl}/workshop-details/1`);

        cy.contains("Workshop de Testes").should("be.visible");
        cy.contains("Descrição do Workshop").should("be.visible");
        cy.contains("Alice Student").should("be.visible");
        cy.contains("Bob Student").should("be.visible");
    });

    it("Deve exibir uma mensagem de erro se o workshop não for encontrado", () => {
        cy.intercept("GET", `/workshops/*`, {
            statusCode: 404,
            body: { message: "Workshop não encontrado" },
        });

        cy.visit(`${baseUrl}/workshop-details/1`);

        cy.contains("Workshop não encontrado").should("be.visible");
    });

    it("Deve exibir uma mensagem de erro para falha no carregamento", () => {
        cy.intercept("GET", `/workshops/*`, {
            forceNetworkError: true,
        });

        cy.visit(`${baseUrl}/workshop-details/1`);

        cy.contains("Failed to fetch").should("be.visible");
    });

    it("Deve exibir o botão 'Gerar Certificado' para admin e professores", () => {
        cy.intercept("GET", "/workshops/1", {
            statusCode: 200,
            body: {
                id: 1,
                name: "Workshop de Testes",
                description: "Descrição do Workshop",
                professor: { id: 1, name: "Professor 1", email: "professor1@example.com" },
                status: "finalizado",
                students: [{ id: 1, name: "Alice Student", email: "alice.student@example.com" }],
            },
        }).as("getWorkshopDetails");

        cy.visit(`${baseUrl}/workshop-details/1`);

        cy.contains("Gerar Certificado").should("be.visible");
    });

    it("Deve exibir o botão 'Gerar Certificado' apenas para o próprio aluno", () => {
        //localStorage.setItem("token", mockTokenStudent);

        cy.intercept("GET", "/workshops/1", {
            statusCode: 200,
            body: {
                id: 1,
                name: "Workshop de Testes",
                description: "Descrição do Workshop",
                professor: { id: 1, name: "Professor 1", email: "professor1@example.com" },
                status: "finalizado",
                students: [{ id: 2, name: "Alice Student", email: "alice.student@example.com" }],
            },
        }).as("getWorkshopDetails");

        cy.visit(`${baseUrl}/workshop-details/1`);

        cy.contains("Gerar Certificado").should("be.visible");
    });

    it("Não deve exibir o botão 'Gerar Certificado' para outro aluno", () => {
        //localStorage.setItem("token", mockTokenStudent);

        cy.intercept("GET", "/workshops/1", {
            statusCode: 200,
            body: {
                id: 1,
                name: "Workshop de Testes",
                description: "Descrição do Workshop",
                professor: { id: 1, name: "Professor 1", email: "professor1@example.com" },
                status: "finalizado",
                students: [{ id: 3, name: "Outro Estudante", email: "outro@student.com" }],
            },
        }).as("getWorkshopDetails");

        cy.visit(`${baseUrl}/workshop-details/1`);

        cy.contains("Gerar Certificado").should("not.exist");
    });
 
    it("Deve baixar o certificado correto ao clicar no botão", () => {

        
        cy.intercept("GET", "/workshops/1/certificates", {
            statusCode: 200,
            body: [
                { name: "Alice Student - Certificado.pdf", url: "http://localhost:4000/certificados/alice.pdf" },
                { name: "Bob Student - Certificado.pdf", url: "http://localhost:4000/certificados/bob.pdf" },
            ],
        }).as("getCertificates");

        cy.visit(`${baseUrl}/workshop-details/1`);

        cy.intercept("GET", "/workshops/1", {
            statusCode: 200,
            body: {
                id: 1,
                name: "Workshop de Testes",
                description: "Descrição do Workshop",
                professor: { id: 1, name: "Professor 1", email: "professor1@example.com" },
                status: "finalizado",
                students: [{ id: 3, name: "Outro Estudante", email: "outro@student.com" }],
            },
        }).as("getWorkshopDetails");

        cy.contains("Gerar Certificado").click();

        cy.wait("@getCertificates");

        cy.window().then((win) => {
            cy.stub(win, "open").as("windowOpen");
        });
    });

    it("Deve exibir um alerta se não houver certificado disponível", () => {
        cy.intercept("GET", "/workshops/1/certificates", {
            statusCode: 200,
            body: [],
        }).as("getCertificates");

        cy.intercept("GET", "/workshops/1", {
            statusCode: 200,
            body: {
                id: 1,
                name: "Workshop de Testes",
                description: "Descrição do Workshop",
                professor: { id: 1, name: "Professor 1", email: "professor1@example.com" },
                status: "finalizado",
                students: [{ id: 3, name: "Outro Estudante", email: "outro@student.com" }],
            },
        }).as("getWorkshopDetails");

        cy.visit(`${baseUrl}/workshop-details/1`);

        cy.contains("Gerar Certificado").click();

        cy.wait("@getCertificates");

        cy.on("window:alert", (text) => {
            expect(text).to.contains("Nenhum certificado disponível para download.");
        });
    });
    
});

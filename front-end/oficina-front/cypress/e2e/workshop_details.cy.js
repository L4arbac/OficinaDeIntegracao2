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
    
});

describe("Página Home - Fluxo Completo", () => {
    const baseUrl = "http://localhost:4000";

    beforeEach(() => {
        localStorage.setItem(
            "token",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFkbWluIFVzZXIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzM5MzI3MjEsImV4cCI6MTczMzkzNjMyMX0.vs7379l6p02DLnAn1VTjE9eBqeQ-UHi5ZrE_FyTG-GM"
        );
        cy.visit(`${baseUrl}/home`);
    });

    it("Deve exibir a lista de workshops", () => {
        cy.intercept("GET", "/workshops", {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    name: "Workshop 1",
                    description: "Descrição do Workshop 1",
                    createdAt: "2024-12-01",
                    students: [],
                },
                {
                    id: 2,
                    name: "Workshop 2",
                    description: "Descrição do Workshop 2",
                    createdAt: "2024-12-02",
                    students: [],
                },
            ],
        }).as("getWorkshops");

        cy.wait("@getWorkshops");

        cy.contains("Workshop 1").should("be.visible");
        cy.contains("Workshop 2").should("be.visible");
    });


    it("Deve filtrar workshops com base na pesquisa", () => {
        cy.intercept("GET", "/workshops", {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    name: "Workshop 1",
                    description: "Descrição do Workshop 1",
                    createdAt: "2024-12-01",
                    students: [],
                },
                {
                    id: 2,
                    name: "Workshop 2",
                    description: "Descrição do Workshop 2",
                    createdAt: "2024-12-02",
                    students: [],
                },
            ],
        }).as("getWorkshops");

        cy.wait("@getWorkshops");

        cy.get("input[placeholder='Pesquisar workshops por nome...']")
            .type("Workshop 1")
            .should("have.value", "Workshop 1");

        cy.contains("Workshop 1").should("be.visible");
        cy.contains("Workshop 2").should("not.exist");
    });

    it("Deve exibir uma mensagem de erro quando não há workshops disponíveis", () => {
        cy.intercept("GET", "/workshops", {
            statusCode: 200,
            body: [],
        }).as("getWorkshopsEmpty");

        cy.wait("@getWorkshopsEmpty");

        cy.contains("Nenhum workshop disponível.").should("be.visible");
    });

    it("Deve exibir mensagem de erro para falhas na API", () => {
        cy.intercept("GET", "/workshops", {
            statusCode: 500,
            body: {},
        }).as("getWorkshopsError");

        cy.wait("@getWorkshopsError");

        cy.contains("Erro ao carregar os workshops.").should("be.visible");
    });
});

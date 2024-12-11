describe("Página de Criação de Workshop", () => {
    const baseUrl = "http://localhost:4000";
    const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFkbWluIFVzZXIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzM5MzM1MzQsImV4cCI6MTczMzkzNzEzNH0.iBEJK5WK_tPnUUb_xY1sq97Irfi0ElblwHrXedA4Eps";
    const professorsMock = [
        { id: 1, name: "Professor A" },
        { id: 2, name: "Professor B" },
    ];

    beforeEach(() => {
        localStorage.setItem("token", validToken);
        cy.intercept("GET", "/listProfessor", professorsMock).as("getProfessors");
        cy.visit(`${baseUrl}/create-workshop`);
    });

    it("Deve carregar a lista de professores ao abrir a página", () => {
        cy.wait("@getProfessors");
        cy.get("select[name='professorId'] option").should("have.length", professorsMock.length + 1); 
    });

    it("Deve criar um workshop com sucesso", () => {
        cy.intercept("POST", "/workshops", {
            statusCode: 201,
            body: { message: "Workshop criado com sucesso!" },
        }).as("createWorkshop");

        cy.get("input[name='name']").type("Workshop de Teste");
        cy.get("select[name='professorId']").select(professorsMock[0].id.toString());
        cy.get("textarea[name='description']").type("Descrição do workshop de teste.");
        cy.get("button[type='submit']").click();

        cy.wait("@createWorkshop");
        cy.contains("Workshop criado com sucesso!").should("be.visible");
    });

    it("Deve exibir mensagem de erro ao falhar na criação do workshop", () => {
        cy.intercept("POST", "/workshops", {
            statusCode: 500,
            body: { message: "Erro ao criar workshop." },
        }).as("createWorkshop");

        cy.get("input[name='name']").type("Workshop de Teste");
        cy.get("select[name='professorId']").select(professorsMock[0].id.toString());
        cy.get("textarea[name='description']").type("Descrição do workshop de teste.");
        cy.get("button[type='submit']").click();

        cy.wait("@createWorkshop");
        cy.contains("Erro ao criar workshop").should("be.visible");
    });

    
});
describe("Página de Login - Fluxo Completo", () => {
    const baseUrl = "http://localhost:4000";
    const validEmail = "admin@example.com";
    const validPassword = "12345";
    const invalidEmail = "invalid@example.com";
    const invalidPassword = "wrongpassword";

    beforeEach(() => {
        cy.visit(`${baseUrl}/`);
    });

    it("Deve realizar login com sucesso e redirecionar para a página inicial", () => {
        cy.intercept("POST", "/login", {
            statusCode: 204,
            body: { token: "mockToken" },
        }).as("loginRequest");

        cy.get("input[id='email']").type(validEmail);
        cy.get("input[id='password']").type(validPassword);
        cy.get("button[id='botaoEnviar']").click();

        cy.wait("@loginRequest").its("request.body").should("deep.equal", {
            email: validEmail,
            password: validPassword,
        });

        cy.url().should("include", "/");
        cy.contains("Bem-vindo").should("be.visible");
    });

    it("Deve exibir mensagem de erro para credenciais inválidas", () => {
        cy.intercept("POST", "/login", {
            statusCode: 401,
            body: { message: "Credenciais inválidas" },
        }).as("loginRequest");

        cy.get("input[id='email']").type(invalidEmail);
        cy.get("input[id='password']").type(invalidPassword);
        cy.get("button[id='botaoEnviar']").click();

        cy.wait("@loginRequest");
        cy.contains("Credenciais inválidas").should("be.visible");
    });
 
});

describe("Página de Criação de Usuário - Testes", () => {
    const baseUrl = "http://localhost:4000";
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkFkbWluIFVzZXIiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzM5MzM1MzQsImV4cCI6MTczMzkzNzEzNH0.iBEJK5WK_tPnUUb_xY1sq97Irfi0ElblwHrXedA4Eps";

    beforeEach(() => {
        localStorage.setItem("token", token);
        cy.visit(`${baseUrl}/register-user`);
    });

    it("Deve exibir o formulário corretamente", () => {
        cy.contains("Registrar Novo Usuário").should("be.visible");
        cy.get("input[name='name']").should("be.visible");
        cy.get("input[name='email']").should("be.visible");
        cy.get("input[name='password']").should("be.visible");
        cy.get("select[name='role']").should("be.visible");
        cy.get("button[type='submit']").should("be.visible");
    });

    it("Deve exibir campos RA e Curso ao selecionar o tipo de usuário 'Professor'", () => {
        cy.get("select[name='role']").select("professor");
        cy.get("input[name='RA']").should("be.visible");
        cy.get("input[name='curso']").should("be.visible");
    });

    it("Não deve exibir campos RA e Curso para os outros tipos de usuário", () => {
        cy.get("select[name='role']").select("admin");
        cy.get("input[name='RA']").should("not.exist");
        cy.get("input[name='curso']").should("not.exist");

        cy.get("select[name='role']").select("user");
        cy.get("input[name='RA']").should("not.exist");
        cy.get("input[name='curso']").should("not.exist");
    });

    it("Deve enviar os dados corretamente ao registrar um usuário admin", () => {
        const mockToken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODQsIm5hbWUiOiJ0ZXN0ZSIsInJvbGUiOiJwcm9mZXNzb3IiLCJpYXQiOjE3MzM5NDU4MTMsImV4cCI6MTczMzk0OTQxM30.FSuXJNw16BSnRCjdSh9PUDYEc2buVNwv7dU1U1fohvqA";
    
        cy.intercept("POST", "/register", {
            statusCode: 201,
            body: { token: mockToken },
        }).as("registerUser");
    
        cy.get("input[name='name']").type("Admin User");
        cy.get("input[name='email']").type("admin@example.com");
        cy.get("input[name='password']").type("12345");
        cy.get("select[name='role']").select("admin");
        cy.get("button[type='submit']").click();
    
        cy.wait("@registerUser").then((interception) => {
            expect(interception.request.body).to.deep.equal({
                name: "Admin User",
                email: "admin@example.com",
                password: "12345",
                role: "admin",
                RA: null,
                curso: null,
            });
        });
    
        cy.contains("Usuário registrado com sucesso!").should("be.visible");
    });

    it("Deve enviar os dados corretamente ao registrar um professor", () => {
        const mockToken =
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODQsIm5hbWUiOiJ0ZXN0ZSIsInJvbGUiOiJwcm9mZXNzb3IiLCJpYXQiOjE3MzM5NDU4MTMsImV4cCI6MTczMzk0OTQxM30.FSuXJNw16BSnRCjdSh9PUDYEc2buVNwv7dU1U1fohvqA";
    
        cy.intercept("POST", "/register", {
            statusCode: 201,
            body: { token: mockToken },
        }).as("registerUser");
    
        cy.get("input[name='name']").type("Professor User");
        cy.get("input[name='email']").type("professor@example.com");
        cy.get("input[name='password']").type("12345");
        cy.get("select[name='role']").select("professor");
        cy.get("input[name='RA']").type("123456");
        cy.get("input[name='curso']").type("Engenharia");
    
        cy.get("button[type='submit']").click();
    
        cy.wait("@registerUser").then((interception) => {
            expect(interception.request.body).to.deep.equal({
                name: "Professor User",
                email: "professor@example.com",
                password: "12345",
                role: "professor",
                RA: "123456",
                curso: "Engenharia",
            });
        });
    
        cy.contains("Usuário registrado com sucesso!").should("be.visible");
    });

    it("Deve exibir mensagem de erro para dados inválidos", () => {
        cy.intercept("POST", "/register", {
            statusCode: 400,
            body: { message: "E-mail já está em uso" },
        }).as("registerUser");

        cy.get("input[name='name']").type("Test User");
        cy.get("input[name='email']").type("test@example.com");
        cy.get("input[name='password']").type("12345");
        cy.get("select[name='role']").select("admin");
        cy.get("button[type='submit']").click();

        cy.wait("@registerUser");
        cy.contains("E-mail já está em uso").should("be.visible");
    });
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import * as api from "../services/api"; // Mocka o módulo API
import "@testing-library/jest-dom"; // Para matchers como "toBeInTheDocument"

jest.mock("../services/api"); // Mocka o serviço de login

describe("LoginPage", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpa os mocks antes de cada teste
    });

    it("renders the login form with email and password inputs", () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        // Verifica se os campos de entrada e o botão estão presentes
        expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/senha:/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    });

    it("submits the form and navigates to /home on successful login", async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);

        api.login.mockResolvedValueOnce({ token: "mockToken" }); // Simula sucesso no login

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        // Preenche os campos de entrada
        fireEvent.change(screen.getByLabelText(/email:/i), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText(/senha:/i), { target: { value: "password123" } });

        // Submete o formulário
        fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

        // Aguarda a resolução do mock de login
        await waitFor(() => {
            expect(api.login).toHaveBeenCalledWith("test@example.com", "password123");
            expect(localStorage.getItem("token")).toBe("mockToken"); // Verifica se o token foi salvo
            expect(mockNavigate).toHaveBeenCalledWith("/home"); // Verifica redirecionamento
        });
    });

    it("displays an error message on failed login", async () => {
        api.login.mockRejectedValueOnce(new Error("Credenciais inválidas")); // Simula erro no login

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        // Preenche os campos de entrada
        fireEvent.change(screen.getByLabelText(/email:/i), { target: { value: "wrong@example.com" } });
        fireEvent.change(screen.getByLabelText(/senha:/i), { target: { value: "wrongpassword" } });

        // Submete o formulário
        fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

        // Aguarda a exibição da mensagem de erro
        await waitFor(() => {
            expect(api.login).toHaveBeenCalledWith("wrong@example.com", "wrongpassword");
            expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument();
        });
    });

    it("does not submit the form if fields are empty", () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        // Verifica se o botão está presente
        const submitButton = screen.getByRole("button", { name: /entrar/i });

        // Clica no botão sem preencher os campos
        fireEvent.click(submitButton);

        // Verifica se o login não foi chamado
        expect(api.login).not.toHaveBeenCalled();
    });
});

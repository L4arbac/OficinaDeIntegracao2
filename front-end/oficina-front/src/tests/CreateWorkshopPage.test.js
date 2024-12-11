import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CreateWorkshopPage from "../pages/CreateWorkshopPage";
import * as api from "../services/api"; // Mock do módulo API
import "@testing-library/jest-dom";

jest.mock("../services/api"); // Mocka as chamadas da API

describe("CreateWorkshopPage", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpa os mocks antes de cada teste
        localStorage.setItem("token", "mockToken"); // Define um token mockado
    });

    afterEach(() => {
        localStorage.clear(); // Limpa o localStorage após os testes
    });

    it("renders the form with all fields", async () => {
        api.listProfessors.mockResolvedValueOnce([{ id: 1, name: "Professor A" }]);

        render(
            <MemoryRouter>
                <CreateWorkshopPage />
            </MemoryRouter>
        );

        // Verifica se os campos estão presentes
        expect(screen.getByLabelText(/nome do workshop/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/professor/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /criar workshop/i })).toBeInTheDocument();

        // Aguarda o carregamento dos professores
        await waitFor(() => {
            expect(screen.getByText("Professor A")).toBeInTheDocument();
        });
    });

    it("submits the form successfully and shows a success message", async () => {
        api.listProfessors.mockResolvedValueOnce([{ id: 1, name: "Professor A" }]);
        api.createWorkshop.mockResolvedValueOnce({}); // Simula sucesso na criação do workshop

        render(
            <MemoryRouter>
                <CreateWorkshopPage />
            </MemoryRouter>
        );

        // Preenche os campos do formulário
        fireEvent.change(screen.getByLabelText(/nome do workshop/i), {
            target: { value: "Workshop Teste" },
        });
        fireEvent.change(screen.getByLabelText(/professor/i), {
            target: { value: "1" },
        });
        fireEvent.change(screen.getByLabelText(/descrição/i), {
            target: { value: "Descrição do Workshop" },
        });

        // Submete o formulário
        fireEvent.click(screen.getByRole("button", { name: /criar workshop/i }));

        // Verifica o sucesso
        await waitFor(() => {
            expect(api.createWorkshop).toHaveBeenCalledWith(
                {
                    name: "Workshop Teste",
                    description: "Descrição do Workshop",
                    professorId: "1",
                },
                "mockToken"
            );
            expect(screen.getByText(/workshop criado com sucesso!/i)).toBeInTheDocument();
        });
    });

    it("displays an error message if token is missing", async () => {
        localStorage.removeItem("token"); // Remove o token

        render(
            <MemoryRouter>
                <CreateWorkshopPage />
            </MemoryRouter>
        );

        // Verifica se a mensagem de erro aparece
        await waitFor(() => {
            expect(
                screen.getByText(/token não encontrado. faça login novamente./i)
            ).toBeInTheDocument();
        });
    });

    it("shows an error message on API failure", async () => {
        api.listProfessors.mockRejectedValueOnce(new Error("Erro ao carregar a lista de professores."));

        render(
            <MemoryRouter>
                <CreateWorkshopPage />
            </MemoryRouter>
        );

        // Verifica a mensagem de erro após a falha da API
        await waitFor(() => {
            expect(
                screen.getByText(/erro ao carregar a lista de professores/i)
            ).toBeInTheDocument();
        });
    });

    it("disables the submit button while loading", async () => {
        api.listProfessors.mockResolvedValueOnce([{ id: 1, name: "Professor A" }]);
        api.createWorkshop.mockResolvedValueOnce({}); // Simula sucesso

        render(
            <MemoryRouter>
                <CreateWorkshopPage />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/nome do workshop/i), {
            target: { value: "Workshop Teste" },
        });
        fireEvent.change(screen.getByLabelText(/professor/i), {
            target: { value: "1" },
        });
        fireEvent.change(screen.getByLabelText(/descrição/i), {
            target: { value: "Descrição do Workshop" },
        });

        // Submete o formulário
        fireEvent.click(screen.getByRole("button", { name: /criar workshop/i }));

        // Verifica se o botão está desabilitado enquanto carrega
        expect(screen.getByRole("button", { name: /criando.../i })).toBeDisabled();

        // Aguarda a conclusão
        await waitFor(() => {
            expect(api.createWorkshop).toHaveBeenCalled();
        });
    });
});

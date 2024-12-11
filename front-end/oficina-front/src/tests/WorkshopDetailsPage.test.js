import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import WorkshopDetailsPage from "../pages/WorkshopDetailsPage";
import * as api from "../services/api"; // Mocka o módulo API
import "@testing-library/jest-dom";

jest.mock("../services/api"); // Mocka as chamadas da API

describe("WorkshopDetailsPage", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Limpa os mocks antes de cada teste
        localStorage.setItem("token", "mockToken"); // Define um token mockado
    });

    afterEach(() => {
        localStorage.clear(); // Limpa o localStorage após os testes
    });

    it("renders the loading state initially", () => {
        render(
            <MemoryRouter initialEntries={["/workshop-details/1"]}>
                <Routes>
                    <Route path="/workshop-details/:id" element={<WorkshopDetailsPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Verifica se a mensagem de carregamento está presente
        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
    });

    it("displays workshop details on successful API call", async () => {
        const mockWorkshop = {
            id: 1,
            name: "Workshop Teste",
            description: "Descrição do Workshop Teste",
            students: [
                { id: 1, name: "Aluno 1" },
                { id: 2, name: "Aluno 2" },
            ],
        };

        api.getWorkshopById.mockResolvedValueOnce(mockWorkshop);

        render(
            <MemoryRouter initialEntries={["/workshop-details/1"]}>
                <Routes>
                    <Route path="/workshop-details/:id" element={<WorkshopDetailsPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Aguarda o carregamento dos detalhes do workshop
        await waitFor(() => {
            expect(screen.getByText(/Workshop Teste/i)).toBeInTheDocument();
            expect(screen.getByText(/Descrição do Workshop Teste/i)).toBeInTheDocument();
            expect(screen.getByText(/Aluno 1/i)).toBeInTheDocument();
            expect(screen.getByText(/Aluno 2/i)).toBeInTheDocument();
        });
    });

    it("displays a redirect message when token is missing", async () => {
        localStorage.removeItem("token"); // Remove o token

        render(
            <MemoryRouter initialEntries={["/workshop-details/1"]}>
                <Routes>
                    <Route path="/workshop-details/:id" element={<WorkshopDetailsPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Aguarda a exibição da mensagem de redirecionamento
        await waitFor(() => {
            expect(screen.getByText(/Token não encontrado. Faça login novamente./i)).toBeInTheDocument();
        });

        // Verifica se o botão "OK" está presente
        expect(screen.getByRole("button", { name: /OK/i })).toBeInTheDocument();
    });

    it("displays a not found message for invalid workshop ID", async () => {
        api.getWorkshopById.mockRejectedValueOnce(new Error("404"));

        render(
            <MemoryRouter initialEntries={["/workshop-details/1"]}>
                <Routes>
                    <Route path="/workshop-details/:id" element={<WorkshopDetailsPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Aguarda a exibição da mensagem de erro
        await waitFor(() => {
            expect(screen.getByText(/Workshop não encontrado. Redirecionando para a página inicial.../i)).toBeInTheDocument();
        });

        // Verifica se o botão "OK" está presente
        expect(screen.getByRole("button", { name: /OK/i })).toBeInTheDocument();
    });

    it("handles other API errors gracefully", async () => {
        api.getWorkshopById.mockRejectedValueOnce(new Error("Erro interno"));

        render(
            <MemoryRouter initialEntries={["/workshop-details/1"]}>
                <Routes>
                    <Route path="/workshop-details/:id" element={<WorkshopDetailsPage />} />
                </Routes>
            </MemoryRouter>
        );

        // Aguarda a exibição da mensagem de erro genérica
        await waitFor(() => {
            expect(screen.getByText(/Erro ao carregar os detalhes do workshop./i)).toBeInTheDocument();
        });

        // Verifica se o botão "OK" está presente
        expect(screen.getByRole("button", { name: /OK/i })).toBeInTheDocument();
    });
});

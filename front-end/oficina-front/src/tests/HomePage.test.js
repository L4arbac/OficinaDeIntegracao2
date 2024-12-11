import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
//import { MemoryRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import * as api from "../services/api"; // Importa o mock das APIs
import "@testing-library/jest-dom"; // Para matchers como "toBeInTheDocument"

jest.mock("../services/api"); // Mocka a API de serviços

describe("HomePage", () => {
    const mockWorkshops = [
        {
            id: 1,
            name: "Workshop A",
            description: "Descrição do Workshop A",
            createdAt: "2023-12-01",
            students: [{ id: 1 }, { id: 2 }],
        },
        {
            id: 2,
            name: "Workshop B",
            description: "Descrição do Workshop B",
            createdAt: "2023-11-01",
            students: [{ id: 3 }],
        },
    ];

    beforeEach(() => {
        localStorage.setItem("token", "mock.token.value"); // Define um token mockado
    });

    afterEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it("renders the page with workshops when API call succeeds", async () => {
        api.listWorkshops.mockResolvedValueOnce(mockWorkshops);

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        expect(screen.getByText("Workshops")).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText("Workshop A")).toBeInTheDocument();
            expect(screen.getByText("Workshop B")).toBeInTheDocument();
        });
    });

    it("shows an error message if no token is found", async () => {
        localStorage.clear(); // Remove o token

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        expect(screen.getByText(/Token não encontrado/)).toBeInTheDocument();
    });

    it("filters workshops based on search query", async () => {
        api.listWorkshops.mockResolvedValueOnce(mockWorkshops);

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Workshop A")).toBeInTheDocument();
            expect(screen.getByText("Workshop B")).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText("Pesquisar workshops por nome...");
        fireEvent.change(searchInput, { target: { value: "A" } });

        await waitFor(() => {
            expect(screen.getByText("Workshop A")).toBeInTheDocument();
            expect(screen.queryByText("Workshop B")).not.toBeInTheDocument();
        });
    });

    it("shows an error message if no workshops are found", async () => {
        api.listWorkshops.mockResolvedValueOnce([]);

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Nenhum workshop disponível.")).toBeInTheDocument();
        });
    });

    it("handles API errors and displays appropriate messages", async () => {
        api.listWorkshops.mockRejectedValueOnce(new Error("401 Unauthorized"));

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(
                screen.getByText("Não autorizado. Faça login novamente.")
            ).toBeInTheDocument();
        });
    });

    it("redirects to login when token or authentication fails", async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require("react-router-dom"), "useNavigate").mockImplementation(() => mockNavigate);

        render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/");
        });
    });
});

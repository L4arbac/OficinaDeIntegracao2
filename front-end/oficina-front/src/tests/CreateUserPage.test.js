import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import CreateUserPage from "../CreateUserPage";
import { register } from "../services/api";

jest.mock("../services/api", () => ({
    register: jest.fn(),
}));

describe("CreateUserPage", () => {
    const setup = () => {
        return render(
            <BrowserRouter>
                <CreateUserPage />
            </BrowserRouter>
        );
    };

    it("deve renderizar corretamente o formulário", () => {
        setup();

        expect(screen.getByText("Registrar Novo Usuário")).toBeInTheDocument();
        expect(screen.getByLabelText(/Nome/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Senha/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Tipo de Usuário/)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Registrar Usuário/ })).toBeInTheDocument();
    });

    it("deve exibir campos RA e Curso ao selecionar 'Professor' como tipo de usuário", () => {
        setup();

        fireEvent.change(screen.getByLabelText(/Tipo de Usuário/), {
            target: { value: "professor" },
        });

        expect(screen.getByLabelText(/RA/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Curso/)).toBeInTheDocument();
    });

    it("não deve exibir campos RA e Curso para outros tipos de usuário", () => {
        setup();

        fireEvent.change(screen.getByLabelText(/Tipo de Usuário/), {
            target: { value: "admin" },
        });

        expect(screen.queryByLabelText(/RA/)).not.toBeInTheDocument();
        expect(screen.queryByLabelText(/Curso/)).not.toBeInTheDocument();
    });

    it("deve chamar a API com os dados corretos ao registrar um admin", async () => {
        register.mockResolvedValueOnce({});
        setup();

        fireEvent.change(screen.getByLabelText(/Nome/), { target: { value: "Admin User" } });
        fireEvent.change(screen.getByLabelText(/Email/), { target: { value: "admin@example.com" } });
        fireEvent.change(screen.getByLabelText(/Senha/), { target: { value: "12345" } });
        fireEvent.change(screen.getByLabelText(/Tipo de Usuário/), {
            target: { value: "admin" },
        });

        fireEvent.click(screen.getByRole("button", { name: /Registrar Usuário/ }));

        await waitFor(() => {
            expect(register).toHaveBeenCalledWith(
                {
                    name: "Admin User",
                    email: "admin@example.com",
                    password: "12345",
                    role: "admin",
                    RA: null,
                    curso: null,
                },
                expect.any(String)
            );
        });

        expect(screen.getByText(/Usuário registrado com sucesso!/)).toBeInTheDocument();
    });

    it("deve chamar a API com os dados corretos ao registrar um professor", async () => {
        register.mockResolvedValueOnce({});
        setup();

        fireEvent.change(screen.getByLabelText(/Nome/), { target: { value: "Professor User" } });
        fireEvent.change(screen.getByLabelText(/Email/), { target: { value: "professor@example.com" } });
        fireEvent.change(screen.getByLabelText(/Senha/), { target: { value: "12345" } });
        fireEvent.change(screen.getByLabelText(/Tipo de Usuário/), {
            target: { value: "professor" },
        });
        fireEvent.change(screen.getByLabelText(/RA/), { target: { value: "123456" } });
        fireEvent.change(screen.getByLabelText(/Curso/), { target: { value: "Engenharia" } });

        fireEvent.click(screen.getByRole("button", { name: /Registrar Usuário/ }));

        await waitFor(() => {
            expect(register).toHaveBeenCalledWith(
                {
                    name: "Professor User",
                    email: "professor@example.com",
                    password: "12345",
                    role: "professor",
                    RA: "123456",
                    curso: "Engenharia",
                },
                expect.any(String)
            );
        });

        expect(screen.getByText(/Usuário registrado com sucesso!/)).toBeInTheDocument();
    });

    it("deve exibir mensagem de erro ao falhar no registro", async () => {
        register.mockRejectedValueOnce(new Error("Erro ao registrar o usuário"));
        setup();

        fireEvent.change(screen.getByLabelText(/Nome/), { target: { value: "Test User" } });
        fireEvent.change(screen.getByLabelText(/Email/), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText(/Senha/), { target: { value: "12345" } });
        fireEvent.change(screen.getByLabelText(/Tipo de Usuário/), {
            target: { value: "admin" },
        });

        fireEvent.click(screen.getByRole("button", { name: /Registrar Usuário/ }));

        await waitFor(() => {
            expect(screen.getByText(/Erro ao registrar o usuário/)).toBeInTheDocument();
        });
    });
});
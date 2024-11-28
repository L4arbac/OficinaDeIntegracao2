const API_URL = "http://localhost:3000"; // URL base do backend

// Função genérica para chamadas à API
export const apiRequest = async (endpoint, method = "GET", body = null) => {
    const headers = {
        "Content-Type": "application/json",
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao conectar à API");
        }

        return await response.json();
    } catch (error) {
        console.error("Erro ao conectar ao servidor.", error);
        throw error;
    }
};

// Serviço para login
export const login = async (email, password) => {
    return await apiRequest("/login", "POST", { email, password });
};

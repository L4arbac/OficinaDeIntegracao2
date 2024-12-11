const API_URL = "http://localhost:3000"; 

export const apiRequest = async (endpoint, method = "GET", body = null,token = null) => {
    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = token;
    }

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

//#region Users

// Serviço para login
export const login = async (email, password) => {
    return await apiRequest("/login", "POST", { email, password });
};
// Serviço para registrar um novo usuário
export const register = async (formData, token) => {
    return await apiRequest("/register", "POST", formData, {
        Authorization: `Bearer ${token}`,
    });
};



// Serviço para listar professores
export const listProfessors = async (token) => {
    return await apiRequest("/listProfessor", "GET", null, token);
};

// Serviço para listar alunos
export const listStudents = async (token) => {
    return await apiRequest("/listStudents", "GET", null, token);
};
//#endregion

//#region WORKSHOP

// Serviço para criar um workshop
export const createWorkshop = async (workshopData, token) => {
    return await apiRequest("/workshops", "POST", workshopData, token);
};

// Serviço para listar workshops
export const listWorkshops = async (token) => {
    return await apiRequest("/workshops", "GET", null, token);
};

// Serviço para obter detalhes de um workshop pelo ID
export const getWorkshopById = async (id, token) => {
    return await apiRequest(`/workshops/${id}`, "GET", null, token);
};

// Serviço para adicionar estudantes a um workshop
export const addStudents = async (studentData, token) => {
    return await apiRequest("/workshops/students", "POST", studentData, token);
};

// Serviço para remover um estudante de um workshop
export const removeStudent = async (studentData, token) => {
    return await apiRequest("/workshops/students", "DELETE", studentData, token);
};

// Serviço para finalizar um workshop
export const finalizeWorkshop = async (id, token) => {
    return await apiRequest(`/workshops/${id}/finalize`, "POST", null, token);
};

//#endregion


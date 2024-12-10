import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header/Header";
import { createWorkshop, listProfessors } from "../services/api";

const CreateWorkshopPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        professorId: "",
    });
    const [professors, setProfessors] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfessors = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setErrorMessage("Token não encontrado. Faça login novamente.");
                return;
            }

            try {
                const data = await listProfessors(token);
                setProfessors(data);
            } catch (error) {
                setErrorMessage("Erro ao carregar a lista de professores.");
            }
        };

        fetchProfessors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Token não encontrado. Faça login novamente.");
            }

            await createWorkshop(formData, token);
            setSuccessMessage("Workshop criado com sucesso!");
            setTimeout(() => navigate("/home"), 2000);
        } catch (error) {
            setErrorMessage(
                error.message || "Erro ao criar o workshop. Tente novamente."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div style={styles.fullScreen}>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <h1 style={styles.title}>Criar Novo Workshop</h1>
                    <p style={styles.subtitle}>
                        Preencha as informações abaixo para criar um workshop.
                    </p>
                    {errorMessage && (
                        <div style={styles.error}>{errorMessage}</div>
                    )}
                    {successMessage && (
                        <div style={styles.success}>{successMessage}</div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nome do Workshop</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Digite o nome do workshop"
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Professor</label>
                        <select
                            name="professorId"
                            value={formData.professorId}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        >
                            <option value="">Selecione um professor</option>
                            {professors.map((professor) => (
                                <option key={professor.id} value={professor.id}>
                                    {professor.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Descrição</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Digite a descrição do workshop"
                            style={styles.textarea}
                            required
                        />
                    </div>
                    
                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? "Criando..." : "Criar Workshop"}
                    </button>
                </form>
            </div>
        </>
    );
};

const styles = {
    fullScreen: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh", // Ocupa toda a altura da tela
        width: "100%", // Garante que não exceda a largura da tela
        backgroundColor: "#f4f4f9",
        padding: "20px",
        boxSizing: "border-box", // Inclui padding no cálculo da largura
      
    },
    form: {
        width: "100%",
        maxWidth: "600px", // Limita a largura máxima para formulários legíveis
        backgroundColor: "#fff",
        borderRadius: "10px",
        padding: "30px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
        boxSizing: "border-box", // Ajusta para padding no tamanho total
    },
    title: {
        fontSize: "24px",
        fontWeight: "700",
        color: "#012A60",
        marginBottom: "10px",
        textAlign: "center",
    },
    subtitle: {
        fontSize: "16px",
        color: "#666",
        marginBottom: "20px",
        textAlign: "center",
    },
    inputGroup: {
        marginBottom: "15px",
    },
    label: {
        fontSize: "14px",
        fontWeight: "600",
        marginBottom: "5px",
        color: "#012A60",
        display: "block",
    },
    input: {
        width: "100%",
        padding: "10px",
        fontSize: "14px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxSizing: "border-box",
    },
    textarea: {
        width: "100%",
        padding: "10px",
        fontSize: "14px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxSizing: "border-box",
        resize: "none",
    },
    button: {
        width: "80%",
        marginLeft:'10%',
        padding: "15px",
        backgroundColor: "#012A60",
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: "700",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        textAlign: "center",
        alignSelf: "center",
    },
    error: {
        color: "#842029",
        backgroundColor: "#f8d7da",
        border: "1px solid #f5c2c7",
        borderRadius: "5px",
        padding: "10px",
        textAlign: "center",
        marginBottom: "15px",
    },
    success: {
        color: "#0f5132",
        backgroundColor: "#d1e7dd",
        border: "1px solid #badbcc",
        borderRadius: "5px",
        padding: "10px",
        textAlign: "center",
        marginBottom: "15px",
    },
};


export default CreateWorkshopPage;

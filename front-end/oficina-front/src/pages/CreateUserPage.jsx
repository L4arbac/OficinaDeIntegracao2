import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header/Header";
import { register } from "../services/api";

const CreateUserPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        RA: null,
        curso: null,
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

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

            const submissionData = { ...formData };

            // Se não for professor, RA e Curso devem ser null
            if (formData.role !== "professor") {
                submissionData.RA = null;
                submissionData.curso = null;
            }

            await register(submissionData, token);
            setSuccessMessage("Usuário registrado com sucesso!");
            setTimeout(() => navigate("/home"), 2000);
        } catch (error) {
            setErrorMessage(
                error.message || "Erro ao registrar o usuário. Tente novamente."
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
                    <h1 style={styles.title}>Registrar Novo Usuário</h1>
                    <p style={styles.subtitle}>
                        Preencha as informações abaixo para registrar um novo usuário.
                    </p>
                    {errorMessage && (
                        <div style={styles.error}>{errorMessage}</div>
                    )}
                    {successMessage && (
                        <div style={styles.success}>{successMessage}</div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Nome</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Digite o nome"
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Digite o email"
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Senha</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Digite a senha"
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Tipo de Usuário</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        >
                            <option value="">Selecione o tipo de usuário</option>
                            <option value="admin">Admin</option>
                            <option value="professor">Professor</option>
                            <option value="user">Aluno</option>
                        </select>
                    </div>

                    {formData.role === "professor" && (
                        <>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>RA</label>
                                <input
                                    type="text"
                                    name="RA"
                                    value={formData.RA || ""}
                                    onChange={handleChange}
                                    placeholder="Digite o RA"
                                    style={styles.input}
                                    required
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Curso</label>
                                <input
                                    type="text"
                                    name="curso"
                                    value={formData.curso || ""}
                                    onChange={handleChange}
                                    placeholder="Digite o Curso"
                                    style={styles.input}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? "Registrando..." : "Registrar Usuário"}
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
        height: "100vh",
        width: "100%",
        backgroundColor: "#f4f4f9",
        padding: "20px",
        boxSizing: "border-box",
    },
    form: {
        width: "100%",
        maxWidth: "600px",
        backgroundColor: "#fff",
        borderRadius: "10px",
        padding: "30px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
        boxSizing: "border-box",
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
    button: {
        width: "80%",
        marginLeft: "10%",
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

export default CreateUserPage;

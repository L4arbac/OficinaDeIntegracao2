import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import InputField from "../components/common/InputField/InputField";
import SubmitButton from "../components/common/SubmitButton/SubmitButton";
import ellpLogo from "../assets/images/logo-navbar.png";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            localStorage.setItem("token", data.token);
            setError(null);
            navigate("/home");
        } catch (err) {
            setError(err.message || "Erro ao tentar fazer login. Tente novamente mais tarde.");
        }
    };

    return (
        <div style={styles.pageWrapper}>
            <div style={styles.container}>
                <h2 style={styles.title}>Bem-vindo à plataforma ELLP!</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    {error && <p style={styles.error}>{error}</p>}
                    <InputField
                        label="Email:"
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <InputField
                        label="Senha:"
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <SubmitButton id="botaoEnviar">Entrar</SubmitButton>
                </form>
            </div>
            <div style={styles.imageContainer}>
                <img
                    src={ellpLogo}
                    alt="Imagem descritiva"
                    style={styles.image}
                />
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: {
        display: "flex",
        alignItems: "stretch",
        height: "100vh",
        backgroundColor: "#012A60",
    },
    container: {
        flex: 0.6,
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderRadius: "0",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
    title: {
        marginBottom: "20%",
        marginTop: "-10%",
        fontSize: "25px",
        fontWeight: "bold",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    error: {
        color: "red",
        fontSize: "14px",
    },
    imageContainer: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        maxWidth: "90%",
        maxHeight: "90%",
        borderRadius: "10px",
        objectFit: "cover",
    },
};

export default LoginPage;

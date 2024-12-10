import React from "react";
import Header from "../components/common/Header/Header";

const RegisterUserPage = () => {
    return (
        <>
            <Header userName="Usuário Atual" />
            <div style={styles.container}>
                <h1>Registrar Novo Usuário</h1>
                {/* Conteúdo da página */}
            </div>
        </>
    );
};

const styles = {
    container: {
        marginTop: "80px", // Compensa o cabeçalho fixo
        padding: "20px",
    },
};

export default RegisterUserPage;

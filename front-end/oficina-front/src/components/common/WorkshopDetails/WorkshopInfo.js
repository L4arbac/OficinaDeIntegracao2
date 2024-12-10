import React from "react";

const WorkshopInfo = ({ workshop }) => {
    return (
        <section style={styles.infoSection}>
            <div style={styles.infoBlock}>
                <h2 style={styles.infoTitle}>Informações Gerais</h2>
                <p><strong>Status:</strong> {workshop.status}</p>
                <p><strong>Data de Criação:</strong> {new Date(workshop.createdAt).toLocaleDateString()}</p>
                <p><strong>Última Atualização:</strong> {new Date(workshop.updatedAt).toLocaleDateString()}</p>
            </div>
            <div style={styles.infoBlock}>
                <h2 style={styles.infoTitle}>Professor</h2>
                <p><strong>Nome:</strong> {workshop.professor.name}</p>
                <p><strong>Email:</strong> {workshop.professor.email}</p>
            </div>
        </section>
    );
};

const styles = {
    infoSection: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "30px",
        gap: "20px",
    },
    infoBlock: {
        flex: 1,
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    infoTitle: {
        fontSize: "22px",
        fontWeight: "bold",
        color: "#012A60",
        marginBottom: "15px",
    },
};

export default WorkshopInfo;

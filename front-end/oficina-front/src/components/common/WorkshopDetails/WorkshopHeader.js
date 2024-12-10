import React from "react";
import { FaCheck } from "react-icons/fa"; 
import {finalizeWorkshop  } from "../../../services/api";

const WorkshopHeader = ({ name, description,idWorkshop }) => {
    const token = localStorage.getItem("token");
    let userRole = null;

    // Decodifica o token para verificar a role
    if (token) {
        try {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            userRole = decodedToken.role;
        } catch (error) {
            console.error("Erro ao decodificar o token:", error);
        }
    }

    const handleFinalizeWorkshop = () => {
        
        finalizeWorkshop(idWorkshop,token);
    };

    return (
        <section style={styles.headerSection}>
            <div style={styles.headerContent}>
                {/* Ícone dentro de um círculo branco, visível para admin/professor */}
                {(userRole === "admin" || userRole === "professor") && (
                    <div
                        style={styles.finalizeButton}
                        onClick={handleFinalizeWorkshop}
                    >
                        <FaCheck style={styles.finalizeIcon} />
                    </div>
                )}
                {/* Título e descrição centralizados */}
                <div>
                    <h1 style={styles.workshopTitle}>{name}</h1>
                    <p style={styles.workshopDescription}>{description}</p>
                </div>
            </div>
        </section>
    );
};

const styles = {
    headerSection: {
        position: "relative", // Para posicionar o ícone
        textAlign: "center",
        marginBottom: "30px",
        padding: "20px",
        backgroundColor: "#012A60",
        color: "#fff",
        borderRadius: "10px",
    },
    headerContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    workshopTitle: {
        fontSize: "36px",
        fontWeight: "bold",
    },
    workshopDescription: {
        fontSize: "18px",
        marginTop: "10px",
    },
    finalizeButton: {
        position: "absolute",
        top: "20px",
        right: "20px",
        backgroundColor: "#28a745",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra para destacar
        cursor: "pointer",
        transition: "transform 0.2s ease",
    },
    finalizeButtonHover: {
        transform: "scale(1.1)", // Leve aumento no hover
    },
    finalizeIcon: {
        color: "#fff", // Ícone verde
        fontSize: "20px", 
    },
};

export default WorkshopHeader;

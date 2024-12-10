import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const WorkshopCard = ({ title, description, date, id, studentsLenght }) => {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/workshop-details/${id}`);
    };

    return (
        <div
            style={{
                ...styles.card,
                backgroundColor: isHovered ? "#FAFAFA" : "#fff",
                boxShadow: isHovered
                    ? "0 8px 16px rgba(0, 0, 0, 0.15)"
                    : "0 4px 8px rgba(0, 0, 0, 0.1)",
                transform: isHovered ? "scale(1.02)" : "scale(1)",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
        >
            <div style={styles.titleContainer}>
                <h3 style={styles.title}>{title}</h3>
            </div>
            <div style={styles.descriptionContainer}>
                <p style={styles.description}>{description}</p>
            </div>
            <p style={styles.date}>
                Data: <strong>{new Date(date).toLocaleDateString()}</strong>
            </p>
            <p style={styles.students}>
                Alunos matriculados: <strong>{studentsLenght}</strong>
            </p>
        </div>
    );
};

const styles = {
    card: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "pointer",
    },
    titleContainer: {
        height: "50px", // Altura fixa para o título
        overflow: "hidden",
        marginBottom: "10px",
    },
    title: {
        fontSize: "20px",
        fontWeight: "800",
        color: "#012A60",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis", // Reticências para títulos longos
    },
    descriptionContainer: {
        height: "100px", // Altura fixa para a descrição
        overflowY: "auto", // Adiciona barra de rolagem para conteúdos grandes
        marginBottom: "15px",
    },
    description: {
        fontSize: "14px",
        color: "#555",
        lineHeight: "1.5",
    },
    date: {
        fontSize: "14px",
        color: "#888",
    },
    students: {
        fontSize: "14px",
        color: "#888",
    },
};

export default WorkshopCard;

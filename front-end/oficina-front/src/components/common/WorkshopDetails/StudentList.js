import React, { useEffect, useState } from "react";
import StudentCard from "./StudentCard";

const StudentList = ({ students, idWorkshop }) => {
    const [showAddCard, setShowAddCard] = useState(false);
    const [userRole, setUserRole] = useState(""); // Estado para armazenar a role do usuário
    const [userName, setUserName] = useState(""); // Estado para armazenar o nome do usuário logado

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decodifica o token
                const { role, name } = decodedToken; // Obtém role e nome do usuário logado

                setUserRole(role); 
                setUserName(name);

                if (role === "admin" || role === "professor") {
                    setShowAddCard(true);
                }
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    return (
        <section style={styles.studentSection}>
            <h2 style={styles.studentTitle}>Alunos Inscritos</h2>
            {students.length > 0 ? (
                <div style={styles.studentGrid}>
                    {/* Lista os estudantes */}
                    {students.map((student) => (
                        <StudentCard
                            key={student.id}
                            name={student.name}
                            email={student.email}
                            studentId={student.id}
                            workshopId={idWorkshop}
                            userRole={userRole} // Agora passamos a role do usuário logado
                            userName={userName} // Passamos o nome do usuário logado
                        />
                    ))}

                    {/* Card de adicionar aluno */}
                    {showAddCard && (
                        <StudentCard
                            isAddCard={true}
                            workshopId={idWorkshop}
                        />
                    )}
                </div>
            ) : (
                <p style={styles.noStudents}>Nenhum aluno inscrito.</p>
            )}
        </section>
    );
};

const styles = {
    studentSection: {
        marginTop: "30px",
    },
    studentTitle: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#012A60",
        marginBottom: "20px",
    },
    studentGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px",
    },
    addCard: {
        
        backgroundColor: "#fff",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        cursor: "pointer", // Indica interatividade
        
    },
    addIcon: {
        fontSize: "32px",
        color: "#012A60",
        marginBottom: "10px",
    },
    addText: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#012A60",
    },
    addCardHover: {
        transform: "scale(1.05)",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
    },
    noStudents: {
        textAlign: "center",
        fontSize: "18px",
        color: "#888",
    },
};

export default StudentList;

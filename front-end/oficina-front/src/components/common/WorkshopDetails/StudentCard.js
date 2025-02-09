import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { removeStudent, addStudents, listStudents } from "../../../services/api";

const StudentCard = ({ name, email, isAddCard = false, studentId, workshopId, userRole, userName }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showDeleteIcon, setShowDeleteIcon] = useState(false);
    const [showModal, setShowModal] = useState(false); // Modal para deletar
    const [showAddModal, setShowAddModal] = useState(false); // Modal para adicionar
    const [feedbackMessage, setFeedbackMessage] = useState(null); // Feedback
    const [students, setStudents] = useState([]); // Lista de estudantes
    const [selectedStudentId, setSelectedStudentId] = useState(""); // ID do estudante selecionado

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decodifica o token
                const { role } = decodedToken;

                if (role === "admin" || role === "professor") {
                    setShowDeleteIcon(true); // Exibe ícones de controle
                }
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
            }
        }
    }, []);

    // Função para buscar a lista de estudantes disponíveis
    const fetchStudents = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token não encontrado.");
            return;
        }

        try {
            const data = await listStudents(token);
            setStudents(data);
        } catch (error) {
            console.error("Erro ao listar estudantes:", error);
        }
    };

    // Função para adicionar estudante ao workshop
const handleAddStudent = async () => {
    const token = localStorage.getItem("token");

    if (!token || isNaN(selectedStudentId)) {
        setFeedbackMessage({ type: "error", text: "Selecione um estudante válido." });
        return;
    }

    try {
        await addStudents({ selectedStudentId, workshopId }, token);
        setFeedbackMessage({ type: "success", text: "Estudante adicionado com sucesso!" });
        setTimeout(() => {
            window.location.reload(); // Recarrega a página
        }, 2000);
        setShowAddModal(false); // Fecha o modal de adicionar
    } catch (error) {
        // Tenta capturar a mensagem do backend
        let errorMessage;
        if (error.response) {
            // Caso esteja usando Axios ou uma biblioteca que retorne `response`
            errorMessage = error.response.data?.message || "Erro desconhecido.";
        } else if (error.json) {
            // Caso esteja usando fetch e o backend retorne JSON
            const errorData = await error.json();
            errorMessage = errorData?.message || "Erro desconhecido.";
        } else {
            errorMessage = error.message || "Erro ao adicionar estudante. Tente novamente.";
        }
        setFeedbackMessage({ type: "error", text: errorMessage });
        console.error("Erro ao adicionar estudante:", error);
        setTimeout(() => {
            window.location.reload(); // Recarrega a página
        }, 2000);
    }
};

const handleGenerateStudentCertificate = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            return alert("Token não encontrado. Faça login novamente.");
        }

        const response = await fetch(`http://localhost:3000/workshops/${workshopId}/certificates`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.log("Erro na requisição:", response.status);
            throw new Error("Erro ao listar os certificados.");
        }

        const pdfFiles = await response.json();
        console.log("Arquivos recebidos:", pdfFiles);

        if (!Array.isArray(pdfFiles) || pdfFiles.length === 0) {
            return alert("Nenhum certificado disponível para download.");
        }

        // Filtra o certificado específico do aluno do card
        const studentCertificate = pdfFiles.find(file => file.name.includes(name));

        if (!studentCertificate) {
            return alert(`Nenhum certificado encontrado para ${name}.`);
        }

        // Realiza o download do certificado do aluno específico
        const link = document.createElement("a");
        link.href = studentCertificate.url;
        link.download = studentCertificate.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error("Erro ao obter certificados:", error);
        alert(error.message);
    }
};



    // Função para excluir estudante
    const handleDeleteStudent = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token não encontrado.");
            setFeedbackMessage({ type: "error", text: "Token não encontrado." });
            return;
        }

        try {
            await removeStudent({ studentId, workshopId }, token);
            setFeedbackMessage({ type: "success", text: "Estudante removido com sucesso!" });
            setTimeout(() => {
                window.location.reload(); // Recarrega a página
            }, 2000);
            setShowModal(false); // Fecha o modal de deletar
        } catch (error) {
            console.error("Erro ao remover estudante:", error);
            setFeedbackMessage({ type: "error", text: "Erro ao remover estudante. Tente novamente." });
        }
    };

    const cardStyle = {
        ...styles.card,
        backgroundColor: isHovered ? "#F7F7F7" : "#fff",
        boxShadow: isHovered
            ? "0 8px 16px rgba(0, 0, 0, 0.15)" // Sombra mais intensa no hover
            : "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra padrão
        transform: isHovered ? "scale(1.02)" : "scale(1)", // Aumento suave no hover
        transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
        cursor: isAddCard ? "pointer" : "default",
    };

    return (
        <>
            <div
                style={cardStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={isAddCard ? () => { setShowAddModal(true); fetchStudents(); } : undefined}
            >
                {isAddCard ? (
                    <div style={styles.addCardContent}>
                        <FaPlus style={styles.addIcon} />
                        <p style={styles.addText}>Adicionar Aluno</p>
                    </div>
                ) : (
                    <>
                        <h3 style={styles.name}>{name}</h3>
                        <p style={styles.email}>
                            <strong>Email:</strong> {email}
                        </p>
                        {showDeleteIcon && (
                            <FaTrash
                                style={styles.deleteIcon}
                                onClick={(e) => {
                                    e.stopPropagation(); // Impede o clique de propagar para o card
                                    setShowModal(true); // Abre o modal de deletar
                                }}
                            />
                        )}
                        {/* Exibe o botão "Gerar Certificado" se o usuário for admin, professor ou for o próprio aluno */}
                        {(userRole === "admin" || userRole === "professor" || userName === name) && (
                            <button style={styles.downloadButton} onClick={handleGenerateStudentCertificate}>
                                Gerar Certificado
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Modal de Adicionar Estudante */}
            {showAddModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h3>Adicionar Estudante</h3>
                        <select
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                            style={styles.select}
                        >
                            <option value="">Selecione um estudante</option>
                            {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.name}
                                </option>
                            ))}
                        </select>
                        <div style={styles.modalActions}>
                            <button
                                style={{ ...styles.modalButton, backgroundColor: "#5cb85c" }}
                                onClick={handleAddStudent}
                            >
                                Confirmar
                            </button>
                            <button
                                style={{ ...styles.modalButton, backgroundColor: "#5bc0de" }}
                                onClick={() => setShowAddModal(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Exclusão */}
            {showModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <p>Tem certeza que deseja remover este estudante?</p>
                        <div style={styles.modalActions}>
                            <button
                                style={{ ...styles.modalButton, backgroundColor: "#d9534f" }}
                                onClick={handleDeleteStudent}
                            >
                                Confirmar
                            </button>
                            <button
                                style={{ ...styles.modalButton, backgroundColor: "#5bc0de" }}
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mensagem de Feedback */}
            {feedbackMessage && (
                <div
                    style={{
                        ...styles.feedback,
                        backgroundColor: feedbackMessage.type === "success" ? "#d4edda" : "#f8d7da",
                        color: feedbackMessage.type === "success" ? "#155724" : "#721c24",
                    }}
                >
                    {feedbackMessage.text}
                </div>
            )}
        </>
    );
};

const styles = {
    card: {
        backgroundColor: "#fff",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        position: "relative",
    },
    name: {
        fontSize: "18px",
        fontWeight: "bold",
        marginBottom: "10px",
    },
    email: {
        fontSize: "14px",
        color: "#555",
    },
    addCardContent: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    addIcon: {
        fontSize: "32px",
        color: "#012A60",
        marginBottom: "10px",
    },
    downloadButton: {
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        padding: "10px 15px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
        transition: "background 0.3s",
        marginTop: "10px",
    },
    addText: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#012A60",
    },
    deleteIcon: {
        position: "absolute",
        top: "10px",
        right: "10px",
        fontSize: "20px",
        color: "#d9534f",
        cursor: "pointer",
        transition: "color 0.2s ease",
    },
    modal: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        width: "300px",
    },
    modalActions: {
        display: "flex",
        justifyContent: "space-around",
        marginTop: "20px",
    },
    modalButton: {
        padding: "10px 20px",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    feedback: {
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        padding: "10px 20px",
        borderRadius: "5px",
        fontSize: "16px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
    },
};

export default StudentCard;

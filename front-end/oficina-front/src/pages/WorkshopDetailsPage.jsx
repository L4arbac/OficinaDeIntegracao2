import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/common/Header/Header";
import { getWorkshopById, listCertificates } from "../services/api";
import WorkshopHeader from "../components/common/WorkshopDetails/WorkshopHeader";
import WorkshopInfo from "../components/common/WorkshopDetails/WorkshopInfo";
import StudentList from "../components/common/WorkshopDetails/StudentList";

const WorkshopDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workshop, setWorkshop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [redirectMessage, setRedirectMessage] = useState(null);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {

        const token = localStorage.getItem("token");

            const decodedToken = JSON.parse(atob(token.split(".")[1])); 
            var userRole = decodedToken.role;

            console.log(userRole);

            if(userRole === "admin" || userRole === "professor") {
                setShowButton(true);
            }
            console.log(showButton);

        const fetchWorkshop = async () => {
            
            
            if (!token) {
                setRedirectMessage("Token não encontrado. Faça login novamente.");
                return;
            }

            try {
                const data = await getWorkshopById(id, token);
                setWorkshop(data);
            } catch (err) {
                console.error("Erro ao carregar os detalhes do workshop:", err.message);

                if (err.message.includes("404")) {
                    setRedirectMessage("Workshop não encontrado. Redirecionando para a página inicial...");
                } else {
                    setRedirectMessage(err.message || "Erro ao carregar os detalhes do workshop.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchWorkshop();
    }, [id, showButton]);

    const handleRedirect = () => {
        navigate(redirectMessage.includes("Workshop não encontrado") ? "/home" : "/");
    };

    const handleGenerateCertificates = async () => {
        if (workshop?.status !== "finalizado") {
            return alert("O workshop ainda não foi finalizado!");
        }
    
        try {
            const token = localStorage.getItem("token");
    
            // Decodifica o token para obter o nome do usuário e a role
            const decodedToken = JSON.parse(atob(token.split(".")[1])); 
            var userName = decodedToken.name;  // Nome do usuário logado
            var userRole = decodedToken.role;  // Cargo do usuário (admin ou aluno)
    
            const response = await fetch(`http://localhost:3000/workshops/${workshop.id}/certificates`, {
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
    
            if (userRole === "admin" || userRole === "professor") {
                // 📌 ADMIN: Baixa TODOS os certificados
                pdfFiles.forEach((file, index) => {
                    setTimeout(() => {
                        const link = document.createElement("a");
                        link.href = file.url;
                        link.download = file.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }, index * 500); // Pequeno atraso entre os downloads
                });
    
            } else {
                // 📌 ALUNO: Baixa apenas o certificado correspondente ao seu nome
                const userCertificate = pdfFiles.find(file => file.name.includes(userName));
                
                if (!userCertificate) {
                    return alert("Nenhum certificado encontrado para seu nome.");
                }
    
                const link = document.createElement("a");
                link.href = userCertificate.url;
                link.download = userCertificate.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
    
        } catch (error) {
            console.error("Erro ao obter certificados:", error);
            alert(error.message);
        }
    };

    if (redirectMessage) {
        return (
            <>
                <Header />
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <p>{redirectMessage}</p>
                        <button style={styles.button} onClick={handleRedirect}>
                            OK
                        </button>
                    </div>
                </div>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <Header />
                <div style={styles.loading}>
                    <p>Carregando...</p>
                </div>
            </>
        );
    }

    if (!workshop) {
        return (
            <>
                <Header />
                <div style={styles.error}>
                    <p>Workshop não encontrado.</p>
                </div>
            </>
        );
    }

    const isFinalizado = workshop.status === "finalizado";

    return (
        <>
            <Header />
            <div style={styles.container}>
                <WorkshopHeader name={workshop.name} description={workshop.description} idWorkshop={workshop.id} />
                <WorkshopInfo workshop={workshop} />
                <StudentList students={workshop.students} idWorkshop={workshop.id} />

                {/* Botão Gerar Certificados */}
                {(showButton) && (
                <div style={styles.buttonContainer}>
                    <button
                        style={{
                            ...styles.button,
                            backgroundColor: isFinalizado ? "#28a745" : "#6c757d",
                            cursor: isFinalizado ? "pointer" : "not-allowed",
                        }}
                        onClick={handleGenerateCertificates}
                        disabled={!isFinalizado}
                    >
                        Gerar certificados
                    </button>
                </div>
                )}
            </div>
        </>
    );
};

const styles = {
    container: {
        marginTop: "70px",
        padding: "20px 40px",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
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
    },
    button: {
        fontSize: "18px",
        padding: "12px 24px",
        border: "none",
        borderRadius: "5px",
        fontWeight: "bold",
        textTransform: "uppercase",
        transition: "background 0.3s",
        color: "#fff",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
        marginBottom: "20px",
    },
    loading: {
        marginTop: "100px",
        textAlign: "center",
        color: "#555",
        fontSize: "18px",
    },
    error: {
        marginTop: "100px",
        textAlign: "center",
        color: "red",
        fontSize: "18px",
    },
};

export default WorkshopDetailsPage;

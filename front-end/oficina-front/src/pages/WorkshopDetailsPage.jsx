import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/common/Header/Header";
import { getWorkshopById } from "../services/api";
import WorkshopHeader from "../components/common/WorkshopDetails/WorkshopHeader";
import WorkshopInfo from "../components/common/WorkshopDetails/WorkshopInfo";
import StudentList from "../components/common/WorkshopDetails/StudentList";

const WorkshopDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workshop, setWorkshop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [redirectMessage, setRedirectMessage] = useState(null);

    useEffect(() => {
        const fetchWorkshop = async () => {
            const token = localStorage.getItem("token");
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
    }, [id]);

    const handleRedirect = () => {
        navigate(redirectMessage.includes("Workshop não encontrado") ? "/home" : "/");
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

    return (
        <>
            <Header />
            <div style={styles.container}>
                <WorkshopHeader name={workshop.name} description={workshop.description} idWorkshop={workshop.id} />
                <WorkshopInfo workshop={workshop} />
                <StudentList students={workshop.students} idWorkshop={workshop.id} />
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
        marginTop: "10px",
        padding: "10px 20px",
        backgroundColor: "#012A60",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
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

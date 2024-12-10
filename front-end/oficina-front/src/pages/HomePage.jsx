import React, { useEffect, useState } from "react";
import { listWorkshops } from "../services/api";
import Header from "../components/common/Header/Header";
import WorkshopCard from "../components/common/WorkshopCard/WorkshopCard";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const [workshops, setWorkshops] = useState([]);
    const [filteredWorkshops, setFilteredWorkshops] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const { name, id, role } = decodedToken;
                setUser({ name, id, role });
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
                setErrorMessage("Erro ao autenticar o usuário. Faça login novamente.");
            }
        } else {
            setErrorMessage("Token não encontrado. Faça login novamente.");
        }
    }, []);

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setErrorMessage("Token não encontrado. Faça login novamente.");
                    return;
                }
                const workshopsList = await listWorkshops(token);
                setWorkshops(workshopsList);
                setFilteredWorkshops(workshopsList); // Inicializa com todos os workshops
            } catch (error) {
                console.error("Erro ao listar workshops:", error);

                if (error.message.includes("404")) {
                    setErrorMessage("Nenhum workshop encontrado.");
                } else if (error.message.includes("401")) {
                    setErrorMessage("Não autorizado. Faça login novamente.");
                } else if (error.message.includes("403")) {
                    setErrorMessage("Acesso negado. Verifique suas permissões.");
                } else if (error.message.includes("500")) {
                    setErrorMessage("Erro interno do servidor. Tente novamente mais tarde.");
                } else {
                    setErrorMessage("Erro ao carregar os workshops.");
                }
            }
        };

        fetchWorkshops();
    }, []);

    useEffect(() => {
        if (errorMessage && (errorMessage.includes("Token") || errorMessage.includes("autenticar"))) {
            setTimeout(() => navigate("/"), 3000); // Redireciona após 3 segundos para login
        }
    }, [errorMessage, navigate]);

    // Filtra os workshops conforme o campo de pesquisa
    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filtered = workshops.filter((workshop) =>
            workshop.name.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredWorkshops(filtered);
    }, [searchQuery, workshops]);

    return (
        <div style={styles.container}>
            {user && <Header userName={user.name} />}
            <main style={styles.main}>
                <h2 style={styles.title}>Workshops</h2>

                {/* Campo de Pesquisa */}
                <div style={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Pesquisar workshops por nome..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>

                {/* Exibição de Erros */}
                {errorMessage && (
                    <div style={styles.errorContainer}>
                        <p style={styles.errorMessage}>{errorMessage}</p>
                    </div>
                )}

                {/* Lista de Workshops */}
                {!errorMessage && filteredWorkshops.length > 0 ? (
                    <div style={styles.grid}>
                        {filteredWorkshops.map((workshop) => (
                            <WorkshopCard
                                key={workshop.id}
                                title={workshop.name}
                                description={workshop.description}
                                date={workshop.createdAt}
                                id={workshop.id}
                                studentsLenght={workshop.students.length}
                            />
                        ))}
                    </div>
                ) : (
                    !errorMessage && (
                        <p style={styles.noWorkshops}>Nenhum workshop disponível.</p>
                    )
                )}
            </main>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: "'Inter', sans-serif",
        color: "#333",
        padding: "20px",
        backgroundColor: "#f4f4f9",
        minHeight: "100vh",
        paddingTop: "80px", // Espaço para o cabeçalho fixo
    },
    main: {
        marginTop: "20px",
    },
    title: {
        fontSize: "32px",
        fontWeight: "800",
        marginBottom: "20px",
        textAlign: "center",
        color: "#012A60",
    },
    searchContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "20px",
    },
    searchInput: {
        width: "80%",
        maxWidth: "600px",
        padding: "10px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxSizing: "border-box",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
    },
    noWorkshops: {
        textAlign: "center",
        fontSize: "18px",
        color: "#666",
    },
    errorContainer: {
        textAlign: "center",
        margin: "20px 0",
        padding: "10px",
        backgroundColor: "#f8d7da",
        border: "1px solid #f5c2c7",
        borderRadius: "8px",
    },
    errorMessage: {
        color: "#842029",
        fontSize: "16px",
    },
};

export default HomePage;

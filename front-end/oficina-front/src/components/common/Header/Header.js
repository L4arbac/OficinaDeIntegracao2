import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaUserCircle } from "react-icons/fa";
import logo from "../../../assets/images/logo-navbar.png"; // Importa o logo

const Header = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userName, setUserName] = useState("Usuário"); // Estado para armazenar o nome do usuário
    const dropdownRef = useRef();
    const navigate = useNavigate(); // Hook para redirecionar

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const closeDropdown = (event) => {
        // Fecha o dropdown somente se o clique for fora do dropdown
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove o token do localStorage
        navigate("/"); // Redireciona para a página de login
    };

    // Obtém o nome do usuário do token armazenado no localStorage
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decodifica a payload do JWT
                setUserName(decodedToken.name || "Usuário"); // Atualiza o estado com o nome do usuário
            } catch (error) {
                console.error("Erro ao decodificar o token:", error);
                setUserName("Usuário");
            }
        }
    }, []);

    useEffect(() => {
        // Adiciona evento global para fechar o dropdown ao clicar fora
        document.addEventListener("mousedown", closeDropdown);
        return () => {
            document.removeEventListener("mousedown", closeDropdown);
        };
    }, []);

    return (
        <header style={styles.header}>
            <div style={styles.container}>
                {/* Ícone de Home com o texto "ELLP" */}
                <div style={styles.homeSection}>
                    <Link to="/home" style={styles.homeLink}>
                        <FaHome style={styles.icon} />
                        <span style={styles.homeText}>ELLP</span>
                    </Link>
                </div>

                {/* Logo no centro */}
                <div style={styles.logoSection}>
                    <img src={logo} alt="ELLP Logo" style={styles.logo} />
                </div>

                {/* Nome do usuário com ícone e dropdown */}
                <div style={styles.userSection} ref={dropdownRef}>
                    <div
                        style={styles.userIconWrapper}
                        onClick={toggleDropdown}
                        tabIndex={0}
                    >
                        <FaUserCircle style={styles.userIcon} />
                        <span style={styles.userName}>{userName}</span>
                    </div>

                    {/* Dropdown */}
                    {dropdownOpen && (
                        <div style={styles.dropdown}>
                            <Link
                                to="/create-workshop"
                                style={styles.dropdownItem}
                                onClick={() => setDropdownOpen(false)}
                            >
                                Criar Workshop
                            </Link>
                            <Link
                                to="/register-user"
                                style={styles.dropdownItem}
                                onClick={() => setDropdownOpen(false)}
                            >
                                Novo Usuário
                            </Link>
                            <div
                                style={styles.dropdownItem}
                                onClick={handleLogout}
                            >
                                Logout
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const styles = {
    header: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: "#012A60",
        color: "#fff",
        height: "70px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    container: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
        padding: "0 20px",
    },
    homeSection: {
        display: "flex",
        alignItems: "center",
        position: "absolute",
        left: "20px",
    },
    homeLink: {
        textDecoration: "none",
        color: "#fff",
        display: "flex",
        alignItems: "center",
    },
    homeText: {
        fontSize: "24px",
        fontWeight: "bold",
        marginLeft: "12px",
    },
    icon: {
        fontSize: "30px",
    },
    logoSection: {
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
    },
    logo: {
        marginTop: "20px",
        height: "80px",
    },
    userSection: {
        position: "absolute",
        right: "20px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    userIconWrapper: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
    },
    userIcon: {
        fontSize: "30px",
        color: "#fff",
    },
    userName: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#fff",
        marginLeft:'12px',
    },
    dropdown: {
        position: "absolute",
        top: "100%",
        right: 0,
        backgroundColor: "#fff",
        color: "#012A60",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        overflow: "hidden",
        marginTop: "10px",
        zIndex: 1000,
    },
    dropdownItem: {
        display: "block",
        padding: "10px 15px",
        textDecoration: "none",
        color: "#012A60",
        fontSize: "14px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
    },
};

export default Header;

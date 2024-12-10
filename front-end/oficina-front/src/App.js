import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CreateWorkshopPage from "./pages/CreateWorkshopPage";
import RegisterUserPage from "./pages/RegisterUserPage";
import WorkshopDetailsPage from "./pages/WorkshopDetailsPage";
 

const App = () => {
  // Função para verificar se o usuário está autenticado
  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  return (
    <Router>
      <Routes>

        {/* Rota para a página de login */}
        <Route path="/" element={<LoginPage />} />

        {/* Rota para a página inicial (Home) - protegida por autenticação */}
        <Route
          path="/home"
          element={
            isAuthenticated() ? <HomePage /> : <Navigate to="/" replace />
          }
        />

        {/* Rota para criar um novo workshop - protegida por autenticação */}
        <Route
          path="/create-workshop"
          element={
            isAuthenticated() ? <CreateWorkshopPage /> : <Navigate to="/" replace />
          }
        />

        {/* Rota para cadastrar um novo usuário */}
        <Route path="/register-user" element={<RegisterUserPage />}/>

        <Route 
          path="/workshop-details/:id" 
          element={
            isAuthenticated() ?  <WorkshopDetailsPage /> : <Navigate to="/" replace />
          } 
        />

        {/* Rota para redirecionar caminhos inválidos para a página de login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../styles/Login.css";
import api from "../services/api";
import { salvarUsuario } from "../services/AuthUsuario"

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await api.get("/usuarios", {
        params: { email, senha }
      });

      const data = response.data;

      if (data.length > 0) {
        salvarUsuario(data[0]);
        navigate("/home");
      } else {
        setErro("E-mail ou senha inválidos.");
      }
    } catch (error) {
      setErro("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        {erro && <p className="erro">{erro}</p>}

        <Button type="submit" variant="primary">
          Entrar
        </Button>

        <p className="link-cadastro">
          Não tem uma conta? <a href="/cadastro">Cadastre-se</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
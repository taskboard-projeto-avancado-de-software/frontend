import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../styles/Cadastro.css";
import api from "../services/api";

const Cadastro = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      const response = await api.get(`/usuarios`, {
        params: { email }
      });
      const usuarios = response.data;

      if (usuarios.length > 0) {
        setErro("E-mail já cadastrado.");
        return;
      }

      await api.post("/usuarios", { nome, email, senha });

      navigate("/login");
    } catch (error) {
      setErro("Erro ao cadastrar. Tente novamente.");
    }
  };

  return (
    <div className="cadastro-container">
      <form onSubmit={handleCadastro} className="cadastro-form">
        <h2>Criar Conta</h2>

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

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

        <input
          type="password"
          placeholder="Confirmar Senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
        />

        {erro && <p className="erro">{erro}</p>}

        <Button type="submit" variant="success">
          Cadastrar
        </Button>

        <p className="link-login">
          Já tem uma conta? <a href="/login">Entrar</a>
        </p>
      </form>
    </div>
  );
};

export default Cadastro;
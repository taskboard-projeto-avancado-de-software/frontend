import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../styles/Cadastro.css";

const Cadastro = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleCadastro = async (e) => {
    e.preventDefault();

    const nomeRegex = /^[A-Za-zÀ-ÿ\s]+$/;

    if (!nomeRegex.test(nome)) {
      setErro("O nome deve conter apenas letras.");
      return;
    }

    if (nome.length > 50) {
      setErro("O nome deve ter no máximo 50 caracteres.");
      return;
    }

    if (senha.length < 8 || senha.length > 16) {
      setErro("A senha deve ter entre 8 e 16 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/usuarios?email=${email}`
      );
      const usuarios = await response.json();

      if (usuarios.length > 0) {
        setErro("E-mail já cadastrado.");
        return;
      }

      await fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

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

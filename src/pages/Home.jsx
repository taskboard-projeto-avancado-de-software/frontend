import React from 'react';
import { useNavigate } from 'react-router-dom';
import Listagem from './Listagem';
import '../styles/Home.css';
import { obterNome } from '../services/AuthUsuario';
import Button from '../components/Button';

function Home() {
  const navigate = useNavigate();

  const nome = obterNome().split(' ')[0];

  return (
    <div className="home-container">

      <div className="header">

        <h1 className="title">Taskify</h1>

        <div className="right-side">
          <span className="greeting">Olá, {nome}</span>

          <Button onClick={() => navigate('/pesquisar')}>
            Pesquisar Tarefa
          </Button>
          <Button onClick={() => navigate('/notificacoes')}>
            Notificações
          </Button>
          <Button onClick={() => navigate('/')}>
            Sair
          </Button>
        </div>
      </div>

      <Listagem />

    </div>
  );
}

export default Home;
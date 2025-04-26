import React from 'react';
import { useNavigate } from 'react-router-dom';
import Listagem from './Listagem';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">

      <div className="header">

        <h1 className="title">Home</h1>

        <div className="right-side">
          <span className="greeting">Olá,</span>
          <button className="header-button" onClick={() => navigate('/pesquisar')}>
            Pesquisar
          </button>
          <button className="header-button" onClick={() => navigate('/criar')}>
            Notificação
          </button>
        </div>
      </div>

      <Listagem />

    </div>
  );
}

export default Home;

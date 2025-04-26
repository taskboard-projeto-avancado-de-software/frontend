import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Cabecalho.css';

function Cabecalho() {
  const navigate = useNavigate();

  return (
    <div className="cabecalho">
      <button className="cabecalho-botao" onClick={() => navigate('/home')}>
        Voltar
      </button>

      <div className="cabecalho-direita">
        <span className="cabecalho-ola">Olá,</span>
      </div>
    </div>
  );
}

export default Cabecalho;

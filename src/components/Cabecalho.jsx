import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Cabecalho.css';
import { obterNome } from '../services/AuthUsuario'
import Button from '../components/Button';

function Cabecalho() {
  const navigate = useNavigate();
  const nome = obterNome();

  return (
    <div className="cabecalho">

      <Button variant='default' onClick={() => navigate('/home')}>
        Voltar
      </Button>

      <div className="cabecalho-direita">
      </div>
    </div>
  );
}

export default Cabecalho;

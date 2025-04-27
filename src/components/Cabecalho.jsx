import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Cabecalho.css';
import Button from '../components/Button';

function Cabecalho() {
  const navigate = useNavigate();

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

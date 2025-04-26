import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

function Editar() {

  const navigate = useNavigate();


  const { id } = useParams(); 
  const [tarefaAtual, setTarefaAtual] = useState({
    id: '',
    titulo: '',
    descricao: '',
    prioridade: '',
    prazo: '',
  });
  const [loading, setLoading] = useState(true); 

  // Função para lidar com mudanças nos na tarefa
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTarefaAtual((prevTarefa) => ({
      ...prevTarefa,
      [name]: value
    }));
  };

  // FUNÇÃO PARA CARREGAR AS TAREFAS E FILTRAR A QUE TIVER O ID COMPATÍVEL
  useEffect(() => {
    async function carregar() {
      setLoading(true); // Inicia o carregamento
      try {
        const tarefasCarregadas = await fetch('http://localhost:3000/tarefas');
        const dados = await tarefasCarregadas.json();
        const tarefaEncontrada = dados.find(tarefa => tarefa.id === parseInt(id));
        if (tarefaEncontrada) {
          setTarefaAtual(tarefaEncontrada); 
        }
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      } finally {
        setLoading(false); 
      }
    }
    carregar();
  }, [id]); 

  // FUNÇÃO PARA ATUALIZAR A TAREFA
  const handleSubmit = (e) => {
    e.preventDefault();
    const url = `http://localhost:3000/tarefas/${tarefaAtual.id}`;
    const method = 'PUT';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarefaAtual)
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Tarefa atualizada:', data);
      })
      .catch((error) => {
        console.error('Erro ao atualizar tarefa:', error);
      });

      navigate("/listar")

  };

  // FUNÇÃO PARA EXCLUIR UMA TAREFA COM CONFIRMAÇÃO
  const handleExcluir = (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta tarefa?");
    if (confirmDelete) {
      fetch(`http://localhost:3000/tarefas/${id}`, { method: 'DELETE' })
        .then((response) => response.json())
        .then(() => {
          console.log('Tarefa excluída com sucesso');
          
        })
        .catch((error) => {
          console.error('Erro ao excluir tarefa:', error);
        });
    }

    navigate("/listar")

  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="tarefas-container">
      <h2>Gerenciador de Tarefas</h2>

      {/* Formulário para editar tarefas */}
      <form onSubmit={handleSubmit} className="tarefa-form">
        <input
          type="text"
          name="titulo"
          value={tarefaAtual.titulo}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="descricao"
          value={tarefaAtual.descricao}
          onChange={handleInputChange}
        />
        <select
          name="prioridade"
          value={tarefaAtual.prioridade}
          onChange={handleInputChange}
        >
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>
        <input
          type="date"
          name="prazo"
          value={tarefaAtual.prazo}
          onChange={handleInputChange}
        />
        <button type="submit">Atualizar Tarefa</button>
        <button type="button" onClick={() => handleExcluir(tarefaAtual.id)}>
          Excluir
        </button>
      </form>
    </div>
  );
}

export default Editar;

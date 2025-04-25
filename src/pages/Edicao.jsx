import React, { useState, useEffect } from 'react';
import "../styles/Editar.css"


// BAIXAR TODAS AS TAREFAS E SELECIONAR APENAS A QUE SERA USANDA UNAS O FILTER

function Editar({tarefa}) {
  const [tarefaAtual, setTarefaAtual] = useState(tarefa); 

  // Função para lidar com mudanças nos inputs do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTarefaAtual((prevTarefa) => ({
      ...prevTarefa,
      [name]: value
    }));
  };

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
        // Pode adicionar algo aqui para lidar com a resposta (ex: redirecionar, exibir mensagem de sucesso, etc)
        console.log('Tarefa atualizada:', data);
      })
      .catch((error) => {
        console.error('Erro ao atualizar tarefa:', error);
      });
  };

  // Função para excluir uma tarefa
  const handleExcluir = (id) => {
    fetch(`http://localhost:3000/tarefas/${id}`, { method: 'DELETE' })
      .then((response) => response.json())
      .then(() => {
        // Lidar com a exclusão da tarefa (ex: redirecionar ou mostrar uma mensagem de sucesso)
        console.log('Tarefa excluída com sucesso');
      })
      .catch((error) => {
        console.error('Erro ao excluir tarefa:', error);
      });
  };

  // Verificando se a tarefa é recebida corretamente
  useEffect(() => {
    if (!tarefa) {
      console.error('Tarefa não recebida corretamente!');
    }
  }, [tarefa]);

  return (
    <div className="tarefas-container">
      <h2>Gerenciador de Tarefas</h2>

      {/* Formulário para criar/editar tarefas */}
      <form onSubmit={handleSubmit} className="tarefa-form">
        <input
          type="text"
          name="titulo"
          value={tarefaAtual.titulo} // Usando o valor real do estado
          onChange={handleInputChange}
          required
        />
        <textarea
          name="descricao"
          value={tarefaAtual.descricao} // Usando o valor real do estado
          onChange={handleInputChange}
        />
        <select
          name="prioridade"
          value={tarefaAtual.prioridade} // Usando o valor real do estado
          onChange={handleInputChange}
        >
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>
        <input
          type="date"
          name="prazo"
          value={tarefaAtual.prazo} // Usando o valor real do estado
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

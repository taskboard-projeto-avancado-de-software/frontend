import React, { useState, useEffect } from 'react';

function Editar(tarefa) {
  const [tarefaAtual, setTarefaAtual] = useState(tarefa);

  // Função para lidar com mudanças nos inputs do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTarefaAtual({ ...tarefaAtual, [name]: value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const url = `http://localhost:3001/tarefas/${tarefaEditando.id}`
    const method ='PUT';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarefaAtual)
    })
  
  };


  // Função para excluir uma tarefa
  const handleExcluir = (id) => {
    fetch(`http://localhost:3001/tarefas/${tarefaEditando.id}`, { method: 'DELETE' })
  };



  return (
    <div className="tarefas-container">
      <h2>Gerenciador de Tarefas</h2>

      {/* Formulário para criar/editar tarefas */}
      <form onSubmit={handleSubmit} className="tarefa-form">
        <input
          type="text"
          name="titulo"
          placeholder={tarefaAtual.titulo}
          value={tarefaAtual.titulo}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="descricao"
          placeholder={tarefaAtual.descricao}
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
        <button type="submit">
          Atualizar Tarefa
        </button>
        <button onClick={() => handleExcluir(tarefa.id)}>Excluir</button>
      </form>
    </div>
  );
}

export default Editar;
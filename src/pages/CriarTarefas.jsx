import {useState } from "react";
import "../styles/Criar.css"


function Criar() {


  const [tarefaAtual, setTarefaAtual] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media',
    prazo: '',
    estado: 'pendente'
  })

  // Função para lidar com mudanças nos inputs do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTarefaAtual({ ...tarefaAtual, [name]: value });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const url = `http://localhost:3000/tarefas`
    const method ='POST';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tarefaAtual)
    })
    setTarefaAtual({
      titulo: '',
      descricao: '',
      prioridade: 'media',
      prazo: '',
      estado: 'pendente'
    })
  
  };


  return (
    <div className="tarefas-container">
      <h2>criar nova tarefa</h2>
      
    <form onSubmit={handleSubmit}>
        <h2>preencha os dados</h2>

        <input type="text" onChange={handleInputChange} placeholder="titulo" name="titulo" value={tarefaAtual.titulo}/><br />

        <textarea name="descricao" value={tarefaAtual.descricao}  onChange={handleInputChange} placeholder="escricao"></textarea> <br />

        <input type="date" name="prazo" value={tarefaAtual.prazo} placeholder="prazo"/> <br />


        <select name="prioridade" value={tarefaAtual.prioridade} onChange={handleInputChange} >
            <option value="alta">Alta</option>
            <option value="media">Madia</option>
            <option value="baixa">Baixa</option>
        </select> <br />

        <button type="submit">Criar</button>


    </form>

      
    </div>
  );
} export default Criar;
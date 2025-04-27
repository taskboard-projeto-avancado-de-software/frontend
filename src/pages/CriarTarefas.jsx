import { useState } from "react";
import "../styles/Criar.css"
import api from "../services/api";
import Cabecalho from "../components/Cabecalho";
import { useNavigate } from "react-router-dom";
import { obterId } from "../services/AuthUsuario";

function Criar() {

  const [tarefaAtual, setTarefaAtual] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media',
    prazo: '',
    estado: 'A fazer',
    idUsuario: ''
  })

  const tarefaComIdUsuario = {
    ...tarefaAtual,
    idUsuario:obterId()
  }

  const navigate = useNavigate();

  // Função para lidar com mudanças nos inputs do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTarefaAtual({ ...tarefaAtual, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/tarefas", tarefaComIdUsuario);

    setTarefaAtual({
      titulo: '',
      descricao: '',
      prioridade: 'media',
      prazo: '',
      estado: 'pendente',
      idUsuario: ''
    });

    navigate('/home')

  };

  return (

    <div className="container-tela">

      <Cabecalho/>

      <div className="tarefas-container">
        <h2>Criar Tarefa</h2>

        <form onSubmit={handleSubmit}>
          <h2>Preeencha os dados:</h2>

          <input type="text" onChange={handleInputChange} placeholder="titulo" name="titulo" value={tarefaAtual.titulo} /><br />

          <textarea name="descricao" value={tarefaAtual.descricao} onChange={handleInputChange} placeholder="descricao"></textarea> <br />

          <input type="date" name="prazo" value={tarefaAtual.prazo} onChange={handleInputChange} placeholder="prazo" /> <br />

          <select name="prioridade" value={tarefaAtual.prioridade} onChange={handleInputChange} >
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select> <br />

          <button type="submit">Criar</button>

        </form>

      </div>

    </div>

  );
}
export default Criar;
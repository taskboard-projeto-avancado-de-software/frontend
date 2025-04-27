import { useState } from "react";
import "../styles/Pesquisa.css";
import api from "../services/api";
import Cabecalho from "../components/Cabecalho";
import { obterId } from "../services/AuthUsuario";

const PesquisaTarefas = () => {
  const [tarefas, setTarefas] = useState([]);
  const [filtros, setFiltros] = useState({
    termoGeral: '',
    prioridade: '',
    prazo: '',
    idUsuario: ''
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const filtrosComIdUsuario = {
    ...filtros,
    idUsuario: obterId()
  }

  const buscarTarefas = async () => {
    setCarregando(true);
    setErro('');

    try {
      const params = {};

      if (filtrosComIdUsuario.termoGeral) {
        params.q = filtrosComIdUsuario.termoGeral;
      }

      if (filtrosComIdUsuario.prioridade) params.prioridade = filtrosComIdUsuario.prioridade;
      if (filtrosComIdUsuario.prazo) params.prazo = filtrosComIdUsuario.prazo;

      // Adiciona o idUsuario ao filtro
      if (filtrosComIdUsuario.idUsuario) params.idUsuario = filtrosComIdUsuario.idUsuario;

      const response = await api.get("/tarefas", { params });

      setTarefas(response.data);
    } catch (error) {
      setErro(error.message);
      setTarefas([]);
    } finally {
      setCarregando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    buscarTarefas();
  };

  const opcoesPrioridade = [
    { value: '', label: 'Todas as prioridades' },
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Média' },
    { value: 'baixa', label: 'Baixa' }
  ];

  const opcoesPrazo = [
    { value: '', label: 'Todos os prazos' },
    { value: 'hoje', label: 'Hoje' },
    { value: 'semana', label: 'Esta semana' },
    { value: 'mes', label: 'Este mês' },
    { value: 'futuro', label: 'Futuro' }
  ];

  return (

    <div className="container-tela">

      <Cabecalho />

      <div className="Pesquisar">
        <h1>Pesquisar Tarefas</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="termoGeral">Título, Descrição, Coluna</label>
            <input
              type="text"
              id="termoGeral"
              name="termoGeral"
              value={filtros.termoGeral}
              onChange={handleChange}
              placeholder="Digite um termo para buscar em qualquer campo"
            />
          </div>

          <div className="prioridade">
            <label htmlFor="prioridade">Prioridade:</label>
            <select
              id="prioridade"
              name="prioridade"
              value={filtros.prioridade}
              onChange={handleChange}
            >
              {opcoesPrioridade.map(opcao => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>

          <div className="prazo">
            <label htmlFor="prazo">Prazo:</label>
            <select
              id="prazo"
              name="prazo"
              value={filtros.prazo}
              onChange={handleChange}
            >
              {opcoesPrazo.map(opcao => (
                <option key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={carregando}>
            {carregando ? 'Pesquisando...' : 'Pesquisar'}
          </button>
        </form>

        {erro && <div>{erro}</div>}

        <div>
          {carregando ? (
            <p>Carregando resultados...</p>
          ) : (
            <div className="resultados">
              <h2>Resultados ({tarefas.length})</h2>
              {tarefas.length > 0 ? (
                <ul>
                  {tarefas.map(tarefa => (
                    <li key={tarefa.id}>
                      <h3>{tarefa.titulo}</h3>
                      <p>Descrição: {tarefa.descricao}</p>
                      <p>Prioridade: {tarefa.prioridade}</p>
                      <p>Prazo: {tarefa.prazo}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                !erro && <p>Nenhuma tarefa encontrada com os filtros selecionados.</p>
              )}
            </div>
          )}
        </div>
      </div>

    </div>


  );
};

export default PesquisaTarefas;
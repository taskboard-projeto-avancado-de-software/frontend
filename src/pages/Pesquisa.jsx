import { useState } from "react";

const PesquisaTarefas = () => {
  const [tarefas, setTarefas] = useState([]);
  const [filtros, setFiltros] = useState({
    termoGeral: '', 
    prioridade: '',
    prazo: ''
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const buscarTarefas = async () => {
    setCarregando(true);
    setErro('');
    
    try {
      const params = new URLSearchParams();
      

      if (filtros.termoGeral) {
        params.append('q', filtros.termoGeral); 
      }
      
      if (filtros.prioridade) params.append('prioridade', filtros.prioridade);
      if (filtros.prazo) params.append('prazo', filtros.prazo);

      const response = await fetch(`http://localhost:3001/tarefas?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar tarefas');
      }

      const data = await response.json();

      setTarefas(data);
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
    <div>
      <h1>Pesquisar Tarefas</h1>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="termoGeral">Pesquisar (qualquer campo):</label>
          <input
            type="text"
            id="termoGeral"
            name="termoGeral"
            value={filtros.termoGeral}
            onChange={handleChange}
            placeholder="Digite um termo para buscar em qualquer campo"
          />
        </div>

        <div>
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

        <div>
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
          <>
            <h2>Resultados ({tarefas.length})</h2>
            {tarefas.length > 0 ? (
              <ul>
                {tarefas.map(tarefa => (
                  <li key={tarefa.id}>
                    <h3>{tarefa.titulo}</h3>
                    <p>Descrição: {tarefa.descricao}</p>
                    <p>Prioridade: {tarefa.prioridade}</p>
                    <p>Prazo: {tarefa.prazo}</p>
                    <p>Responsável: {tarefa.responsavel}</p>
                  </li>
                ))}
              </ul>
            ) : (
              !erro && <p>Nenhuma tarefa encontrada com os filtros selecionados.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PesquisaTarefas;
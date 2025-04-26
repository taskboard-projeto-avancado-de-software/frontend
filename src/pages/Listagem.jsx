import { useEffect, useState } from "react";
import "../styles/Listar.css"
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Listagem() {
  const [tarefas, setTarefas] = useState([]);
  const [colunas, setColunas] = useState([]);

  //uso do navigate 
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [mostrarInputColuna, setMostrarInputColuna] = useState(false);

  const [novoNomeColuna, setNovoNomeColuna] = useState({
    id: colunas.length,
    titulo: '',
    idUsuario: ''

  });

  const [foco, setFoco] = useState({
    titulo: "",
    descricao: "",
    prioridade: "",
    prazo: "",
    estado: "",
    id: ''
  });
  const [draggedItem, setDraggedItem] = useState(null);

  // Carrega tarefas inicialmente
  useEffect(() => {
    async function carregar() {
      try {
        const response = await api.get("/tarefas");
        setTarefas(response.data);
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      }
    }
    carregar();
  }, []);


  // Carrega colunas inicialmente
  useEffect(() => {
    async function carregarColunas() {
      try {
        const response = await api.get("/colunas");
        setColunas(response.data);
      } catch (error) {
        console.error('Erro ao carregar colunas:', error);
      }
    }
    carregarColunas();
  }, []);


  const handleFocar = (tarefa) => {
    setFoco(tarefa);
    setVisible(true);
  };

  // NOVA VERSÃO DA FUNÇÃO DE CRIAR COLUNAS
  const handleCriarNovaColuna = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/colunas", novoNomeColuna);
      setColunas([...colunas, response.data]);
      setMostrarInputColuna(false);
      setNovoNomeColuna({
        id: 0,
        titulo: '',
        idUsuario: ''
      });
    } catch (error) {
      console.error('Erro:', error);
    }
  };


  // função para atualizar os dados da coluna que sera criada
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // setColunas({...novoNomeColuna,[name]:value});

    setNovoNomeColuna({ ...novoNomeColuna, [name]: value })
  };

  // NOVA FUNÇÃO PARA APAGAR UMA COLUNA
  const handleExcluirColunas = async (id) => {
    const idParaExcluir = id;
    setColunas(colunas => colunas.filter(item => item.id !== idParaExcluir));

    try {
      await api.delete(`/colunas/${id}`);
      console.log('Coluna excluída com sucesso');
    } catch (error) {
      console.error('Erro ao excluir coluna:', error);
    }
  };


  // Funções para drag and drop (ARRASTAR AS TAREGAS E MUDAR O ESTADO DELAS)
  const handleDragStart = (e, tarefa) => {
    setDraggedItem(tarefa);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, novoEstado) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.estado === novoEstado) return;

    try {
      // Atualização otimista
      const tarefasAtualizadas = tarefas.map(tarefa =>
        tarefa.id === draggedItem.id ? { ...tarefa, estado: novoEstado } : tarefa
      );
      setTarefas(tarefasAtualizadas);

      // Atualização no servidor
      await api.patch(`/tarefas/${draggedItem.id}`, { estado: novoEstado });

    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      setTarefas(tarefas); // Reverte em caso de erro
    }

    setDraggedItem(null);
  };


  const handleEditar = (id) => {
    // Navega para a página de edição passando o id da tarefa
    navigate(`/editar/${id}`);
  };

  return (

    <div>
      <h2>Listagem de tarefas</h2>

      <div className="colunas_tarefas">
        {colunas.map(coluna => {
          const agruparTarefas = tarefas.filter(tarefa => tarefa.estado === coluna.titulo);
          return (
            <div
              key={coluna.id}
              className="coluna"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, coluna.titulo)}
            >
              <h2>{coluna.titulo}</h2>
              <button onClick={() => { handleExcluirColunas(coluna.id) }}>deletar</button>
              <div className="tarefas">
                {agruparTarefas.map(tarefa => (
                  <div
                    key={tarefa.id}
                    className="tarefa"
                    draggable
                    onDragStart={(e) => handleDragStart(e, tarefa)}
                    onClick={() => handleFocar(tarefa)}
                  >
                    <h3>{tarefa.titulo}</h3>
                    <p>descrição: {tarefa.descricao}</p>
                    <div className="prioridade">
                      <p>prioridade: {tarefa.prioridade}</p>
                    </div>
                    <p>prazo: {tarefa.prazo}</p>
                    <button onClick={() => handleEditar(tarefa.id)}>editar</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="criar_colunas">

        <div className="botoes-criar">
          <button onClick={() => navigate('/criar')}>Criar Tarefa</button>

          <button onClick={() => setMostrarInputColuna(true)}>Adicionar Coluna</button>
        </div>


        {mostrarInputColuna && (
          <div>
            <input
              type="text"
              name="titulo"
              placeholder="nome da nova coluna"
              value={novoNomeColuna.titulo}
              onChange={(e) => handleInputChange(e)}
              onKeyPress={(e) => e.key === 'Enter' && handleCriarNovaColuna()}
            />
            <button onClick={handleCriarNovaColuna}>Criar</button>
            <button onClick={() => {
              setMostrarInputColuna(false);

              //mudei aqui
              setNovoNomeColuna({
                id: colunas.length,
                titulo: '',
                idUsuario: ''

              });
            }}>Cancelar</button>
          </div>
        )}
      </div>

      {visible && (
        <div className="Foco">
          <h2>{foco.titulo}</h2>
          <p>{foco.descricao}</p>
          <p>{foco.estado}</p>
          <p>{foco.prazo}</p>
          <button onClick={() => setVisible(false)}>Fechar</button>
        </div>
      )}
    </div>
  );
}

export default Listagem;
import { useEffect, useState } from "react";
import "../styles/Listar.css"
import { useNavigate } from "react-router-dom";

function Listagem() {
    const [tarefas, setTarefas] = useState([]);
    const [colunas, setColunas] = useState([
        {
            id: 1,
            titulo: 'criada',
            estado: 'pendente'
        },
        {
            id: 2,
            titulo: 'em processo',
            estado: 'em processo'
        },
        {
            id: 3,
            titulo: 'concluida',
            estado: 'concluida'
        }
    ]);

    const [visible, setVisible] = useState(false);
    const [mostrarInputColuna, setMostrarInputColuna] = useState(false);
    const [novoNomeColuna, setNovoNomeColuna] = useState('');
    const [foco, setFoco] = useState({
        titulo: "",
        descricao: "",
        prioridade: "",
        prazo: "",
        estado: "",
        id: ''
    });
    const [draggedItem, setDraggedItem] = useState(null);
    const navigate = useNavigate();

    // Carrega tarefas inicialmente
    useEffect(() => {
        async function carregar() {
            const tarefasCarregadas = await fetch('http://localhost:3000/tarefas');
            const dados = await tarefasCarregadas.json();
            setTarefas(dados);
        }
        carregar();
    }, []);

    // Cria colunas baseadas nos estados das tarefas
    useEffect(() => {
        const estadosUnicos = [...new Set(tarefas.map(tarefa => tarefa.estado))];
        
        estadosUnicos.forEach(estado => {
            const colunaExistente = colunas.find(coluna => coluna.estado === estado);
            if (!colunaExistente) {
                setColunas(prevColunas => [
                    ...prevColunas,
                    {
                        id: prevColunas.length + 1,
                        titulo: estado,
                        estado: estado
                    }
                ]);
            }
        });
    }, [tarefas]);

    const handleFocar = (tarefa) => {
        setFoco(tarefa);
        setVisible(true);
    };

    const handleCriarNovaColuna = () => {
        if (novoNomeColuna.trim() !== '') {
            const novaColuna = {
                id: colunas.length + 1,
                titulo: novoNomeColuna,
                estado: novoNomeColuna.toLowerCase()
            };
            
            setColunas([...colunas, novaColuna]);
            setNovoNomeColuna('');
            setMostrarInputColuna(false);
        }
    };

    const handleExcluirColunas = (id) =>{
        const idParaExcluir = id;
        setColunas(colunas => colunas.filter(item => item.id !== idParaExcluir))
    }

    // Funções para drag and drop
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
            await fetch(`http://localhost:3000/tarefas/${draggedItem.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: novoEstado })
            });

        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
            setTarefas(tarefas); // Reverte em caso de erro
        }
        
        setDraggedItem(null);
    };


    return (
        <div>
            <h2>Listagem de tarefas</h2>

            <div className="colunas_tarefas">
                {colunas.map(coluna => {
                    const agruparTarefas = tarefas.filter(tarefa => tarefa.estado === coluna.estado);
                    return (
                        <div 
                            key={coluna.id} 
                            className="coluna"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, coluna.estado)}
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
                                        <button>editar</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="criar_colunas">
                <button onClick={() => setMostrarInputColuna(true)}>+</button>

                {mostrarInputColuna && (
                    <div>
                        <input 
                            type="text" 
                            placeholder="nome da nova coluna" 
                            value={novoNomeColuna}
                            onChange={(e) => setNovoNomeColuna(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCriarNovaColuna()}
                        />
                        <button onClick={handleCriarNovaColuna}>Criar</button>
                        <button onClick={() => {
                            setMostrarInputColuna(false);
                            setNovoNomeColuna('');
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

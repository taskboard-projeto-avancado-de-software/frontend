import { useState, useEffect } from "react";
import "../styles/Pesquisa.css";
import api from "../services/api";
import Cabecalho from "../components/Cabecalho";
import { obterId } from "../services/AuthUsuario";

const Notificacoes = () => {
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    buscarNotificacoes();
  }, []);

  const buscarNotificacoes = async () => {
    setCarregando(true);
    setErro('');

    try {
      const response = await api.get("/notificacoes", {
        params: { idUsuario: obterId() }
      });

      setNotificacoes(response.data);
    } catch (error) {
      setErro(error.message);
      setNotificacoes([]);
    } finally {
      setCarregando(false);
    }
  };

  const marcarComoLida = async (idNotificacao) => {
    try {
      await api.delete(`/notificacoes/${idNotificacao}`);
      // Atualiza a lista sem a notificação deletada
      setNotificacoes(prev => prev.filter(n => n.id !== idNotificacao));
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  return (
    <div className="container-tela">
      <Cabecalho />

      <div className="Pesquisar">
        <h1>Minhas Notificações</h1>

        {erro && <div>{erro}</div>}

        <div>
          {carregando ? (
            <p>Carregando notificações...</p>
          ) : (
            <div className="resultados">
              <h2>Resultados ({notificacoes.length})</h2>
              {notificacoes.length > 0 ? (
                <ul>
                  {notificacoes.map(notificacao => (
                    <li key={notificacao.id}>
                      <h3>{notificacao.mensagem}</h3>
                      <p>ID da Tarefa: {notificacao.idTarefa || "Nenhuma tarefa"}</p>
                      <p>Status: {notificacao.lida ? "Lida" : "Não lida"}</p>
                      <button onClick={() => marcarComoLida(notificacao.id)}>
                        Marcar como lida
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Você não tem notificações no momento.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notificacoes;

import React, { useState, useEffect } from 'react';
import api from './api'

function App() {
  // Estados para os dados
  const [usuarios, setUsuarios] = useState([]);
  const [tarefas, setTarefas] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  
  // Estados para formulários
  const [formUsuario, setFormUsuario] = useState({
    nome: '',
    email: '',
    senha: ''
  });
  
  const [formTarefa, setFormTarefa] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'media',
    prazo: '',
    estado: 'afazer',
    idUsuario: ''
  });
  
  const [formNotificacao, setFormNotificacao] = useState({
    mensagem: '',
    idTarefa: '',
    idUsuario: ''
  });
  
  // Estados para login e controle
  const [login, setLogin] = useState({ email: '', senha: '' });
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [tarefaEditando, setTarefaEditando] = useState(null);

  // Busca inicial dos dados
  useEffect(() => {
    buscarDados();
  }, []);

  // Função para buscar todos os dados
  const buscarDados = async () => {
    try {
      const [resUsuarios, resTarefas, resNotificacoes] = await Promise.all([
        api.get('/usuarios'),
        api.get('/tarefas'),
        api.get('/notificacoes')
      ]);
      setUsuarios(resUsuarios.data);
      setTarefas(resTarefas.data);
      setNotificacoes(resNotificacoes.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  // ========== FUNÇÕES DE USUÁRIO ========== //
  const cadastrarUsuario = async () => {
    try {
      await api.post('/usuarios', formUsuario);
      alert('Usuário cadastrado com sucesso!');
      setFormUsuario({ nome: '', email: '', senha: '' });
      buscarDados();
    } catch (error) {
      alert('Erro ao cadastrar usuário');
    }
  };

  const logarUsuario = async () => {
    try {
      const response = await api.get('/usuarios', {
        params: { email: login.email, senha: login.senha }
      });
      
      if (response.data.length > 0) {
        setUsuarioLogado(response.data[0]);
        alert(`Bem-vindo, ${response.data[0].nome}!`);
      } else {
        alert('Credenciais inválidas!');
      }
    } catch (error) {
      alert('Erro ao fazer login');
    }
  };

  // ========== FUNÇÕES DE TAREFA ========== //
  const criarTarefa = async () => {
    try {
      await api.post('/tarefas', {
        ...formTarefa,
        idUsuario: usuarioLogado?.id || formTarefa.idUsuario
      });
      alert('Tarefa criada!');
      setFormTarefa({
        titulo: '',
        descricao: '',
        prioridade: 'media',
        prazo: '',
        estado: 'afazer',
        idUsuario: ''
      });
      buscarDados();
    } catch (error) {
      alert('Erro ao criar tarefa');
    }
  };

  const editarTarefa = async () => {
    if (!tarefaEditando) return;
    
    try {
      await api.put(`/tarefas/${tarefaEditando}`, {
        titulo: formTarefa.titulo || tarefas.find(t => t.id === tarefaEditando)?.titulo,
        descricao: formTarefa.descricao || tarefas.find(t => t.id === tarefaEditando)?.descricao,
        estado: formTarefa.estado || tarefas.find(t => t.id === tarefaEditando)?.estado
      });
      alert('Tarefa atualizada!');
      setTarefaEditando(null);
      buscarDados();
    } catch (error) {
      alert('Erro ao editar tarefa');
    }
  };

  const excluirTarefa = async (id) => {
    try {
      await api.delete(`/tarefas/${id}`);
      alert('Tarefa excluída!');
      buscarDados();
    } catch (error) {
      alert('Erro ao excluir tarefa');
    }
  };

  // ========== FUNÇÕES DE NOTIFICAÇÃO ========== //
  const criarNotificacao = async () => {
    try {
      await api.post('/notificacoes', {
        ...formNotificacao,
        lida: false
      });
      alert('Notificação criada!');
      setFormNotificacao({ mensagem: '', idTarefa: '', idUsuario: '' });
      buscarDados();
    } catch (error) {
      alert('Erro ao criar notificação');
    }
  };

  const excluirNotificacao = async (id) => {
    try {
      await api.delete(`/notificacoes/${id}`);
      alert('Notificação excluída!');
      buscarDados();
    } catch (error) {
      alert('Erro ao excluir notificação');
    }
  };

  // ========== RENDERIZAÇÃO ========== //
  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Sistema de Tarefas</h1>
      
      {/* Seção de Usuários */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>Usuários</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <h3>Cadastrar</h3>
          <input
            placeholder="Nome"
            value={formUsuario.nome}
            onChange={(e) => setFormUsuario({...formUsuario, nome: e.target.value})}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <input
            placeholder="Email"
            value={formUsuario.email}
            onChange={(e) => setFormUsuario({...formUsuario, email: e.target.value})}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <input
            placeholder="Senha"
            type="password"
            value={formUsuario.senha}
            onChange={(e) => setFormUsuario({...formUsuario, senha: e.target.value})}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button onClick={cadastrarUsuario} style={{ padding: '5px 10px' }}>Cadastrar</button>
        </div>
        
        <div>
          <h3>Login</h3>
          <input
            placeholder="Email"
            value={login.email}
            onChange={(e) => setLogin({...login, email: e.target.value})}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <input
            placeholder="Senha"
            type="password"
            value={login.senha}
            onChange={(e) => setLogin({...login, senha: e.target.value})}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button onClick={logarUsuario} style={{ padding: '5px 10px' }}>Login</button>
          
          {usuarioLogado && (
            <p style={{ marginTop: '10px' }}>
              Logado como: <strong>{usuarioLogado.nome}</strong> (ID: {usuarioLogado.id})
            </p>
          )}
        </div>
      </div>

      {/* Seção de Tarefas */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>Tarefas</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <h3>Criar Tarefa</h3>
          <div style={{ marginBottom: '10px' }}>
            <input
              placeholder="Título"
              value={formTarefa.titulo}
              onChange={(e) => setFormTarefa({...formTarefa, titulo: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', width: '200px' }}
            />
            <input
              placeholder="Descrição"
              value={formTarefa.descricao}
              onChange={(e) => setFormTarefa({...formTarefa, descricao: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', width: '200px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <select
              value={formTarefa.prioridade}
              onChange={(e) => setFormTarefa({...formTarefa, prioridade: e.target.value})}
              style={{ marginRight: '10px', padding: '5px' }}
            >
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
            
            <input
              type="date"
              value={formTarefa.prazo}
              onChange={(e) => setFormTarefa({...formTarefa, prazo: e.target.value})}
              style={{ marginRight: '10px', padding: '5px' }}
            />
            
            <select
              value={formTarefa.estado}
              onChange={(e) => setFormTarefa({...formTarefa, estado: e.target.value})}
              style={{ marginRight: '10px', padding: '5px' }}
            >
              <option value="afazer">A fazer</option>
              <option value="fazendo">Fazendo</option>
              <option value="feito">Feito</option>
            </select>
          </div>
          <div>
            <input
              placeholder="ID Usuário (ou deixe vazio se logado)"
              value={formTarefa.idUsuario}
              onChange={(e) => setFormTarefa({...formTarefa, idUsuario: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', width: '250px' }}
            />
            <button onClick={criarTarefa} style={{ padding: '5px 10px' }}>Criar</button>
          </div>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <h3>Editar Tarefa</h3>
          <div>
            <input
              placeholder="ID da Tarefa"
              value={tarefaEditando || ''}
              onChange={(e) => setTarefaEditando(Number(e.target.value))}
              style={{ marginRight: '10px', padding: '5px', width: '100px' }}
            />
            <input
              placeholder="Novo Título"
              value={formTarefa.titulo}
              onChange={(e) => setFormTarefa({...formTarefa, titulo: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', width: '200px' }}
            />
            <button onClick={editarTarefa} style={{ padding: '5px 10px' }}>Editar</button>
          </div>
        </div>
        
        <div>
          <h3>Excluir Tarefa</h3>
          <div>
            <input
              placeholder="ID da Tarefa"
              onChange={(e) => setTarefaEditando(Number(e.target.value))}
              style={{ marginRight: '10px', padding: '5px', width: '100px' }}
            />
            <button onClick={() => excluirTarefa(tarefaEditando)} style={{ padding: '5px 10px' }}>Excluir</button>
          </div>
        </div>
        
        {/* Lista de Tarefas em Colunas */}
        <div style={{ marginTop: '20px' }}>
          <h3>Lista de Tarefas</h3>
          <div style={{ display: 'flex', gap: '20px' }}>
            {/* Coluna A Fazer */}
            <div style={{ flex: 1, padding: '10px', background: '#000000', borderRadius: '5px' }}>
              <h4>A Fazer</h4>
              {tarefas
                .filter(t => t.estado === 'afazer')
                .map(tarefa => (
                  <div key={tarefa.id} style={{ marginBottom: '10px', padding: '10px', background: 'blue', borderRadius: '3px' }}>
                    <p><strong>{tarefa.titulo}</strong></p>
                    <p>{tarefa.descricao}</p>
                    <p><small>Prioridade: {tarefa.prioridade}</small></p>
                  </div>
                ))}
            </div>
            
            {/* Coluna Fazendo */}
            <div style={{ flex: 1, padding: '10px', background: '#000000', borderRadius: '5px' }}>
              <h4>Fazendo</h4>
              {tarefas
                .filter(t => t.estado === 'fazendo')
                .map(tarefa => (
                  <div key={tarefa.id} style={{ marginBottom: '10px', padding: '10px', background: 'blue', borderRadius: '3px' }}>
                    <p><strong>{tarefa.titulo}</strong></p>
                    <p>{tarefa.descricao}</p>
                  </div>
                ))}
            </div>
            
            {/* Coluna Feito */}
            <div style={{ flex: 1, padding: '10px', background: '#000000', borderRadius: '5px' }}>
              <h4>Feito</h4>
              {tarefas
                .filter(t => t.estado === 'feito')
                .map(tarefa => (
                  <div key={tarefa.id} style={{ marginBottom: '10px', padding: '10px', background: 'blue', borderRadius: '3px' }}>
                    <p><strong>{tarefa.titulo}</strong></p>
                    <p>{tarefa.descricao}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Notificações */}
      <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>Notificações</h2>
        
        <div style={{ marginBottom: '15px' }}>
          <h3>Criar Notificação</h3>
          <div style={{ marginBottom: '10px' }}>
            <input
              placeholder="Mensagem"
              value={formNotificacao.mensagem}
              onChange={(e) => setFormNotificacao({...formNotificacao, mensagem: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', width: '300px' }}
            />
          </div>
          <div>
            <input
              placeholder="ID Tarefa"
              value={formNotificacao.idTarefa}
              onChange={(e) => setFormNotificacao({...formNotificacao, idTarefa: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', width: '100px' }}
            />
            <input
              placeholder="ID Usuário"
              value={formNotificacao.idUsuario}
              onChange={(e) => setFormNotificacao({...formNotificacao, idUsuario: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', width: '100px' }}
            />
            <button onClick={criarNotificacao} style={{ padding: '5px 10px' }}>Criar</button>
          </div>
        </div>
        
        <div>
          <h3>Excluir Notificação</h3>
          <div>
            <input
              placeholder="ID Notificação"
              onChange={(e) => setFormNotificacao({...formNotificacao, id: e.target.value})}
              style={{ marginRight: '10px', padding: '5px', width: '100px' }}
            />
            <button onClick={() => excluirNotificacao(formNotificacao.id)} style={{ padding: '5px 10px' }}>Excluir</button>
          </div>
        </div>
        
        {/* Lista de Notificações */}
        <div style={{ marginTop: '20px' }}>
          <h3>Lista de Notificações</h3>
          {notificacoes.map(notificacao => (
            <div key={notificacao.id} style={{ marginBottom: '10px', padding: '10px', background: 'blue', borderRadius: '3px' }}>
              <p><strong>{notificacao.mensagem}</strong></p>
              <p>Tarefa ID: {notificacao.idTarefa} | Usuário ID: {notificacao.idUsuario}</p>
              <p><small>{notificacao.lida ? 'Lida' : 'Não lida'}</small></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
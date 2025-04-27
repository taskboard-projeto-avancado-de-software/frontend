const chaveUsuario = 'usuario';

export function salvarUsuario({ nome, email, senha, id }) {
  const dadosUsuario = { nome, email, senha, id };
  localStorage.setItem(chaveUsuario, JSON.stringify(dadosUsuario));
}

export function obterUsuario() {
  const dados = localStorage.getItem(chaveUsuario);
  return dados ? JSON.parse(dados) : null;
}

export function obterId() {
  return obterUsuario()?.id || null;
}

export function obterNome() {
  return obterUsuario()?.nome || null;
}

export function obterEmail() {
  return obterUsuario()?.email || null;
}

export function obterSenha() {
  return obterUsuario()?.senha || null;
}

export function limparUsuario() {
  localStorage.removeItem(chaveUsuario);
}
const API_BASE = 'http://localhost:3000/api/users';

async function apiLogin(email, senha) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  });
  return res.json();
}

async function apiRegister(nome, email, senha) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha })
  });
  return res.json();
}

async function apiRecover(email) {
  const res = await fetch(`${API_BASE}/recover`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return res.json();
}

async function apiListUsers() {
  const res = await fetch(`${API_BASE}`);
  return res.json();
}

async function apiUpdatePassword(senhaAtual, novoNome, novaSenha, token) {
  const body = { senhaAtual, novoNome, novaSenha };
  console.log('Enviando para /update:', body);
  const res = await fetch(`${API_BASE}/update`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  console.log('Resposta da API /update:', data);
  return data;
} 
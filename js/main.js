// Login
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const senha = e.target.password.value;
    const msg = document.getElementById('loginMessage');
    msg.textContent = '';
    try {
      const res = await apiLogin(email, senha);
      if (res.token) {
        localStorage.setItem('token', res.token);
        let hasUserData = false;
        if (res.nome) { localStorage.setItem('nome', res.nome); hasUserData = true; }
        if (res.email) { localStorage.setItem('email', res.email); hasUserData = true; }
        if (res.id) { localStorage.setItem('id', res.id); hasUserData = true; }
        // Alternativos
        if (res.name) { localStorage.setItem('nome', res.name); hasUserData = true; }
        if (res.userId) { localStorage.setItem('id', res.userId); hasUserData = true; }
        if (res.user) {
          if (res.user.nome) { localStorage.setItem('nome', res.user.nome); hasUserData = true; }
          if (res.user.email) { localStorage.setItem('email', res.user.email); hasUserData = true; }
          if (res.user.id) { localStorage.setItem('id', res.user.id); hasUserData = true; }
          if (res.user.name) { localStorage.setItem('nome', res.user.name); hasUserData = true; }
          if (res.user.userId) { localStorage.setItem('id', res.user.userId); hasUserData = true; }
        }
        if (!hasUserData) {
          try {
            const users = await apiListUsers();
            console.log('Usuários retornados pela API:', users);
            const user = Array.isArray(users) ? users.find(u => (u.email && u.email.trim().toLowerCase() === email.trim().toLowerCase())) : null;
            if (user) {
              localStorage.setItem('nome', user.nome || user.name || '');
              localStorage.setItem('email', user.email || '');
              localStorage.setItem('id', user.id || user.userId || '');
              hasUserData = true;
            } else {
              console.warn('Usuário não encontrado na lista de usuários pelo email:', email);
            }
          } catch (e) { console.error('Erro ao buscar usuários:', e); }
        }
        // Se ainda não temos nome/email mas temos id, buscar pelo id
        if (!localStorage.getItem('nome') || !localStorage.getItem('email')) {
          const idSalvo = localStorage.getItem('id');
          if (idSalvo) {
            try {
              const users = await apiListUsers();
              console.log('Usuários retornados pela API (busca por id):', users);
              const user = Array.isArray(users) ? users.find(u => String(u.id) === String(idSalvo) || String(u.userId) === String(idSalvo)) : null;
              if (user) {
                if (user.nome || user.name) localStorage.setItem('nome', user.nome || user.name);
                if (user.email) localStorage.setItem('email', user.email);
                if (user.id || user.userId) localStorage.setItem('id', user.id || user.userId);
              } else {
                console.warn('Usuário não encontrado na lista de usuários pelo id:', idSalvo);
              }
            } catch (e) { console.error('Erro ao buscar usuários por id:', e); }
          }
        }
        // Log para depuração
        console.log('Após login, localStorage:', {
          token: localStorage.getItem('token'),
          nome: localStorage.getItem('nome'),
          email: localStorage.getItem('email'),
          id: localStorage.getItem('id')
        });
        window.location.href = 'users.html';
      } else {
        msg.textContent = res.message || 'Falha no login.';
      }
    } catch (err) {
      msg.textContent = 'Erro ao conectar à API.';
    }
  });
}

// Cadastro
if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = e.target.nome.value;
    const email = e.target.email.value;
    const senha = e.target.senha.value;
    const msg = document.getElementById('registerMessage');
    msg.textContent = '';
    try {
      const res = await apiRegister(nome, email, senha);
      if (res.id || res.success) {
        msg.style.color = '#388e3c';
        msg.textContent = 'Cadastro realizado com sucesso!';
        setTimeout(() => window.location.href = 'index.html', 1500);
      } else {
        msg.textContent = res.message || 'Erro ao cadastrar.';
      }
    } catch (err) {
      msg.textContent = 'Erro ao conectar à API.';
    }
  });
}

// Recuperar senha
if (document.getElementById('recoverForm')) {
  document.getElementById('recoverForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const msg = document.getElementById('recoverMessage');
    msg.textContent = '';
    try {
      const res = await apiRecover(email);
      if (res.success) {
        msg.style.color = '#388e3c';
        msg.textContent = 'Instruções enviadas para o e-mail.';
      } else {
        msg.textContent = res.message || 'Erro ao recuperar senha.';
      }
    } catch (err) {
      msg.textContent = 'Erro ao conectar à API.';
    }
  });
}

// Listar usuários
if (document.getElementById('usersTable')) {
  window.addEventListener('DOMContentLoaded', async () => {
    try {
      const users = await apiListUsers();
      const tbody = document.querySelector('#usersTable tbody');
      tbody.innerHTML = '';
      if (Array.isArray(users)) {
        users.forEach(u => {
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${u.id}</td><td>${u.nome}</td><td>${u.email}</td>`;
          tbody.appendChild(tr);
        });
      } else {
        tbody.innerHTML = '<tr><td colspan="3">Nenhum usuário encontrado.</td></tr>';
      }
    } catch (err) {
      document.querySelector('#usersTable tbody').innerHTML = '<tr><td colspan="3">Erro ao carregar usuários.</td></tr>';
    }
  });
  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
  });
}

// Alterar senha
if (document.getElementById('updatePasswordForm')) {
  window.addEventListener('DOMContentLoaded', () => {
    const nome = localStorage.getItem('nome');
    if (nome) {
      document.getElementById('novoNome').value = nome;
    }
  });
  document.getElementById('updatePasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const senhaAtual = e.target.senhaAtual.value;
    const novoNome = e.target.novoNome.value;
    const novaSenha = e.target.novaSenha.value;
    const msg = document.getElementById('updatePasswordMessage');
    msg.textContent = '';
    try {
      const token = localStorage.getItem('token');
      const res = await apiUpdatePassword(senhaAtual, novoNome, novaSenha, token);
      const sucessoMsg = (res.message && res.message.toLowerCase().includes('sucesso')) || (res.mensagem && res.mensagem.toLowerCase().includes('sucesso'));
      if (res.success == true || res.success === 'true' || sucessoMsg) {
        console.log('Alteração de senha bem-sucedida, escondendo form.');
        msg.style.color = '#388e3c';
        msg.textContent = res.message || res.mensagem || 'Senha alterada com sucesso!';
        document.getElementById('updatePasswordForm').style.display = 'none';
        document.querySelector('.links').innerHTML = `
          <a href="index.html">Voltar ao Login</a>
          <span>|</span>
          <a href="users.html">Ir para tela de Boas-vindas</a>
        `;
        // Atualiza o localStorage com o novo nome, se fornecido
        if (novoNome && novoNome !== localStorage.getItem('nome')) {
          localStorage.setItem('nome', novoNome);
        }
      } else {
        msg.textContent = res.message || 'Erro ao alterar senha.';
      }
    } catch (err) {
      msg.textContent = 'Erro ao conectar à API.';
    }
  });
}

if (window.location.pathname.endsWith('users.html')) {
  window.addEventListener('DOMContentLoaded', async () => {
    const nome = localStorage.getItem('nome');
    const email = localStorage.getItem('email');
    const id = localStorage.getItem('id');
    const userInfo = document.getElementById('userInfo');
    const usersTable = document.getElementById('usersTable');
    const linkAlterarSenha = document.getElementById('linkAlterarSenha');
    if (nome && email && id) {
      // Usuário logado: mostra só seus dados
      userInfo.innerHTML = `
        <h2>Seus dados</h2>
        <p><strong>ID:</strong> ${id}</p>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
      `;
      userInfo.style.display = '';
      usersTable.style.display = 'none';
      linkAlterarSenha.style.display = '';
    } else {
      // Não logado: mostra todos os usuários
      userInfo.innerHTML = '';
      userInfo.style.display = 'none';
      usersTable.style.display = '';
      linkAlterarSenha.style.display = 'none';
      try {
        const users = await apiListUsers();
        const tbody = usersTable.querySelector('tbody');
        tbody.innerHTML = '';
        if (Array.isArray(users)) {
          users.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${u.id}</td><td>${u.nome}</td><td>${u.email}</td>`;
            tbody.appendChild(tr);
          });
        } else {
          tbody.innerHTML = '<tr><td colspan="3">Nenhum usuário encontrado.</td></tr>';
        }
      } catch (err) {
        usersTable.querySelector('tbody').innerHTML = '<tr><td colspan="3">Erro ao carregar usuários.</td></tr>';
      }
    }
  });
  // Logout
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nome');
    localStorage.removeItem('email');
    localStorage.removeItem('id');
  });
} 
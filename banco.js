const API = 'http://200.152.191.192:3000';

export async function saveUser(nome, endereco, telefone, email, password) {
  try {
    const res = await fetch(`${API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, endereco, telefone, email, password }),
    });
    return res.json();
  } catch (err) {
    return { error: 'Sem conexão com o servidor' };
  }
}

export async function getUser(email, password) {
  try {
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  } catch (err) {
    return { error: 'Sem conexão com o servidor' };
  }
}

export async function deleteUser(email, password) {
  try {
    const res = await fetch(`${API}/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  } catch (err) {
    return { error: 'Sem conexão com o servidor' };
  }
}
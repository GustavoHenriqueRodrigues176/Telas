// =============================================================
// PERSISTENCIA — Aula 09 (JSON.stringify / JSON.parse / localStorage)
// =============================================================

function salvarUsuariosLocal() {
  const dados = listaUsuarios.map(function (u) { return u.toJSON(); });
  localStorage.setItem("usuarios_sistema", JSON.stringify(dados));
}

function carregarUsuariosDoLocal() {
  const raw = localStorage.getItem("usuarios_sistema");
  if (raw === null) return;
  try {
    const dados = JSON.parse(raw);
    if (!Array.isArray(dados) || dados.length === 0 || !dados[0].user) {
      throw new Error("Estrutura invalida");
    }
    // Preserva tipo, permissoes E bloqueado salvos
    listaUsuarios = dados.map(function (d) {
      return new Usuario(d.user, d.senha, d.tipo, d.permissoes || null, d.bloqueado || false);
    });
  } catch (e) {
    console.warn("localStorage com problema, usando dados iniciais.");
    localStorage.removeItem("usuarios_sistema");
    listaUsuarios = DADOS_INICIAIS.map(function (d) {
      return new Usuario(d.user, d.senha, d.tipo);
    });
  }
}
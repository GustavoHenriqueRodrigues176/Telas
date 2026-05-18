// =============================================================
// ADMIN — Logs de sistema e bloqueio de usuarios
// =============================================================

// Carrega logs do localStorage ou inicia vazio
let logsDoSistema = (function () {
  try {
    const raw = localStorage.getItem("sistema_logs");
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
})();

function registrarLog(tipo, descricao) {
  const agora = new Date();
  logsDoSistema.push({
    tipo:      tipo,
    descricao: descricao,
    hora:      agora.toLocaleTimeString("pt-BR"),
    data:      agora.toLocaleDateString("pt-BR")
  });
  // Persiste imediatamente
  try {
    localStorage.setItem("sistema_logs", JSON.stringify(logsDoSistema));
  } catch (e) {}
}

// =============================================================
// RENDERIZAR PAINEL ADMIN
// =============================================================

function renderizarPainelAdmin() {
  const painel = document.getElementById("adminPanel");
  painel.innerHTML =
    '<div class="admin-painel-wrap">' +
      '<div id="adminConteudo" class="admin-conteudo-vazio">' +
        '<span style="color:#bbb;font-size:14px;font-style:italic;">Selecione uma opcao ao lado</span>' +
      '</div>' +
    '</div>';

  _resetBotoes();
}

function _resetBotoes() {
  var bl = document.getElementById("btnVerLogs");
  var bb = document.getElementById("btnBloquear");
  if (bl) bl.classList.remove("admin-btn-esq-ativo");
  if (bb) bb.classList.remove("admin-btn-esq-ativo");
}

// =============================================================
// ABRIR SECAO
// =============================================================

function abrirSecaoAdmin(qual) {
  _resetBotoes();
  var btnAtivo = document.getElementById(qual === "logs" ? "btnVerLogs" : "btnBloquear");
  if (btnAtivo) btnAtivo.classList.add("admin-btn-esq-ativo");

  if (qual === "logs")     renderizarLogs();
  if (qual === "bloquear") renderizarBloquear();
}

// =============================================================
// LOGS
// =============================================================

function renderizarLogs() {
  const cont   = document.getElementById("adminConteudo");
  const icones = { login: "🟢", logout: "🔴", permissao: "✏️", bloqueio: "🔒", desbloqueio: "🔓" };

  const linhas = logsDoSistema.length === 0
    ? '<div class="admin-logs-vazio">Nenhum evento registrado ainda.</div>'
    : [...logsDoSistema].reverse().map(function (l) {
        return '<div class="admin-log-linha">' +
                 '<span class="admin-log-icone">' + (icones[l.tipo] || "⚙️") + '</span>' +
                 '<div class="admin-log-corpo">' +
                   '<span class="admin-log-desc">' + l.descricao + '</span>' +
                   '<span class="admin-log-hora">' + l.data + ' ' + l.hora + '</span>' +
                 '</div>' +
               '</div>';
      }).join("");

  cont.innerHTML =
    '<div class="admin-secao">' +
      '<div class="admin-secao-titulo">' +
        '<span>Logs do Sistema</span>' +
        '<button class="admin-btn-limpar" onclick="limparLogs()">Limpar</button>' +
      '</div>' +
      '<div class="admin-logs-lista">' + linhas + '</div>' +
    '</div>';
}

function limparLogs() {
  logsDoSistema = [];
  localStorage.removeItem("sistema_logs");
  renderizarLogs();
}

// =============================================================
// BLOQUEAR
// =============================================================

function renderizarBloquear() {
  const cont = document.getElementById("adminConteudo");

  const usuarios = listaUsuarios.filter(function (u) {
    return u.user !== usuarioLogado.user;
  });

  const linhas = usuarios.map(function (u) {
    const bloqueado   = u.bloqueado === true;
    const labelBtn    = bloqueado ? "Desbloquear" : "Bloquear";
    const classBtn    = bloqueado ? "admin-btn-desbloquear" : "admin-btn-bloquear";
    const statusBadge = bloqueado
      ? '<span class="admin-badge-bloqueado">Bloqueado</span>'
      : '<span class="admin-badge-ativo">Ativo</span>';

    return '<div class="admin-user-linha">' +
             '<div class="admin-user-avatar">' + u.getInicial() + '</div>' +
             '<div class="admin-user-info">' +
               '<span class="admin-user-nome">' + u.user + '</span>' +
               '<span class="admin-user-tipo">' + u.tipo + '</span>' +
             '</div>' +
             statusBadge +
             '<button class="' + classBtn + '" onclick="alternarBloqueio(\'' + u.user + '\')">' +
               labelBtn +
             '</button>' +
           '</div>';
  }).join("");

  cont.innerHTML =
    '<div class="admin-secao">' +
      '<div class="admin-secao-titulo"><span>Controle de Acesso</span></div>' +
      '<div class="admin-users-lista">' + linhas + '</div>' +
    '</div>';
}

function alternarBloqueio(nomeUsuario) {
  const u = listaUsuarios.find(function (x) { return x.user === nomeUsuario; });
  if (!u) return;

  u.bloqueado = !u.bloqueado;

  registrarLog(
    u.bloqueado ? "bloqueio" : "desbloqueio",
    'Admin ' + (u.bloqueado ? "bloqueou" : "desbloqueou") + ' o usuario "' + u.user + '"'
  );

  salvarUsuariosLocal();
  renderizarBloquear();
}
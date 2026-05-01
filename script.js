const usuarios = [
  { user: "Erick",      senha: "2085", tipo: "Usuario"       },
  { user: "Gustavo",    senha: "3740", tipo: "Usuario"       },
  { user: "Supervisor", senha: "1234", tipo: "Supervisão"    },
  { user: "Gerente",    senha: "2101", tipo: "Gerenciador"   },
  { user: "Admin",      senha: "1010", tipo: "Administrador" }
];

const hierarquia = ["Usuario", "Supervisão", "Gerenciador", "Administrador"];

// Permissões principais por cargo
const permissoesPorTipo = {
  "Usuario":       ["Ver próprio perfil"],
  "Supervisão":    ["Ver próprio perfil", "Ver usuários comuns"],
  "Gerenciador":   ["Ver próprio perfil", "Ver usuários", "Editar usuários", "Gerar relatórios"],
  "Administrador": ["Ver próprio perfil", "Ver todos os usuários", "Editar usuários", "Acessar Admin", "Gerar relatórios", "Alterar configurações"]
};

// Alertas por cargo
const alertasPorTipo = {
  "Usuario":       [{ cor: "#3b82f6", texto: "Bem-vindo ao sistema! Navegue pelo menu lateral." }],
  "Supervisão":    [{ cor: "#3b82f6", texto: "Você pode visualizar usuários comuns." }, { cor: "#f59e0b", texto: "Relatórios não estão disponíveis para seu nível." }],
  "Gerenciador":   [{ cor: "#10b981", texto: "Acesso a relatórios habilitado." }, { cor: "#f59e0b", texto: "Área Admin restrita ao Administrador." }],
  "Administrador": [{ cor: "#10b981", texto: "Acesso total ao sistema habilitado." }, { cor: "#3b82f6", texto: "Você pode gerenciar todos os usuários." }]
};

function nivelDo(tipo) {
  return hierarquia.indexOf(tipo);
}

function login() {
  const user  = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();

  const encontrado = usuarios.find(u => u.user === user && u.senha === senha);

  if (!encontrado) {
    document.getElementById("erro").innerText = "Login inválido!";
    return;
  }

  localStorage.setItem("usuario", JSON.stringify(encontrado));
  document.getElementById("login").style.display   = "none";
  document.getElementById("sistema").style.display = "flex";

  iniciarSistema(encontrado);
}

function iniciarSistema(usuario) {
  trocarPagina("home");

  const span = document.getElementById("nomeUsuario");
  if (span) span.innerText = `${usuario.user} (${usuario.tipo})`;

  const btnAdmin = document.getElementById("btnAdmin");
  btnAdmin.style.display = usuario.tipo === "Administrador" ? "block" : "none";
}

function trocarPagina(id) {
  // Atualiza páginas do lado esquerdo
  document.querySelectorAll(".pagina").forEach(p => p.classList.remove("ativa"));
  const pagEl = document.getElementById(id);
  if (pagEl) pagEl.classList.add("ativa");

  // Controla painéis do lado direito
  document.getElementById("dashboardPanel").style.display  = "none";
  document.getElementById("painelPermissoes").style.display = "none";
  document.getElementById("adminPanel").style.display       = "none";

  if (id === "home") {
    document.getElementById("dashboardPanel").style.display = "block";
    renderizarDashboard();
  } else if (id === "usuarios") {
    document.getElementById("painelPermissoes").style.display = "block";
    renderizarUsuarios();
  } else if (id === "admin") {
    document.getElementById("adminPanel").style.display = "block";
  }
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

function renderizarDashboard() {
  const logado = JSON.parse(localStorage.getItem("usuario"));
  if (!logado) return;

  // Contagens
  const total        = usuarios.length;
  const gerenc       = usuarios.filter(u => u.tipo === "Gerenciador").length;
  const superv       = usuarios.filter(u => u.tipo === "Supervisão").length;
  const comuns       = usuarios.filter(u => u.tipo === "Usuario").length;

  animarNumero("dashTotal",        total);
  animarNumero("dashGerenciadores", gerenc);
  animarNumero("dashSupervisores",  superv);
  animarNumero("dashUsuarios",      comuns);

  // Avatar e nome
  document.getElementById("dashAvatar").innerText   = logado.user.charAt(0).toUpperCase();
  document.getElementById("dashNome").innerText      = logado.user;
  document.getElementById("dashTipoBadge").innerText = logado.tipo;

  // Barra de nível
  const nivel   = nivelDo(logado.tipo) + 1; // 1–4
  const total_n = hierarquia.length;
  const pct     = (nivel / total_n) * 100;
  document.getElementById("dashNivelFill").style.width = pct + "%";
  document.getElementById("dashNivelTexto").innerText  = `Nível ${nivel} de ${total_n}`;

  // Permissões
  const perms     = permissoesPorTipo[logado.tipo] || [];
  const permsEl   = document.getElementById("dashPerms");
  permsEl.innerHTML = perms.map(p => `<span class="dash-perm-tag">✓ ${p}</span>`).join("");

  // Alertas
  const alertas   = alertasPorTipo[logado.tipo] || [];
  const alertasEl = document.getElementById("dashAlertasList");
  alertasEl.innerHTML = alertas.map(a =>
    `<div class="dash-alerta" style="border-left-color:${a.cor}">
      <span class="dash-alerta-dot" style="background:${a.cor}"></span>
      ${a.texto}
    </div>`
  ).join("");
}

function animarNumero(id, alvo) {
  const el    = document.getElementById(id);
  const dur   = 600;
  const steps = 30;
  const inc   = alvo / steps;
  let atual   = 0;
  let step    = 0;
  const timer = setInterval(() => {
    step++;
    atual = Math.round(inc * step);
    if (step >= steps) { atual = alvo; clearInterval(timer); }
    el.innerText = atual;
  }, dur / steps);
}

// ─── USUÁRIOS ─────────────────────────────────────────────────────────────────

function renderizarUsuarios() {
  const corpo   = document.getElementById("corpoTabela");
  corpo.innerHTML = "";

  const logado      = JSON.parse(localStorage.getItem("usuario"));
  const nivelLogado = nivelDo(logado.tipo);

  const visiveis = usuarios.filter(u => {
    if (logado.tipo === "Administrador") return true;
    return nivelDo(u.tipo) < nivelLogado;
  });

  let contador = 1;
  visiveis.forEach(u => {
    const tr      = document.createElement("tr");
    const isLogado = u.user === logado.user;
    if (isLogado) tr.classList.add("linha-logada");

    tr.innerHTML = `
      <td>${contador++}</td>
      <td>${u.user}${isLogado ? '<span class="tag-voce">● você</span>' : ''}</td>
      <td><span class="badge">${u.tipo}</span></td>
    `;
    tr.style.cursor = "pointer";
    tr.addEventListener("click", () => abrirPainel(u, tr));
    corpo.appendChild(tr);
  });

  fecharPainel();
}

function abrirPainel(u, trClicada) {
  document.getElementById("painelVazio").style.display    = "none";
  document.getElementById("painelDetalhes").style.display = "block";

  document.getElementById("painelNome").innerText   = u.user;
  document.getElementById("painelTipo").innerText   = u.tipo;
  document.getElementById("painelAvatar").innerText = u.user.charAt(0).toUpperCase();

  document.querySelectorAll("input[name='tipoAcesso']").forEach(r => {
    r.checked = r.value === u.tipo;
  });

  document.querySelectorAll(".tabela-usuarios tbody tr").forEach(tr => tr.classList.remove("linha-selecionada"));
  trClicada.classList.add("linha-selecionada");
}

function fecharPainel() {
  document.getElementById("painelVazio").style.display    = "flex";
  document.getElementById("painelDetalhes").style.display = "none";
}

function logout() {
  localStorage.removeItem("usuario");
  location.reload();
}

window.onload = function () {
  localStorage.removeItem("usuario");
};
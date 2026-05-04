// =============================================================
// CLASSES — Aula 07 (objetos/metodos) + Aula 08 (classes/getters/setters)
// =============================================================

class Usuario {
  constructor(user, senha, tipo) {
    this._user  = user;
    this._senha = senha;
    this._tipo  = tipo;
  }

  get user()  { return this._user;  }
  get senha() { return this._senha; }
  get tipo()  { return this._tipo;  }

  set tipo(novoTipo) {
    const validos = ["Usuario", "Supervisao", "Gerenciador", "Administrador"];
    if (validos.includes(novoTipo)) {
      this._tipo = novoTipo;
    } else {
      console.error("Tipo invalido:", novoTipo);
    }
  }

  getInicial() {
    return this._user.charAt(0).toUpperCase();
  }

  toJSON() {
    return { user: this._user, senha: this._senha, tipo: this._tipo };
  }
}

// =============================================================
// DADOS — Aula 07 (objetos) + Aula 09 (JSON)
// =============================================================

const DADOS_INICIAIS = [
  { user: "Erick",      senha: "2085", tipo: "Usuario"       },
  { user: "Gustavo",    senha: "3740", tipo: "Usuario"       },
  { user: "Supervisor", senha: "1234", tipo: "Supervisao"    },
  { user: "Gerente",    senha: "2101", tipo: "Gerenciador"   },
  { user: "Admin",      senha: "1010", tipo: "Administrador" }
];

const HIERARQUIA = ["Usuario", "Supervisao", "Gerenciador", "Administrador"];

const PERMISSOES_POR_TIPO = {
  "Usuario":       ["Ver proprio perfil"],
  "Supervisao":    ["Ver proprio perfil", "Ver usuarios comuns"],
  "Gerenciador":   ["Ver proprio perfil", "Ver usuarios", "Editar usuarios", "Gerar relatorios"],
  "Administrador": ["Ver proprio perfil", "Ver todos os usuarios", "Editar usuarios", "Acessar Admin", "Gerar relatorios", "Alterar configuracoes"]
};

const ALERTAS_POR_TIPO = {
  "Usuario":       [{ cor: "#3b82f6", texto: "Bem-vindo ao sistema! Navegue pelo menu lateral." }],
  "Supervisao":    [{ cor: "#3b82f6", texto: "Voce pode visualizar usuarios comuns." },
                   { cor: "#f59e0b", texto: "Relatorios nao estao disponiveis para seu nivel." }],
  "Gerenciador":   [{ cor: "#10b981", texto: "Acesso a relatorios habilitado." },
                   { cor: "#f59e0b", texto: "Area Admin restrita ao Administrador." }],
  "Administrador": [{ cor: "#10b981", texto: "Acesso total ao sistema habilitado." },
                   { cor: "#3b82f6", texto: "Voce pode gerenciar todos os usuarios." }]
};

// =============================================================
// ESTADO GLOBAL
// =============================================================

let listaUsuarios = DADOS_INICIAIS.map(function (d) {
  return new Usuario(d.user, d.senha, d.tipo);
});

let usuarioLogado = null;

// =============================================================
// UTILITARIOS — Aula 10 (funcoes)
// =============================================================

function nivelDo(tipo) {
  return HIERARQUIA.indexOf(tipo);
}

function animarNumero(id, alvo) {
  const el    = document.getElementById(id);
  const steps = 30;
  const inc   = alvo / steps;
  let step    = 0;
  const timer = setInterval(function () {
    step++;
    el.innerText = Math.round(inc * step);
    if (step >= steps) { el.innerText = alvo; clearInterval(timer); }
  }, 600 / steps);
}

function exibirPainelDireito(qual) {
  document.getElementById("dashboardPanel").style.display   = (qual === "dashboardPanel")   ? "block" : "none";
  document.getElementById("painelPermissoes").style.display = (qual === "painelPermissoes") ? "block" : "none";
  document.getElementById("adminPanel").style.display       = (qual === "adminPanel")       ? "block" : "none";
}

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
    // Valida se os dados possuem a estrutura esperada antes de usar
    if (!Array.isArray(dados) || dados.length === 0 || !dados[0].user) {
      throw new Error("Estrutura invalida");
    }
    listaUsuarios = dados.map(function (d) { return new Usuario(d.user, d.senha, d.tipo); });
  } catch (e) {
    console.warn("localStorage com problema, usando dados iniciais.");
    localStorage.removeItem("usuarios_sistema");
    // Garante que listaUsuarios volta ao estado inicial
    listaUsuarios = DADOS_INICIAIS.map(function (d) {
      return new Usuario(d.user, d.senha, d.tipo);
    });
  }
}

// =============================================================
// INICIALIZACAO
// =============================================================

window.onload = function () {
  // Limpa sessao anterior sem apagar usuarios salvos
  localStorage.removeItem("usuario_logado");

  // Garante que listaUsuarios começa com os dados iniciais,
  // depois tenta sobrescrever com o que estiver no localStorage
  listaUsuarios = DADOS_INICIAIS.map(function (d) {
    return new Usuario(d.user, d.senha, d.tipo);
  });

  carregarUsuariosDoLocal();

  document.getElementById("btnLogin").addEventListener("click", realizarLogin);
  document.getElementById("inputSenha").addEventListener("keydown", function (e) {
    if (e.key === "Enter") realizarLogin();
  });
};

// =============================================================
// LOGIN — Aula 04 (condicionais) + Arrays PDF (filter)
// =============================================================

function realizarLogin() {
  const inputUser  = document.getElementById("inputUsuario").value.trim();
  const inputSenha = document.getElementById("inputSenha").value.trim();
  const erroEl     = document.getElementById("erroLogin");

  const encontrados = listaUsuarios.filter(function (u) {
    return u.user === inputUser && u.senha === inputSenha;
  });

  if (encontrados.length === 0) {
    erroEl.innerText   = "Usuario ou senha invalidos.";
    erroEl.style.color = "#ff6b6b";
    return;
  }

  erroEl.innerText = "";
  usuarioLogado    = encontrados[0];

  localStorage.setItem("usuario_logado", JSON.stringify(usuarioLogado.toJSON()));

  document.getElementById("login").style.display   = "none";
  document.getElementById("sistema").style.display = "flex";

  iniciarSistema();
}

// =============================================================
// INICIAR SISTEMA
// =============================================================

function iniciarSistema() {
  document.getElementById("nomeUsuario").innerText =
    usuarioLogado.user + " (" + usuarioLogado.tipo + ")";

  const btnAdmin = document.getElementById("btnAdmin");
  btnAdmin.style.display = (usuarioLogado.tipo === "Administrador") ? "inline-block" : "none";

  document.getElementById("btnHome").addEventListener("click",     function () { trocarPagina("home");     });
  document.getElementById("btnUsuarios").addEventListener("click", function () { trocarPagina("usuarios"); });
  document.getElementById("btnAdmin").addEventListener("click",    function () { trocarPagina("admin");    });
  document.getElementById("btnSair").addEventListener("click", realizarLogout);

  trocarPagina("home");
}

// =============================================================
// NAVEGACAO — Aula 04 + Aula 07
// =============================================================

function trocarPagina(qual) {
  const paginas = document.querySelectorAll(".pagina");
  for (let i = 0; i < paginas.length; i++) {
    paginas[i].classList.remove("ativa");
  }

  if (qual === "home") {
    document.getElementById("paginaHome").classList.add("ativa");
    exibirPainelDireito("dashboardPanel");
    renderizarDashboard();
  } else if (qual === "usuarios") {
    document.getElementById("paginaUsuarios").classList.add("ativa");
    exibirPainelDireito("painelPermissoes");
    renderizarTabela();
  } else if (qual === "admin") {
    document.getElementById("paginaAdmin").classList.add("ativa");
    exibirPainelDireito("adminPanel");
  }
}

// =============================================================
// DASHBOARD — Arrays PDF (map/reduce) + Aula 08 (getters)
// =============================================================

function renderizarDashboard() {
  const contagens = listaUsuarios.reduce(function (acc, u) {
    acc.total++;
    if (u.tipo === "Gerenciador") acc.gerenciadores++;
    if (u.tipo === "Supervisao")  acc.supervisores++;
    if (u.tipo === "Usuario")     acc.comuns++;
    return acc;
  }, { total: 0, gerenciadores: 0, supervisores: 0, comuns: 0 });

  animarNumero("dashTotal",         contagens.total);
  animarNumero("dashGerenciadores", contagens.gerenciadores);
  animarNumero("dashSupervisores",  contagens.supervisores);
  animarNumero("dashUsuarios",      contagens.comuns);

  document.getElementById("dashAvatar").innerText    = usuarioLogado.getInicial();
  document.getElementById("dashNome").innerText      = usuarioLogado.user;
  document.getElementById("dashTipoBadge").innerText = usuarioLogado.tipo;

  const nivel = nivelDo(usuarioLogado.tipo) + 1;
  const pct   = (nivel / HIERARQUIA.length) * 100;
  document.getElementById("dashNivelFill").style.width = pct + "%";
  document.getElementById("dashNivelTexto").innerText  = "Nivel " + nivel + " de " + HIERARQUIA.length;

  const perms = PERMISSOES_POR_TIPO[usuarioLogado.tipo] || [];
  document.getElementById("dashPerms").innerHTML = perms
    .map(function (p) { return '<span class="dash-perm-tag">+ ' + p + '</span>'; })
    .join("");

  const alertas = ALERTAS_POR_TIPO[usuarioLogado.tipo] || [];
  document.getElementById("dashAlertasList").innerHTML = alertas
    .map(function (a) {
      return '<div class="dash-alerta" style="border-left-color:' + a.cor + '">' +
             '<span class="dash-alerta-dot" style="background:' + a.cor + '"></span>' +
             a.texto + '</div>';
    })
    .join("");
}

// =============================================================
// TABELA — Arrays PDF (filter) + Aula 04 (condicionais)
// =============================================================

function renderizarTabela() {
  const corpo = document.getElementById("corpoTabela");
  corpo.innerHTML = "";

  const nivelLogado = nivelDo(usuarioLogado.tipo);

  const visiveis = listaUsuarios.filter(function (u) {
    if (usuarioLogado.tipo === "Administrador") return true;
    return nivelDo(u.tipo) < nivelLogado;
  });

  for (let i = 0; i < visiveis.length; i++) {
    const u        = visiveis[i];
    const tr       = document.createElement("tr");
    const isLogado = (u.user === usuarioLogado.user);

    if (isLogado) tr.classList.add("linha-logada");

    const tagVoce = isLogado ? '<span class="tag-voce">voce</span>' : "";

    tr.innerHTML =
      "<td>" + (i + 1) + "</td>" +
      "<td>" + u.user + tagVoce + "</td>" +
      "<td><span class='badge'>" + u.tipo + "</span></td>";

    tr.style.cursor = "pointer";

    tr.addEventListener("click", (function (usuario, linha) {
      return function () { abrirPainel(usuario, linha); };
    })(u, tr));

    corpo.appendChild(tr);
  }

  fecharPainel();
}

// =============================================================
// PAINEL — Aula 07 (arrays) + Aula 08 (setter) + Aula 09 (persist)
// =============================================================

function abrirPainel(u, trClicada) {
  document.getElementById("painelVazio").style.display    = "none";
  document.getElementById("painelDetalhes").style.display = "block";

  document.getElementById("painelAvatar").innerText = u.getInicial();
  document.getElementById("painelNome").innerText   = u.user;
  document.getElementById("painelTipo").innerText   = u.tipo;

  const radios = document.querySelectorAll("input[name='tipoAcesso']");
  for (let i = 0; i < radios.length; i++) {
    radios[i].checked = (radios[i].value === u.tipo);
  }

  const perms = PERMISSOES_POR_TIPO[u.tipo] || [];
  document.getElementById("listaPermissoes").innerHTML = perms
    .map(function (p) {
      return '<label class="opcao-check"><input type="checkbox" checked> ' + p + '</label>';
    })
    .join("");

  const linhas = document.querySelectorAll(".tabela-usuarios tbody tr");
  for (let i = 0; i < linhas.length; i++) linhas[i].classList.remove("linha-selecionada");
  trClicada.classList.add("linha-selecionada");

  document.getElementById("btnSalvar").onclick = function () {
    const selecionado = document.querySelector("input[name='tipoAcesso']:checked");
    if (selecionado) {
      u.tipo = selecionado.value;
      salvarUsuariosLocal();
      renderizarTabela();
    }
  };

  document.getElementById("btnCancelar").onclick = fecharPainel;
}

function fecharPainel() {
  document.getElementById("painelVazio").style.display    = "flex";
  document.getElementById("painelDetalhes").style.display = "none";
}

// =============================================================
// LOGOUT — Aula 09
// =============================================================

function realizarLogout() {
  localStorage.removeItem("usuario_logado");
  usuarioLogado = null;
  location.reload();
}
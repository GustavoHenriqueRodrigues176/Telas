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
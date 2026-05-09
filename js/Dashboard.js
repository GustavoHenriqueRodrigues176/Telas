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
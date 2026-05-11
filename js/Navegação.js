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
  } else if (qual === "contato") {
    document.getElementById("paginaContato").classList.add("ativa");
}
}
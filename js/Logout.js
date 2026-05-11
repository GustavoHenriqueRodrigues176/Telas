// =============================================================
// LOGOUT — Aula 09
// =============================================================

function realizarLogout() {
  localStorage.removeItem("usuario_logado");
  usuarioLogado = null;
  location.reload();
}
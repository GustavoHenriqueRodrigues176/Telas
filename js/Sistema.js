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
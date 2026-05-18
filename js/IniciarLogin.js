// =============================================================
// INICIALIZACAO
// =============================================================

window.onload = function () {
  localStorage.removeItem("usuario_logado");

  // Carrega usuarios salvos (com bloqueios preservados)
  // Se nao houver nada salvo, usa os dados iniciais
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
// LOGIN
// =============================================================

function realizarLogin() {
  const erroEl = document.getElementById("erroLogin");

  try {
    const inputUser  = document.getElementById("inputUsuario").value.trim();
    const inputSenha = document.getElementById("inputSenha").value.trim();

    if (inputUser === "" || inputSenha === "") {
      throw new Error("Preencha usuario e senha.");
    }

    const encontrados = listaUsuarios.filter(function (u) {
      return u.user === inputUser && u.senha === inputSenha;
    });

    if (encontrados.length === 0) {
      throw new Error("Usuario ou senha invalidos.");
    }

    const usuario = encontrados[0];

    // Verifica bloqueio
    if (usuario.bloqueado) {
      registrarLog("login", "Tentativa bloqueada: \"" + inputUser + "\"");
      throw new Error("Acesso bloqueado. Contate o administrador.");
    }

    erroEl.innerText = "";
    usuarioLogado    = usuario;

    registrarLog("login", "Login: \"" + usuarioLogado.user + "\" (" + usuarioLogado.tipo + ")");

    localStorage.setItem("usuario_logado", JSON.stringify(usuarioLogado.toJSON()));

    document.getElementById("login").style.display   = "none";
    document.getElementById("sistema").style.display = "flex";

    iniciarSistema();

  } catch (erro) {
    erroEl.innerText   = erro.message;
    erroEl.style.color = "#ff5656";
  }
}
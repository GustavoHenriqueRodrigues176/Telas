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
  const erroEl = document.getElementById("erroLogin");

  try {
    const inputUser  = document.getElementById("inputUsuario").value.trim();
    const inputSenha = document.getElementById("inputSenha").value.trim();

    // Validação dos campos
    if (inputUser === "" || inputSenha === "") {
      throw new Error("Preencha usuario e senha.");
    }

    const encontrados = listaUsuarios.filter(function (u) {
      return u.user === inputUser && u.senha === inputSenha;
    });

    // Usuario nao encontrado
    if (encontrados.length === 0) {
      throw new Error("Usuario ou senha invalidos.");
    }

    erroEl.innerText = "";
    usuarioLogado = encontrados[0];

    localStorage.setItem(
      "usuario_logado",
      JSON.stringify(usuarioLogado.toJSON())
    );

    document.getElementById("login").style.display = "none";
    document.getElementById("sistema").style.display = "flex";

    iniciarSistema();

  } catch (erro) {

    erroEl.innerText = erro.message;
    erroEl.style.color = "#ff5656";

    console.error("Erro no login:", erro);

  }
}
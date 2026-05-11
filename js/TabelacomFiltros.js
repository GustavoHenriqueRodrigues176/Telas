// =============================================================
// TABELA — Arrays PDF (filter) + Aula 04 (condicionais)
// =============================================================

function renderizarTabela() {
  const corpo = document.getElementById("corpoTabela");
  corpo.innerHTML = "";

  const nivelLogado = nivelDo(usuarioLogado.tipo);

  const filtro = document.getElementById("filtroTipo").value;

  const visiveis = listaUsuarios.filter(function (u) {

  // FILTRO DE HIERARQUIA
  const permitido =
    usuarioLogado.tipo === "Administrador" ||
    nivelDo(u.tipo) < nivelLogado;

  // FILTRO DO SELECT
  const filtroTipo =
    filtro === "Todos" ||
    u.tipo === filtro;

  return permitido && filtroTipo;
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

document.getElementById("filtroTipo")
  .addEventListener("change", renderizarTabela);
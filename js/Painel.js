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
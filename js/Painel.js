// =============================================================
// PAINEL — Aula 07 (arrays) + Aula 08 (setter) + Aula 09 (persist)
// =============================================================

function abrirPainel(u, trClicada) {

  if (u.user === usuarioLogado.user) {
    mostrarPainelSomenteLeitura(u, trClicada, "Voce nao pode editar o proprio perfil.");
    return;
  }

  if (nivelDo(u.tipo) >= nivelDo(usuarioLogado.tipo)) {
    mostrarPainelSomenteLeitura(u, trClicada, "Voce nao tem permissao para editar este usuario.");
    return;
  }

  document.getElementById("painelVazio").style.display    = "none";
  document.getElementById("painelDetalhes").style.display = "block";

  document.getElementById("painelAvatar").innerText = u.getInicial();
  document.getElementById("painelNome").innerText   = u.user;
  document.getElementById("painelTipo").innerText   = u.tipo;

  habilitarEdicaoPainel(true);

  const radios = document.querySelectorAll("input[name='tipoAcesso']");
  for (let i = 0; i < radios.length; i++) {
    const radio     = radios[i];
    const permitido = nivelDo(radio.value) < nivelDo(usuarioLogado.tipo);
    radio.disabled  = !permitido;
    radio.checked   = (radio.value === u.tipo);
    const label = radio.closest("label");
    if (label) {
      label.style.opacity = permitido ? "1" : "0.4";
      label.style.cursor  = permitido ? "pointer" : "not-allowed";
    }
    radio.onchange = function () {
      const novoTipo  = document.querySelector("input[name='tipoAcesso']:checked").value;
      renderizarCheckboxesDoTipo(novoTipo);
    };
  }

  renderizarCheckboxesDoTipo(u.tipo);

  const linhas = document.querySelectorAll(".tabela-usuarios tbody tr");
  for (let i = 0; i < linhas.length; i++) linhas[i].classList.remove("linha-selecionada");
  trClicada.classList.add("linha-selecionada");

  document.getElementById("btnSalvar").onclick = function () {
    const radioSelecionado = document.querySelector("input[name='tipoAcesso']:checked");
    if (!radioSelecionado) return;

    if (nivelDo(radioSelecionado.value) >= nivelDo(usuarioLogado.tipo)) {
      alert("Voce nao pode atribuir este nivel de acesso.");
      return;
    }

    const tipoAnterior = u.tipo;
    u.tipo       = radioSelecionado.value;
    u.permissoes = PERMISSOES_POR_TIPO[u.tipo] ? [...PERMISSOES_POR_TIPO[u.tipo]] : [];

    registrarLog("permissao",
      '"' + usuarioLogado.user + '" alterou "' + u.user +
      '" de ' + tipoAnterior + ' para ' + u.tipo
    );

    document.getElementById("painelTipo").innerText = u.tipo;
    renderizarCheckboxesDoTipo(u.tipo);

    salvarUsuariosLocal();
    renderizarTabela();

    const btn = document.getElementById("btnSalvar");
    const textoOriginal = btn.innerText;
    btn.innerText = "Salvo!";
    btn.style.background = "#10b981";
    setTimeout(function () {
      btn.innerText = textoOriginal;
      btn.style.background = "";
    }, 1500);
  };

  document.getElementById("btnCancelar").onclick = fecharPainel;
}

// =============================================================
// PAINEL SOMENTE LEITURA
// =============================================================

function mostrarPainelSomenteLeitura(u, trClicada, mensagem) {
  document.getElementById("painelVazio").style.display    = "none";
  document.getElementById("painelDetalhes").style.display = "block";

  document.getElementById("painelAvatar").innerText = u.getInicial();
  document.getElementById("painelNome").innerText   = u.user;
  document.getElementById("painelTipo").innerText   = u.tipo;

  const radios = document.querySelectorAll("input[name='tipoAcesso']");
  for (let i = 0; i < radios.length; i++) {
    radios[i].checked  = (radios[i].value === u.tipo);
    radios[i].disabled = true;
    const label = radios[i].closest("label");
    if (label) { label.style.opacity = "0.5"; label.style.cursor = "not-allowed"; }
  }

  renderizarCheckboxesDoTipo(u.tipo);
  habilitarEdicaoPainel(false, mensagem);

  const linhas = document.querySelectorAll(".tabela-usuarios tbody tr");
  for (let i = 0; i < linhas.length; i++) linhas[i].classList.remove("linha-selecionada");
  trClicada.classList.add("linha-selecionada");

  document.getElementById("btnCancelar").onclick = fecharPainel;
}

// =============================================================
// CHECKBOXES
// =============================================================

function renderizarCheckboxesDoTipo(tipo) {
  const perms     = PERMISSOES_POR_TIPO[tipo] || [];
  const container = document.getElementById("listaPermissoes");
  container.innerHTML = perms
    .map(function (p) {
      return '<label class="opcao-check">' +
               '<input type="checkbox" value="' + p + '" checked disabled> ' + p +
             '</label>';
    })
    .join("");
}

// =============================================================
// HELPERS
// =============================================================

function habilitarEdicaoPainel(ativo, mensagem) {
  const btnSalvar      = document.getElementById("btnSalvar");
  const avisoExistente = document.getElementById("avisoPermissao");
  if (avisoExistente) avisoExistente.remove();

  if (ativo) {
    btnSalvar.disabled      = false;
    btnSalvar.style.opacity = "1";
    btnSalvar.style.cursor  = "pointer";
  } else {
    btnSalvar.disabled      = true;
    btnSalvar.style.opacity = "0.4";
    btnSalvar.style.cursor  = "not-allowed";
    btnSalvar.onclick       = null;

    const aviso = document.createElement("p");
    aviso.id            = "avisoPermissao";
    aviso.innerText     = mensagem || "Sem permissao para editar.";
    aviso.style.cssText = "font-size:12px;color:#e55;margin:8px 0 0 0;font-style:italic;";
    document.querySelector(".painel-acoes").appendChild(aviso);
  }
}

function fecharPainel() {
  document.getElementById("painelVazio").style.display    = "flex";
  document.getElementById("painelDetalhes").style.display = "none";
  const aviso = document.getElementById("avisoPermissao");
  if (aviso) aviso.remove();
}
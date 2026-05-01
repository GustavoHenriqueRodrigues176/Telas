const usuarios = [
  { user: "Erick",      senha: "2085", tipo: "Usuario1"     },
  { user: "Gustavo",    senha: "3740", tipo: "Usuario2"     },
  { user: "Supervisor", senha: "1234", tipo: "Supervisão"   },
  { user: "Gerente",    senha: "2101", tipo: "Gerenciador"  },
  { user: "Admin",      senha: "1010", tipo: "Administrador"}
];

// Tipos que têm acesso à área Admin
const tiposAdmin = ["Administrador", "Gerenciador"];

function login() {
  const user  = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();

  const encontrado = usuarios.find(
    u => u.user === user && u.senha === senha
  );

  if (!encontrado) {
    document.getElementById("erro").innerText = "Login inválido!";
    return;
  }

  localStorage.setItem("usuario", JSON.stringify(encontrado));

  document.getElementById("login").style.display  = "none";
  document.getElementById("sistema").style.display = "flex";

  iniciarSistema(encontrado);
}

function iniciarSistema(usuario) {
  trocarPagina("home");

  // Exibe o nome e tipo no topo
  const span = document.getElementById("nomeUsuario");
  if (span) span.innerText = `${usuario.user} (${usuario.tipo})`;

  const btnAdmin = document.getElementById("btnAdmin");

  if (tiposAdmin.includes(usuario.tipo)) {
    btnAdmin.style.display = "block";
  } else {
    btnAdmin.style.display = "none";
  }
}

function trocarPagina(id) {
  document.querySelectorAll(".pagina").forEach(p => p.classList.remove("ativa"));
  document.getElementById(id).classList.add("ativa");
}

function logout() {
  localStorage.removeItem("usuario");
  location.reload();
}

window.onload = function () {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario) {
    document.getElementById("login").style.display  = "none";
    document.getElementById("sistema").style.display = "flex";
    iniciarSistema(usuario);
  }
};
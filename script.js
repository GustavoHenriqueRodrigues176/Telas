const usuarios = [
  { user: "admin", senha: "123", tipo: "admin" },
  { user: "gugu", senha: "123", tipo: "usuario" }
];

function login() {
  const user = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;

  const encontrado = usuarios.find(u => u.user === user && u.senha === senha);

  if (!encontrado) {
    document.getElementById("erro").innerText = "Login inválido!";
    return;
  }

  localStorage.setItem("usuario", JSON.stringify(encontrado));

  document.getElementById("login").style.display = "none";
  document.getElementById("sistema").style.display = "flex";

  iniciarSistema(encontrado);
}

function iniciarSistema(usuario) {
  trocarPagina("home");

  const btnAdmin = document.getElementById("btnAdmin");

  if (usuario.tipo === "admin") {
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

window.onload = function() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (usuario) {
    document.getElementById("login").style.display = "none";
    document.getElementById("sistema").style.display = "flex";
    iniciarSistema(usuario);
  }
};
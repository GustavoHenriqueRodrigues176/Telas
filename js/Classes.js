// =============================================================
// CLASSES — Aula 07 (objetos/metodos) + Aula 08 (classes/getters/setters)
// =============================================================

class Usuario {
  constructor(user, senha, tipo) {
    this._user  = user;
    this._senha = senha;
    this._tipo  = tipo;
  }

  get user()  { return this._user;  }
  get senha() { return this._senha; }
  get tipo()  { return this._tipo;  }

  set tipo(novoTipo) {
    const validos = ["Usuario", "Supervisao", "Gerenciador", "Administrador"];
    if (validos.includes(novoTipo)) {
      this._tipo = novoTipo;
    } else {
      console.error("Tipo invalido:", novoTipo);
    }
  }

  getInicial() {
    return this._user.charAt(0).toUpperCase();
  }

  toJSON() {
    return { user: this._user, senha: this._senha, tipo: this._tipo };
  }
}
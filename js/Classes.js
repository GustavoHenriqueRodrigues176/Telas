// =============================================================
// CLASSES — Aula 07 (objetos/metodos) + Aula 08 (classes/getters/setters)
// =============================================================

class Usuario {
  constructor(user, senha, tipo, permissoes, bloqueado) {
    this._user       = user;
    this._senha      = senha;
    this._tipo       = tipo;
    this._permissoes = Array.isArray(permissoes)
      ? permissoes
      : (PERMISSOES_POR_TIPO[tipo] ? [...PERMISSOES_POR_TIPO[tipo]] : []);
    this._bloqueado  = bloqueado === true;
  }

  get user()       { return this._user;       }
  get senha()      { return this._senha;      }
  get tipo()       { return this._tipo;       }
  get permissoes() { return this._permissoes; }
  get bloqueado()  { return this._bloqueado;  }

  set tipo(novoTipo) {
    const validos = ["Usuario", "Supervisao", "Gerenciador", "Administrador"];
    if (validos.includes(novoTipo)) this._tipo = novoTipo;
    else console.error("Tipo invalido:", novoTipo);
  }

  set permissoes(lista) {
    if (Array.isArray(lista)) this._permissoes = lista;
  }

  set bloqueado(valor) {
    this._bloqueado = valor === true;
  }

  temPermissao(perm) {
    return this._permissoes.includes(perm);
  }

  getInicial() {
    return this._user.charAt(0).toUpperCase();
  }

  toJSON() {
    return {
      user:       this._user,
      senha:      this._senha,
      tipo:       this._tipo,
      permissoes: this._permissoes,
      bloqueado:  this._bloqueado
    };
  }
}
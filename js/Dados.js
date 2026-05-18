// =============================================================
// DADOS — Aula 07 (objetos) + Aula 09 (JSON)
// =============================================================

const DADOS_INICIAIS = [
  { user: "Erick",      senha: "2085", tipo: "Usuario"       },
  { user: "Gustavo",    senha: "3740", tipo: "Usuario"       },
  { user: "Supervisor", senha: "1234", tipo: "Supervisao"    },
  { user: "Gerente",    senha: "2101", tipo: "Gerenciador"   },
  { user: "Admin",      senha: "1010", tipo: "Administrador" }
];

const HIERARQUIA = ["Usuario", "Supervisao", "Gerenciador", "Administrador"];

// Todas as permissoes existentes no sistema
const TODAS_PERMISSOES = [
  "Ver proprio perfil",
  "Ver usuarios comuns",
  "Ver usuarios",
  "Ver todos os usuarios",
  "Editar usuarios",
  "Acessar Admin",
  "Gerar relatorios",
  "Alterar configuracoes"
];

// Permissoes padrao concedidas ao criar/resetar cada tipo
const PERMISSOES_POR_TIPO = {
  "Usuario":       ["Ver proprio perfil"],
  "Supervisao":    ["Ver proprio perfil", "Ver usuarios comuns"],
  "Gerenciador":   ["Ver proprio perfil", "Ver usuarios", "Editar usuarios", "Gerar relatorios"],
  "Administrador": ["Ver proprio perfil", "Ver todos os usuarios", "Editar usuarios", "Acessar Admin", "Gerar relatorios", "Alterar configuracoes"]
};

const ALERTAS_POR_TIPO = {
  "Usuario":       [{ cor: "#3b82f6", texto: "Bem-vindo ao sistema! Navegue pelo menu lateral." }],
  "Supervisao":    [{ cor: "#3b82f6", texto: "Voce pode visualizar usuarios comuns." },
                   { cor: "#f59e0b", texto: "Relatorios nao estao disponiveis para seu nivel." }],
  "Gerenciador":   [{ cor: "#10b981", texto: "Acesso a relatorios habilitado." },
                   { cor: "#f59e0b", texto: "Area Admin restrita ao Administrador." }],
  "Administrador": [{ cor: "#10b981", texto: "Acesso total ao sistema habilitado." },
                   { cor: "#3b82f6", texto: "Voce pode gerenciar todos os usuarios." }]
};
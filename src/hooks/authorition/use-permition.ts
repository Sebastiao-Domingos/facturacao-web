// src/hooks/empresa/usePermissions.ts
import { useFuncionarioAtual } from "../empresa/use-funcionario";

export type Permissao =
  // Usuários e perfis
  | "gerir_usuarios" // criar/editar/remover funcionários (apenas SUPERADMIN/ADMIN)
  | "ativar_desativar" // alterar status de funcionários
  // Relatórios
  | "ver_relatorios" // aceder a relatórios (todos os autenticados)
  // Filiais e empresas
  | "gerir_filiais" // criar/editar filiais (apenas SUPERADMIN)
  // Produtos e stock
  | "gerir_produtos" // criar/editar produtos (apenas SUPERADMIN/ADMIN)
  | "gerir_stock" // movimentar stock (apenas SUPERADMIN/ADMIN/GESTOR)
  // Documentos fiscais
  | "listar_documentos" // ver lista de documentos (filtrada por perfil)
  | "criar_documentos" // criar novos documentos (rascunhos) – operadores e gestores
  | "emitir_documentos" // emitir documentos (atribuir número e actualizar stock)
  | "anular_documentos" // anular documentos emitidos (apenas SUPERADMIN/ADMIN/GESTOR)
  | "ver_todos_documentos" // ver documentos de todas as filiais (apenas ADMIN/SUPERADMIN)
  // Pagamentos
  | "listar_pagamentos" // ver lista de pagamentos (filtrada por perfil)
  | "registrar_pagamentos" // registar pagamentos para documentos
  | "anular_pagamentos" // estornar/anular pagamentos (apenas SUPERADMIN/ADMIN)
  // Configurações gerais
  | "gerir_configuracoes" // apenas SUPERADMIN
  | "gerir_unidades"
  | "gerir_taxas" // criar/editar taxas de IVA (apenas SUPERADMIN/ADMIN)
  | "gerir_clientes"; // criar/editar clientes (apenas SUPERADMIN/ADMIN/GESTOR? conforme política)

// Mapeamento de permissões por papel
const permissoesPorPapel: Record<string, Permissao[]> = {
  SUPERADMIN: [
    "gerir_usuarios",
    "ativar_desativar",
    "ver_relatorios",
    "gerir_filiais",
    "gerir_produtos",
    "gerir_stock",
    "listar_documentos",
    "criar_documentos",
    "emitir_documentos",
    "anular_documentos",
    "ver_todos_documentos",
    "listar_pagamentos",
    "registrar_pagamentos",
    "anular_pagamentos",
    "gerir_configuracoes",
    "gerir_taxas",
    "gerir_unidades",
    "gerir_clientes",
  ],
  ADMIN: [
    "gerir_usuarios", // apenas da sua empresa
    "ativar_desativar",
    "ver_relatorios",
    // "gerir_filiais",        // ← removido (apenas SUPERADMIN)
    "gerir_produtos", // pode gerir produtos da sua empresa
    "gerir_stock",
    "listar_documentos",
    "criar_documentos",
    "emitir_documentos",
    "anular_documentos",
    "ver_todos_documentos", // documentos de todas as filiais da empresa
    "listar_pagamentos",
    "registrar_pagamentos",
    "anular_pagamentos",
    // "gerir_configuracoes",  // ← removido (apenas SUPERADMIN)
    "gerir_taxas",
    "gerir_clientes",
    "gerir_unidades",
  ],
  GESTOR: [
    "ver_relatorios",
    // "gerir_produtos",       // ← removido (apenas ADMIN/SUPERADMIN)
    "gerir_stock", // gestor pode movimentar stock da sua filial
    "listar_documentos",
    "criar_documentos",
    "emitir_documentos",
    "anular_documentos", // apenas documentos da sua filial
    "listar_pagamentos",
    "registrar_pagamentos",
    // "gerir_clientes",       // ← removido (apenas ADMIN/SUPERADMIN)
  ],
  OPERADOR: [
    // Nenhuma permissão de "gerir"
    "listar_documentos", // apenas os seus (ou da filial)
    "criar_documentos",
    "emitir_documentos",
    "listar_pagamentos",
    "registrar_pagamentos", // apenas nos documentos que criou
  ],
  CONTABILISTA: [
    "ver_relatorios",
    "listar_documentos",
    "listar_pagamentos",
    // Nenhuma permissão de criação/edição/eliminação
  ],
};

export function usePermissions() {
  const { data: perfilAtual, isLoading } = useFuncionarioAtual();

  const papel = perfilAtual?.papel ?? "OPERADOR";

  const hasPermission = (permissao: Permissao): boolean => {
    if (!perfilAtual) return false;
    const permissoes = permissoesPorPapel[papel] || [];
    return permissoes.includes(permissao);
  };

  // Helpers de papel
  const isAdmin = papel === "ADMIN" || papel === "SUPERADMIN";
  const isSuperAdmin = papel === "SUPERADMIN";
  const isGestor = papel === "GESTOR";
  const isOperador = papel === "OPERADOR";
  const isContabilista = papel === "CONTABILISTA";

  // Helpers específicos para documentos e pagamentos
  const podeListarDocumentos = () => hasPermission("listar_documentos");
  const podeCriarDocumentos = () => hasPermission("criar_documentos");
  const podeEmitirDocumentos = () => hasPermission("emitir_documentos");
  const podeAnularDocumentos = () => hasPermission("anular_documentos");
  const podeVerTodosDocumentos = () => hasPermission("ver_todos_documentos");

  const podeListarPagamentos = () => hasPermission("listar_pagamentos");
  const podeRegistrarPagamentos = () => hasPermission("registrar_pagamentos");
  const podeAnularPagamentos = () => hasPermission("anular_pagamentos");

  // Helpers para gestão
  const podeGerirUsuarios = () => hasPermission("gerir_usuarios");
  const podeGerirFiliais = () => hasPermission("gerir_filiais");
  const podeGerirProdutos = () => hasPermission("gerir_produtos");
  const podeGerirStock = () => hasPermission("gerir_stock");
  const podeGerirConfiguracoes = () => hasPermission("gerir_configuracoes");
  const podeGerirTaxas = () => hasPermission("gerir_taxas");
  const podeGerirClientes = () => hasPermission("gerir_clientes");
  const podeGerirUnidades = () => hasPermission("gerir_unidades");

  return {
    isLoading,
    papel,
    hasPermission,
    isAdmin,
    isSuperAdmin,
    isGestor,
    isOperador,
    isContabilista,
    // Documentos
    podeListarDocumentos,
    podeCriarDocumentos,
    podeEmitirDocumentos,
    podeAnularDocumentos,
    podeVerTodosDocumentos,
    // Pagamentos
    podeListarPagamentos,
    podeRegistrarPagamentos,
    podeAnularPagamentos,
    // Gestão
    podeGerirUsuarios,
    podeGerirFiliais,
    podeGerirProdutos,
    podeGerirStock,
    podeGerirConfiguracoes,
    podeGerirTaxas,
    podeGerirClientes,
    podeGerirUnidades,
  };
}

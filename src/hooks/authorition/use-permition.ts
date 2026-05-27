// src/hooks/empresa/usePermissions.ts

import { useFuncionarioAtual } from "../empresa/use-funcionario";

type Permissao =
  | "gerir_usuarios" // criar/editar/remover funcionários
  | "ativar_desativar" // alterar status de funcionários
  | "ver_relatorios" // aceder a relatórios
  | "gerir_filiais" // criar/editar filiais
  | "gerir_produtos" // criar/editar produtos
  | "gerir_stock" // movimentar stock
  | "emitir_documentos" // emitir facturas, pro-formas, etc.
  | "anular_documentos" // anular documentos fiscais
  | "ver_todos_documentos" // ver documentos de todas as filiais
  | "gerir_configuracoes"
  | "gerir_taxas"
  | "gerir_clientes";

// Mapeamento de permissões por papel
const permissoesPorPapel: Record<string, Permissao[]> = {
  SUPERADMIN: [
    "gerir_usuarios",
    "ativar_desativar",
    "ver_relatorios",
    "gerir_filiais",
    "gerir_produtos",
    "gerir_stock",
    "emitir_documentos",
    "anular_documentos",
    "ver_todos_documentos",
    "gerir_configuracoes",
    "gerir_taxas",
    "gerir_clientes",
  ],
  ADMIN: [
    "gerir_usuarios",
    "ativar_desativar",
    "ver_relatorios",
    "gerir_produtos",
    "gerir_stock",
    "emitir_documentos",
    "anular_documentos",
    "ver_todos_documentos",
    "gerir_configuracoes",
    "gerir_taxas",
    "gerir_clientes",
  ],
  GESTOR: [
    "ver_relatorios",
    "gerir_produtos",
    "gerir_stock",
    "emitir_documentos",
  ],
  OPERADOR: ["emitir_documentos"],
  CONTABILISTA: ["ver_relatorios", "emitir_documentos"],
};

export function usePermissions() {
  const { data: perfilAtual, isLoading } = useFuncionarioAtual();

  const papel = perfilAtual?.papel ?? "OPERADOR";

  const hasPermission = (permissao: Permissao): boolean => {
    if (!perfilAtual) return false;
    const permissoes = permissoesPorPapel[papel] || [];
    return permissoes.includes(permissao);
  };

  const isAdmin = papel === "ADMIN" || papel === "SUPERADMIN";
  const isSuperAdmin = papel === "SUPERADMIN";
  const isGestor = papel === "GESTOR";
  const isOperador = papel === "OPERADOR";
  const isContabilista = papel === "CONTABILISTA";

  return {
    isLoading,
    papel,
    hasPermission,
    isAdmin,
    isSuperAdmin,
    isGestor,
    isOperador,
    isContabilista,
  };
}

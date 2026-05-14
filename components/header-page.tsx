interface HeaderPageProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  totalItens?: number;
  totalParcialItens?: number;

  totalPaginas?: number;
  paginaAtual?: number;
}

export function HeaderPage({
  title,
  children,
  description,
  totalItens,
  totalPaginas,

  totalParcialItens,
  paginaAtual,
}: HeaderPageProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black tracking-tighter uppercase text-primary">
          {title}
        </h1>

        {totalPaginas && paginaAtual && (
          <p className="text-muted-foreground font-medium">
            Página {paginaAtual} de {totalPaginas}
          </p>
        )}
        {totalItens && totalParcialItens && (
          <p className="text-muted-foreground font-medium">
            Exibindo {totalParcialItens} de {totalItens} produtos registados.
          </p>
        )}
        {description && (
          <p className="text-muted-foreground font-medium">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

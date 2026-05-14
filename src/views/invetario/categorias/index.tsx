import { ErrorComponent } from "@/components/error-component";
import { HeaderPage } from "@/components/header-page";
import { Loader } from "@/components/loader";

export function CategoriesPage() {
  return (
    <div>
      <HeaderPage
        title="Categorias"
        description="Gerencie as categorias do seu inventário"
      >
        <div className="flex gap-2">
          <button className="btn btn-primary">Adicionar Categoria</button>
        </div>
      </HeaderPage>
      <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-2">
        <h1 className="text-2xl font-bold text-primary">
          Gerenciar Categorias
        </h1>
        <p className="text-sm text-muted-foreground">
          Esta funcionalidade ainda está em desenvolvimento. Por favor, volte
          mais tarde.
        </p>
      </div>

      <ErrorComponent message="Erro ao carregar categorias" />
      <Loader />
    </div>
  );
}

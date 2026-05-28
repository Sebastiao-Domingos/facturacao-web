"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  ArrowLeft,
  Edit,
  Power,
  PowerOff,
  MapPin,
  Calendar,
  Building2,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/error-component";
import { toast } from "sonner";
import {
  formatarMoeda,
  formatarNumero,
} from "@/src/schemas/dashboard/dashboard-schema";
import { AfilialForm } from "../forms/afilia-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmModal } from "@/src/components/shared/confirm-delete-modal";
import { useFilial } from "@/src/hooks/empresa/afilia/use-afilia";
import { usePermissions } from "@/src/hooks/authorition/use-permition";

// Hook useFilial (deve ser criado)
// Exemplo: queryFn: () => api.get(`/organizacao/filiais/${id}/?include_funcionarios=true&include_stocks=true`)

export function FilialDetailPage() {
  const { filial: id } = useParams();
  const router = useRouter();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const { podeGerirFiliais, isLoading: isLoadingPermissions } =
    usePermissions();

  // Hook que busca a filial com detalhes (inclui funcionários e stocks)
  const { data: filial, isLoading, isError, refetch } = useFilial(id as string);

  const handleToggleStatus = () => {
    setStatusModalOpen(true);
  };

  const confirmToggleStatus = () => {
    // Implementar chamada para ativar/desativar
    toast.success(
      filial?.ativo
        ? "Filial desativada com sucesso!"
        : "Filial ativada com sucesso!",
    );
    setStatusModalOpen(false);
    refetch();
  };

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    refetch();
  };

  if (isLoading || isLoadingPermissions) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !filial) {
    return (
      <ErrorComponent
        message="Filial não encontrada"
        description="A filial que procura não existe ou foi removida."
      />
    );
  }

  const endereco = filial.endereco;
  const dataCriacao = filial.created_at
    ? format(new Date(filial.created_at), "dd/MM/yyyy 'às' HH:mm", {
        locale: pt,
      })
    : "---";

  const totalFuncionarios = filial.total_funcionarios ?? 0;
  const funcionariosAtivos = filial.funcionarios_ativos ?? 0;
  const totalProdutosStock = filial.total_produtos_stock ?? 0;
  const produtosStockMinimo = filial.produtos_com_stock_minimo ?? 0;
  const produtosEsgotados = filial.produtos_esgotados ?? 0;
  const valorTotalStock = filial.valor_total_stock ?? 0;
  const funcionariosList = filial.funcionarios ?? [];
  const stocksList = filial.stocks ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight">
                {filial.nome}
              </h1>
              <Badge
                variant={filial.ativo ? "default" : "secondary"}
                className={filial.ativo ? "bg-green-600" : ""}
              >
                {filial.ativo ? "Ativo" : "Inativo"}
              </Badge>
              {filial.e_sede && <Badge variant="default">Sede</Badge>}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Código AGT: {filial.codigo_agt} • Série: {filial.serie_documentos}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {podeGerirFiliais() && (
            <>
              <Button variant="outline" onClick={() => setEditModalOpen(true)}>
                <Edit size={16} className="mr-2" />
                Editar
              </Button>
              <Button
                variant={filial.ativo ? "destructive" : "default"}
                onClick={handleToggleStatus}
              >
                {filial.ativo ? (
                  <>
                    <PowerOff size={16} className="mr-2" />
                    Desativar
                  </>
                ) : (
                  <>
                    <Power size={16} className="mr-2" />
                    Ativar
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Funcionários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatarNumero(totalFuncionarios)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {funcionariosAtivos} ativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produtos em Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatarNumero(totalProdutosStock)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {produtosStockMinimo} mínimo, {produtosEsgotados} esgotados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total do Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatarMoeda(valorTotalStock)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">{filial.empresa_nome}</div>
          </CardContent>
        </Card>
      </div>

      {/* Endereço */}
      {endereco && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin size={18} /> Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-medium">Rua:</span> {endereco.rua}
            </p>
            <p>
              <span className="font-medium">Bairro:</span> {endereco.bairro}
            </p>
            <p>
              <span className="font-medium">Município:</span>{" "}
              {endereco.municipio_nome}
            </p>
            <p>
              <span className="font-medium">Província:</span>{" "}
              {endereco.provincia_nome}
            </p>
            {endereco.ponto_referencia && (
              <p>
                <span className="font-medium">Ref:</span>{" "}
                {endereco.ponto_referencia}
              </p>
            )}
            {endereco.latitude && endereco.longitude && (
              <p>
                <span className="font-medium">Coordenadas:</span>{" "}
                {endereco.latitude}, {endereco.longitude}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Abas */}
      <Tabs defaultValue="funcionarios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="funcionarios" className="gap-2">
            <Users size={14} /> Funcionários
          </TabsTrigger>
          <TabsTrigger value="stocks" className="gap-2">
            <Package size={14} /> Stock
          </TabsTrigger>
        </TabsList>

        <TabsContent value="funcionarios">
          {funcionariosList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
              <Users size={40} className="text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                Nenhum funcionário encontrado.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Papel</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {funcionariosList.map((func) => (
                    <TableRow key={func.id}>
                      <TableCell className="font-medium">
                        {func.nome_completo}
                      </TableCell>
                      <TableCell>{func.email}</TableCell>
                      <TableCell>{func.cargo}</TableCell>
                      <TableCell>{func.papel}</TableCell>
                      <TableCell>
                        <Badge
                          variant={func.ativo ? "default" : "secondary"}
                          className={func.ativo ? "bg-green-600" : ""}
                        >
                          {func.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/equipa/funcionarios/${func.id}`)
                          }
                        >
                          <Eye size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="stocks">
          {stocksList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
              <Package size={40} className="text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Nenhum stock registado.</p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead className="text-right">Stock Mínimo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stocksList.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell className="font-medium">
                        {stock.produto_nome}
                      </TableCell>
                      <TableCell>{stock.produto_codigo}</TableCell>
                      <TableCell className="text-right">
                        {stock.quantidade}
                      </TableCell>
                      <TableCell className="text-right">
                        {stock.stock_minimo}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            stock.quantidade === 0
                              ? "destructive"
                              : stock.quantidade <= stock.stock_minimo
                                ? "secondary"
                                : "default"
                          }
                          className={
                            stock.quantidade <= stock.stock_minimo &&
                            stock.quantidade > 0
                              ? "bg-yellow-600"
                              : ""
                          }
                        >
                          {stock.quantidade === 0
                            ? "Esgotado"
                            : stock.quantidade <= stock.stock_minimo
                              ? "Stock Mínimo"
                              : "Normal"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            router.push(`/invetario/stocks/${stock.id}`)
                          }
                        >
                          <Eye size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modais */}
      <AfilialForm
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        defaultValues={filial}
      />

      <ConfirmModal
        isOpen={statusModalOpen}
        onOpenChange={setStatusModalOpen}
        onConfirm={confirmToggleStatus}
        title={filial.ativo ? "Desativar Filial" : "Ativar Filial"}
        description={
          filial.ativo
            ? "A filial ficará inativa e não poderá ser utilizada em operações. Deseja continuar?"
            : "A filial será reativada e poderá voltar a ser usada. Deseja continuar?"
        }
        confirmVariant={filial.ativo ? "destructive" : "default"}
        confirmText={filial.ativo ? "Desativar" : "Ativar"}
        confirmIcon={
          filial.ativo ? <PowerOff size={16} /> : <Power size={16} />
        }
        icon={filial.ativo ? <PowerOff size={28} /> : <Power size={28} />}
        iconClassName={
          filial.ativo
            ? "bg-destructive/10 text-destructive"
            : "bg-primary/10 text-primary"
        }
      />
    </div>
  );
}

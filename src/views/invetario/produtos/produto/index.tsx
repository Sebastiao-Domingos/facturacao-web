// src/app/(dashboard)/produtos/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit2,
  Package,
  ShieldCheck,
  Tag,
  Layers,
  Scale,
  Barcode,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeaderPage } from "@/components/header-page";
import { ErrorComponent } from "@/components/error-component";
import { cn } from "@/lib/utils";
import { useProduct } from "@/src/hooks/product/use-products";
import { useOpenModal } from "@/src/components/modals/form-model-shared";
import { ProdutoForm } from "../forms/produto-form";
import { Product } from "@/src/schemas/product-schema";

// Interface exata baseada na resposta real da tua API
interface ProdutoDetalhes {
  id: string;
  nome: string;
  tipo: "P" | "S";
  imagem: string | null;
  categoria: string;
  categoria_detalhes: {
    id: string;
    nome: string;
    descricao: string;
  };
  unidade_medida: string;
  unidade_detalhes: {
    id: string;
    sigla: string;
    nome: string;
  };
  taxa_iva: string;
  taxa_detalhes: {
    id: string;
    codigo: string;
    valor: string;
    descricao: string;
    motivo_isencao: string | null;
    codigo_isencao_agt: string | null;
  };
  preco_venda: string; // Vem como string numérica do DRF
  codigo_barras: string;
  ref_interna: string;
  ativo: boolean;
  thumbnail: string | null;
}

export default function ProdutoDetalhesPage() {
  const { openModal, setOpenModal } = useOpenModal<Product>();
  const params = useParams();
  const router = useRouter();
  const id = params.produto;

  const { data, isLoading, isError, isSuccess } = useProduct(
    id?.toString() || "",
  );

  if (isError) {
    return (
      <ErrorComponent
        message="Erro ao carregar o artigo"
        description="Não foi possível obter a ficha detalhada deste produto."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6 bg-background animate-pulse">
        <div className="h-10 w-32 bg-muted rounded-md" />
        <div className="h-24 bg-muted rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-40 bg-muted rounded-xl" />
          <div className="h-40 bg-muted rounded-xl" />
          <div className="h-40 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  const precoFormatado = parseFloat(data?.preco_venda!).toLocaleString(
    "pt-AO",
    {
      style: "currency",
      currency: "AOA",
    },
  );

  if (isSuccess) {
    return (
      <div className="space-y-4 bg-background">
        {/* Botão de Retorno Rápido */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => router.back()}
          >
            <ArrowLeft size={14} />
            Voltar à listagem
          </Button>
        </div>

        {/* Cabeçalho de Branding Técnico */}
        <HeaderPage
          title={data.nome}
          description={`Ficha técnica do registo comercial e tributário na plataforma Dimbo DC.`}
          Icon={data.tipo === "P" ? <Package size={24} /> : <Tag size={24} />}
        >
          <Button
            className="h-10 gap-1.5 font-medium px-4 shadow-sm"
            variant="outline"
            onClick={() =>
              setOpenModal({
                id: data.id,
                defaultValue: data,
                isOpened: true,
              })
            }
          >
            <Edit2 size={14} />
            Editar Artigo
          </Button>
        </HeaderPage>

        {/* Grid Principal de Blocos de Informação */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Painel da Esquerda: Resumo do Produto & Imagem */}
          <div className="lg:col-span-1 space-y-5">
            <div className="p-5 border border-border bg-card rounded-xl shadow-sm text-center flex flex-col items-center justify-center space-y-4">
              {/* Imagem do Produto ou Placeholder Sólido */}
              <div className="w-32 h-32 rounded-xl bg-muted border border-border/60 flex items-center justify-center text-muted-foreground/60 overflow-hidden">
                {data.imagem ? (
                  <img
                    src={data.imagem}
                    alt={data.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={48} className="stroke-[1.5]" />
                )}
              </div>

              <div className="space-y-1.5 w-full">
                <div className="flex justify-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-mono tracking-wider uppercase"
                  >
                    {data.tipo === "P" ? "Produto (P)" : "Serviço (S)"}
                  </Badge>
                  {data.ativo ? (
                    <Badge className="bg-emerald-600/10 text-emerald-600 border-emerald-500/20 text-[10px] uppercase font-semibold h-5">
                      <CheckCircle2 size={10} className="mr-1 inline" /> Ativo
                    </Badge>
                  ) : (
                    <Badge className="bg-rose-600/10 text-rose-600 border-rose-500/20 text-[10px] uppercase font-semibold h-5">
                      <XCircle size={10} className="mr-1 inline" /> Inativo
                    </Badge>
                  )}
                </div>
                <h2 className="text-sm font-bold text-foreground truncate max-w-full px-2">
                  {data.nome}
                </h2>
              </div>

              {/* Bloco de Preço Corporativo Solto */}
              <div className="w-full pt-4 border-t border-border/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                  Preço de Venda Base
                </span>
                <p className="text-xl font-black text-foreground tracking-tight font-mono">
                  {precoFormatado}
                </p>
              </div>
            </div>
          </div>

          {/* Painel Central e Direita: Dados de Gestão e Dados Fiscais AGT */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card de Gestão Operacional */}
            <div className="p-5 border border-border bg-card rounded-xl shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 border-b border-border pb-2">
                  <Layers size={14} className="text-primary" />
                  Dados Operacionais
                </h3>

                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-medium uppercase text-muted-foreground block">
                      Ref. Interna / SKU
                    </span>
                    <p className="text-xs font-mono font-semibold text-foreground mt-0.5">
                      {data.ref_interna || "Não atribuído"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-medium uppercase text-muted-foreground block">
                      Categoria do Artigo
                    </span>
                    <p className="text-xs font-semibold text-foreground mt-0.5">
                      {data.categoria_detalhes.nome}
                    </p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {data.categoria_detalhes.descricao}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-medium uppercase text-muted-foreground block">
                      Unidade de Venda
                    </span>
                    <p className="text-xs font-semibold text-foreground mt-0.5">
                      {data.unidade_detalhes.nome}{" "}
                      <span className="font-mono text-muted-foreground">
                        ({data.unidade_detalhes.sigla})
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Código de barras num bloco próprio e legível */}
              <div className="pt-3 border-t border-border/60 flex items-center gap-3">
                <div className="p-2 bg-muted rounded-md text-muted-foreground">
                  <Barcode size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-medium uppercase text-muted-foreground block">
                    Código de Barras (EAN)
                  </span>
                  <p className="text-xs font-mono font-bold text-foreground tracking-widest">
                    {data.codigo_barras}
                  </p>
                </div>
              </div>
            </div>

            {/* Card de Enquadramento Fiscal (Essencial para Auditoria da AGT em Angola) */}
            <div className="p-5 border border-border bg-card rounded-xl shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 border-b border-border pb-2">
                <Scale size={14} className="text-emerald-600" />
                Especificações Fiscais
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-medium uppercase text-muted-foreground block">
                    Código de Imposto
                  </span>
                  <Badge
                    variant="outline"
                    className="font-mono text-xs mt-1 px-2 py-0.5 text-emerald-700 bg-emerald-500/5 border-emerald-500/20"
                  >
                    {data.taxa_detalhes.codigo}
                  </Badge>
                </div>

                <div>
                  <span className="text-[10px] font-medium uppercase text-muted-foreground block">
                    Percentagem do IVA
                  </span>
                  <div className="flex items-baseline text-emerald-600 mt-0.5">
                    <span className="text-2xl font-bold tracking-tight">
                      {parseFloat(data.taxa_detalhes.valor)}
                    </span>
                    <span className="text-sm font-semibold ml-0.5">%</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-medium uppercase text-muted-foreground block">
                    Enquadramento Tributário
                  </span>
                  <p className="text-xs font-medium text-foreground mt-0.5">
                    {data.taxa_detalhes.descricao}
                  </p>
                </div>

                {/* Bloco Condicional para Isenções Fiscais */}
                <div
                  className={cn(
                    "p-3 rounded-lg border text-xs leading-normal",
                    data.taxa_detalhes.motivo_isencao
                      ? "border-amber-500/20 bg-amber-500/5 text-amber-700"
                      : "border-border bg-muted/40 text-muted-foreground",
                  )}
                >
                  {data.taxa_detalhes.motivo_isencao ? (
                    <div className="space-y-1">
                      <span className="font-bold block uppercase text-[9px] tracking-wider text-amber-800">
                        Isenção detetada
                      </span>
                      <p className="font-medium text-[11px]">
                        {data.taxa_detalhes.motivo_isencao}
                      </p>
                      <p className="font-mono text-[10px] mt-1">
                        Cód. AGT: {data.taxa_detalhes.codigo_isencao_agt}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 py-0.5">
                      <ShieldCheck size={14} className="text-emerald-600" />
                      <span className="font-medium text-[11px]">
                        Sujeito à taxa padrão sem isenção.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {openModal.isOpened && (
          <ProdutoForm
            isOpen={openModal.isOpened}
            onOpenChange={(value) =>
              setOpenModal({ isOpened: value, defaultValue: data })
            }
            onSuccess={() =>
              setOpenModal({ isOpened: false, defaultValue: data })
            }
            initialData={openModal.defaultValue}
          />
        )}
      </div>
    );
  }
}

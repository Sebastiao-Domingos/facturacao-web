"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useAfilia } from "@/src/hooks/empresa/afilia/use-afilia";
import { useCategorias } from "@/src/hooks/product/use-categoria";

interface FiltrosRelatorioProps {
  onFiltrar: (filtros: {
    dataInicio: Date;
    dataFim: Date;
    filial: string;
    agrupamento: string;
    categoria: string;
  }) => void;
}

export function FiltrosRelatorio({ onFiltrar }: FiltrosRelatorioProps) {
  const [dataInicio, setDataInicio] = useState<Date>(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });
  const [dataFim, setDataFim] = useState<Date>(new Date());
  const [filial, setFilial] = useState<string>("todas");
  const [agrupamento, setAgrupamento] = useState<string>("mes");
  const [categoria, setCategoria] = useState<string>("todas");

  const { data: filiais } = useAfilia();
  const { data: categorias } = useCategorias();

  const aplicar = () => {
    onFiltrar({
      dataInicio,
      dataFim,
      filial: filial === "todas" ? "" : filial,
      agrupamento,
      categoria: categoria === "todas" ? "" : categoria,
    });
  };

  return (
    <div className="flex flex-wrap gap-4 items-end p-4 border rounded-lg bg-muted/20">
      <div className="space-y-1">
        <Label className="text-xs">Data Início</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(dataInicio, "dd/MM/yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dataInicio}
              onSelect={(date) => date && setDataInicio(date)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Data Fim</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[200px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(dataFim, "dd/MM/yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dataFim}
              onSelect={(date) => date && setDataFim(date)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Filial</Label>
        <Select value={filial} onValueChange={setFilial}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {filiais?.map((f) => (
              <SelectItem key={f.id} value={f?.id!}>
                {f.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Agrupamento (Vendas)</Label>
        <Select value={agrupamento} onValueChange={setAgrupamento}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dia">Dia</SelectItem>
            <SelectItem value="semana">Semana</SelectItem>
            <SelectItem value="mes">Mês</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Categoria (Produtos)</Label>
        <Select value={categoria} onValueChange={setCategoria}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {categorias?.results &&
              categorias?.results.map((cat) => (
                <SelectItem key={cat.id} value={cat.id!}>
                  {cat.nome}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={aplicar}>Aplicar Filtros</Button>
    </div>
  );
}

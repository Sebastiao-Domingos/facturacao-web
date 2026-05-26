// src/services/empresa/compra-service.ts
import {
  Fornecedor,
  FornecedorList,
  FornecedorSchema,
} from "@/src/schemas/empresa/compras/fornecedor-schema";
import {
  CompraCreate,
  CompraResponse,
  CompraList,
  CompraResponseSchema,
} from "@/src/schemas/empresa/compras/compra-schema";
import { PaginatedResponse } from "@/src/types";
import { z } from "zod";
import { api } from "../../api";

const FORNECEDOR_URL = "/faturacao/fornecedores";
const COMPRA_URL = "/faturacao/compras";

export class CompraService {
  // ========== FORNECEDORES ==========
  async listarFornecedores(params?: {
    search?: string;
    ativo?: boolean;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<FornecedorList>> {
    const response = await api.get(`${FORNECEDOR_URL}/`, { params });
    return response.data;
  }

  async getFornecedor(id: string): Promise<Fornecedor> {
    const response = await api.get(`${FORNECEDOR_URL}/${id}/`);
    return FornecedorSchema.parse(response.data);
  }

  async criarFornecedor(data: Fornecedor): Promise<Fornecedor> {
    const response = await api.post(`${FORNECEDOR_URL}/`, data);
    return FornecedorSchema.parse(response.data);
  }

  async atualizarFornecedor(
    id: string,
    data: Partial<Fornecedor>,
  ): Promise<Fornecedor> {
    const response = await api.patch(`${FORNECEDOR_URL}/${id}/`, data);
    return FornecedorSchema.parse(response.data);
  }

  async eliminarFornecedor(id: string): Promise<void> {
    await api.delete(`${FORNECEDOR_URL}/${id}/`);
  }

  // ========== COMPRAS ==========
  async listarCompras(params?: {
    estado?: string;
    fornecedor?: string;
    filial?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<CompraList>> {
    const response = await api.get(`${COMPRA_URL}/`, { params });
    return response.data;
  }

  async getCompra(id: string): Promise<CompraResponse> {
    const response = await api.get(`${COMPRA_URL}/${id}/`);
    return CompraResponseSchema.parse(response.data);
  }

  async criarCompra(data: CompraCreate): Promise<CompraResponse> {
    const response = await api.post(`${COMPRA_URL}/`, data);
    return CompraResponseSchema.parse(response.data);
  }

  async confirmarCompra(id: string): Promise<CompraResponse> {
    const response = await api.post(`${COMPRA_URL}/${id}/confirmar/`);
    return CompraResponseSchema.parse(response.data);
  }

  async cancelarCompra(id: string): Promise<void> {
    await api.post(`${COMPRA_URL}/${id}/cancelar/`);
  }
}

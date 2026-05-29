// src/services/clientes/cliente-service.ts
import { PaginatedResponse } from "@/src/types";
import { api } from "../api";
import {
  ClienteFormData,
  ClienteResponse,
  ClienteList,
} from "../../schemas/empresa/clientes/cliente-schema";

export class ClienteService {
  // Endpoint alinhado com o Django
  readonly endpoint = "/faturacao/clientes/";

  /**
   * Obtém a lista paginada de clientes com suporte a filtros dinâmicos
   */
  async get(
    params?: Record<string, any>,
  ): Promise<PaginatedResponse<ClienteList>> {
    const response = await api.get<PaginatedResponse<ClienteList>>(
      this.endpoint,
      { params },
    );
    return response.data;
  }

  /**
   * Obtém a ficha detalhada de um único cliente pelo ID
   */
  async getById(id: string): Promise<ClienteResponse> {
    const response = await api.get<ClienteResponse>(`${this.endpoint}${id}/`);
    return response.data;
  }

  /**
   * Cria um novo cliente (Particular ou Empresa)
   */
  async create(data: ClienteFormData): Promise<ClienteResponse> {
    // Remove campos undefined e null
    const cleanData = this.removeEmptyValues(data);
    const response = await api.post<ClienteResponse>(this.endpoint, cleanData);
    return response.data;
  }

  /**
   * Atualiza os dados do cliente e do seu endereço aninhado
   */
  async update(
    id: string,
    data: Partial<ClienteFormData>,
  ): Promise<ClienteResponse> {
    const cleanData = this.removeEmptyValues(data);
    const response = await api.patch<ClienteResponse>(
      `${this.endpoint}${id}/`,
      cleanData,
    );
    return response.data;
  }

  /**
   * Desativa um cliente (soft delete)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}${id}/`);
  }

  /**
   * Ativa um cliente
   */
  async activate(id: string): Promise<ClienteResponse> {
    const response = await api.patch<ClienteResponse>(
      `${this.endpoint}${id}/`,
      {
        ativo: true,
      },
    );
    return response.data;
  }

  /**
   * Remove campos undefined, null e strings vazias
   */
  private removeEmptyValues<T extends Record<string, any>>(
    data: T,
  ): Partial<T> {
    const result: Partial<T> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null && value !== "") {
        if (typeof value === "object" && !(value instanceof File)) {
          result[key as keyof T] = this.removeEmptyValues(value) as any;
        } else {
          result[key as keyof T] = value;
        }
      }
    }

    return result;
  }
}

export const clienteService = new ClienteService();

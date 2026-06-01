import { FuncionarioFormData } from "@/src/schemas/empresa/afilias/funcionario-schema";
import { api } from "../api";
import {
  FuncionarioList,
  FuncionarioResponse,
} from "@/src/schemas/empresa/funcionarios/funcionario-schema";
import { PaginatedResponse } from "@/src/types";

class FuncionarioService {
  readonly endpoint = "/organizacao/funcionarios";

  async create(data: FuncionarioFormData): Promise<FuncionarioList> {
    console.log(data);
    const response = await api.post<FuncionarioList>(`${this.endpoint}/`, data);
    return response.data;
  }

  async update({
    data,
    id,
  }: {
    id: string;
    data: Partial<FuncionarioFormData>;
  }): Promise<FuncionarioList> {
    const response = await api.put<FuncionarioList>(
      `${this.endpoint}/${id}/`,
      data,
    );

    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}/${id}/`);
  }

  async toggleStatus({
    ativo,
    id,
  }: {
    id: string;
    ativo: boolean;
  }): Promise<FuncionarioList> {
    const posfix = ativo ? "ativar/" : "desativar/";

    const response = await api.post<FuncionarioList>(
      `/organizacao/funcionarios/${id}/${posfix}/`,
    );
    return response.data;
  }

  async get(filters?: {
    filial?: string;
    papel?: string;
    ativo?: boolean;
  }): Promise<PaginatedResponse<FuncionarioList>> {
    const params = new URLSearchParams();
    if (filters?.filial) params.append("filial", filters.filial);
    if (filters?.papel) params.append("papel", filters.papel);
    if (filters?.ativo !== undefined)
      params.append("ativo", String(filters.ativo));

    const response = await api.get<PaginatedResponse<FuncionarioList>>(
      `/organizacao/funcionarios/${params.toString() ? `?${params}` : ""}`,
    );
    return response.data;
  }

  async getById(id: string): Promise<FuncionarioResponse> {
    const response = await api.get<FuncionarioResponse>(
      `/organizacao/funcionarios/${id}/`,
    );
    return response.data;
  }

  async getCurrentUser(): Promise<FuncionarioResponse> {
    const response = await api.get<FuncionarioResponse>(`${this.endpoint}/me/`);
    return response.data;
  }
}

export const serviceFuncioario = new FuncionarioService();

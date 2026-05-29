import { FuncionarioList } from "@/src/schemas/empresa/funcionarios/funcionario-schema";
import { api } from "../api";
import { PaginatedResponse } from "@/src/types";
import {
  FuncionarioCreate,
  FuncionarioResponse,
  FuncionarioUpdate,
} from "@/src/schemas/empresa/afilias/funcionario-schema";

export class FuncionarioService {
  readonly endpoint = "/organizacao/funcionarios";

  async get(): Promise<PaginatedResponse<FuncionarioList>> {
    const response = await api.get<PaginatedResponse<FuncionarioList>>(
      this.endpoint,
    );
    return response.data;
  }

  async create(data: FuncionarioCreate): Promise<FuncionarioResponse> {
    const response = await api.post<FuncionarioResponse>(this.endpoint, data);
    return response.data;
  }

  async update(data: FuncionarioUpdate): Promise<FuncionarioResponse> {
    const response = await api.put<FuncionarioResponse>(
      `${this.endpoint}/${data.id}`,
      data,
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }
}

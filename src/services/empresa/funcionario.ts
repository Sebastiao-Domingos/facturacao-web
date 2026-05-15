import {
  Funcionario,
  FuncionarioCreate,
} from "@/src/schemas/empresa/afilias/funcionario-schema";
import { api } from "../api";
import { PaginatedResponse } from "@/src/types";

export class FuncionarioService {
  readonly endpoint = "/organizacao/funcionarios";

  async get(): Promise<PaginatedResponse<Funcionario>> {
    const response = await api.get<PaginatedResponse<Funcionario>>(
      this.endpoint,
    );
    return response.data;
  }

  async create(data: FuncionarioCreate): Promise<Funcionario> {
    const response = await api.post<Funcionario>(this.endpoint, data);
    return response.data;
  }

  async update(data: Funcionario): Promise<Funcionario> {
    const response = await api.put<Funcionario>(
      `${this.endpoint}/${data.id}`,
      data,
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}/${id}`);
  }
}

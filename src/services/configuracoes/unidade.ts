import { Unidade } from "@/src/schemas/configuracoes/unidade-schema";
import { api } from "../api";

export class UnidadeService {
  readonly endpoint = "/faturacao/unidades-medida/";

  async get(): Promise<Unidade[]> {
    const response = await api.get<Unidade[]>(this.endpoint);
    return response.data;
  }

  async create(data: Unidade): Promise<Unidade> {
    const response = await api.post<Unidade>(this.endpoint, data);

    return response.data;
  }

  async update(data: Unidade): Promise<Unidade> {
    const response = await api.put<Unidade>(
      `${this.endpoint}${data.id}/`,
      data,
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}${id}/`);
  }
}

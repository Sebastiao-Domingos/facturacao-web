import { PaginatedResponse } from "@/src/types";
import { api } from "../api";
import { Categoria } from "@/src/schemas/product-schema";

export class CategoriaService {
  readonly endpoint = "/faturacao/categorias/";

  async get(): Promise<PaginatedResponse<Categoria>> {
    const response = await api.get<PaginatedResponse<Categoria>>(this.endpoint);
    return response.data;
  }

  async create(data: Categoria): Promise<Categoria> {
    const response = await api.post<Categoria>(this.endpoint, data);

    return response.data;
  }

  async update(data: Categoria): Promise<Categoria> {
    const response = await api.put<Categoria>(
      `${this.endpoint}${data.id}/`,
      data
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}${id}/`);
  }
}

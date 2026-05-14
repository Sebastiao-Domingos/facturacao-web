import { PaginatedResponse } from "@/src/types";
import { api } from "../api";
import { Categoria } from "@/src/schemas/product-schema";

export class CategoriaService {
  readonly endpoint = "/faturacao/categorias/";

  async getCategorias(): Promise<PaginatedResponse<Categoria>> {
    const response = await api.get<PaginatedResponse<Categoria>>(this.endpoint);
    return response.data;
  }

  async createCategoria(data: Categoria): Promise<Categoria> {
    const response = await api.post<Categoria>(this.endpoint, data);

    return response.data;
  }

  async updateCategoria(id: number, data: Categoria): Promise<Categoria> {
    const response = await api.put<Categoria>(`${this.endpoint}${id}/`, data);
    return response.data;
  }

  async deleteCategoria(id: number): Promise<void> {
    await api.delete(`${this.endpoint}${id}/`);
  }
}

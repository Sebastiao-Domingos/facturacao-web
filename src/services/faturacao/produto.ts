import { Product } from "@/src/schemas/product-schema";
import { api } from "../api";
import { PaginatedResponse } from "@/src/types";

export class ProdutoService {
  readonly endpoint = "/faturacao/produtos/";

  async getProdutos({
    page = 1,
    search = "",
  }: { page?: number; search?: string } = {}): Promise<
    PaginatedResponse<Product>
  > {
    const response = await api.get<PaginatedResponse<Product>>(
      `${this.endpoint}?page=${page}&search=${search}`,
      {
        params: { page, search },
      }
    );
    return response.data;
  }

  async createProduto(formData: FormData): Promise<Product> {
    const response = await api.post(this.endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }
}

import { ProductFormData } from "@/src/schemas/product-schema";
import { api } from "../api";
import { PaginatedResponse } from "@/src/types";

export const faturacaoService = {
  getProdutos: async (page = 1, search = "") => {
    const response = await api.get<PaginatedResponse<ProductFormData>>(
      "/faturacao/produtos/",
      {
        params: { page, search },
      },
    );
    return response.data;
  },

  createProduto: async (formData: FormData) => {
    const response = await api.post("/faturacao/produtos/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

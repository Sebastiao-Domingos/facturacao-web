// src/actions/products-actions.ts
"use server";

import { api } from "@/src/services/api"; // Se a API estiver configurada para server-side
import { revalidatePath } from "next/cache";

export async function createProductAction(prevState: any, formData: FormData) {
  // 1. Extração dos dados
  const rawData = {
    nome: formData.get("nome"),
    preco: Number(formData.get("preco")),
    stock: Number(formData.get("stock")),
    categoria: formData.get("categoria"),
  };

  try {
    // 2. Chamada ao Backend Django
    const response = await api.post("/produtos/", rawData);

    // 3. Revalidação (Diz ao Next.js para atualizar a lista de produtos)
    revalidatePath("/dashboard/produtos");

    return {
      success: true,
      message: "Produto criado com sucesso!",
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Erro ao conectar ao servidor.",
    };
  }
}

export async function deleteProductAction(id: number) {
  try {
    await api.delete(`/produtos/${id}/`);
    revalidatePath("/dashboard/produtos");
    return {
      success: true,
      message: "Produto excluido com sucesso!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Erro ao conectar ao servidor.",
    };
  }
}

export async function updateProductAction(id: number, formData: FormData) {
  const rawData = {
    nome: formData.get("nome"),
    preco: Number(formData.get("preco")),
    stock: Number(formData.get("stock")),
    categoria: formData.get("categoria"),
  };

  try {
    await api.put(`/produtos/${id}/`, rawData);
    revalidatePath("/dashboard/produtos");
    return {
      success: true,
      message: "Produto atualizado com sucesso!",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.detail || "Erro ao conectar ao servidor.",
    };
  }
}

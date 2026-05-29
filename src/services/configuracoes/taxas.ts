import { Taxa } from "@/src/schemas/configuracoes/taxa-schema";
import { api } from "../api";

export class TaxaService {
  readonly endpoint = "/faturacao/taxa-iva/";

  async get(): Promise<Taxa[]> {
    const response = await api.get<Taxa[]>(this.endpoint);
    return response.data;
  }

  async create(data: Taxa): Promise<Taxa> {
    const response = await api.post<Taxa>(this.endpoint, data);

    return response.data;
  }

  async update(data: Taxa): Promise<Taxa> {
    const response = await api.put<Taxa>(`${this.endpoint}${data.id}/`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}${id}/`);
  }
}

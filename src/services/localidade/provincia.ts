import { api } from "../api";
import { Provincia } from "@/src/schemas/localidade/provincia-schema";

export class ProvinciaService {
  readonly endpoint = "/organizacao/provincias/";

  async get(): Promise<Provincia[]> {
    const response = await api.get<Provincia[]>(this.endpoint);
    return response.data;
  }

  async create(data: Provincia): Promise<Provincia> {
    const response = await api.post<Provincia>(this.endpoint, data);

    return response.data;
  }

  async update(data: Provincia): Promise<Provincia> {
    const response = await api.put<Provincia>(
      `${this.endpoint}${data.id}/`,
      data
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}${id}/`);
  }
}

import { PaginatedResponse } from "@/src/types";
import { api } from "../api";
import { Municipio } from "@/src/schemas/localidade/municipio-schema";

export class MunicipioService {
  readonly endpoint = "/organizacao/municipios/";

  async get(): Promise<PaginatedResponse<Municipio>> {
    const response = await api.get<PaginatedResponse<Municipio>>(this.endpoint);
    return response.data;
  }

  async create(data: Municipio): Promise<Municipio> {
    const response = await api.post<Municipio>(this.endpoint, data);

    return response.data;
  }

  async update(data: Municipio): Promise<Municipio> {
    const response = await api.put<Municipio>(
      `${this.endpoint}${data.id}/`,
      data,
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}${id}/`);
  }
}

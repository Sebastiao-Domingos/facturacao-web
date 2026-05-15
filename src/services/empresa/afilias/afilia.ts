import { Afilias } from "@/src/schemas/empresa/afilias/afilia-schema";
import { api } from "../../api";

export class AfiliaService {
  readonly endpoint = "/organizacao/filiais/";

  async get(): Promise<Afilias[]> {
    const response = await api.get<Afilias[]>(this.endpoint);
    return response.data;
  }

  async create(data: Afilias): Promise<Afilias> {
    const response = await api.post<Afilias>(this.endpoint, data);

    return response.data;
  }

  async update(data: Afilias): Promise<Afilias> {
    const response = await api.put<Afilias>(
      `${this.endpoint}${data.id}/`,
      data,
    );
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}${id}/`);
  }
}

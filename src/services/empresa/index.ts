import { Empresa } from "@/src/schemas/empresa/empresa-schema";
import { api } from "../api";

export class EmpresaService {
  readonly endpoint = "organizacao/empresas/";
  async get(): Promise<Empresa> {
    const response = await api.get<Empresa>(this.endpoint);
    return response.data;
  }

  async update(data: Empresa): Promise<Empresa> {
    const response = await api.put<Empresa>(this.endpoint, data);
    return response.data;
  }
}

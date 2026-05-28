import {
  Empresa,
  EmpresaSchema,
  EmpresaUpdate,
} from "@/src/schemas/empresa/empresa-schema";
import { api } from "../api";

export class EmpresaService {
  readonly endpoint = "organizacao/empresas/";
  async get(): Promise<Empresa> {
    const response = await api.get<Empresa>(this.endpoint);
    return response.data;
  }

  async update(data: Empresa): Promise<Empresa> {
    const response = await api.patch(`/organizacao/empresas/${data.id}/`, data);
    return EmpresaSchema.parse(response.data);
  }

  async getMinhaEmpresa(): Promise<Empresa> {
    const response = await api.get("/organizacao/empresas/me/");
    return response.data;
  }
}

// src/services/empresa/empresa-service.ts

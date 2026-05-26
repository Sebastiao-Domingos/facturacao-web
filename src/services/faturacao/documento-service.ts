// src/services/empresa/documento-service.ts
import { api } from "../api";
import {
  DocumentoCreate,
  DocumentoResponse,
  DocumentoList,
  DocumentoResponseSchema,
  DocumentoListSchema,
} from "../../schemas/empresa/faturacao/documento-schema";
import {
  PagamentoCreate,
  PagamentoResponse,
  PagamentoResponseSchema,
} from "../../schemas/empresa/faturacao/pagamento-schema";
import { z } from "zod";
import { PaginatedResponse } from "@/src/types";

const DOCUMENTO_URL = "/faturacao/documentos";
const PAGAMENTO_URL = "/faturacao/pagamentos";

export class DocumentoService {
  // GET /api/v1/faturacao/documentos/ - Listar documentos
  async listar(params?: {
    tipo?: string;
    estado?: string;
    cliente?: string;
    data_inicio?: string;
    data_fim?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<DocumentoList>> {
    const response = await api.get<PaginatedResponse<DocumentoList>>(
      `${DOCUMENTO_URL}/`,
      { params },
    );
    return response.data;
  }

  // GET /api/v1/faturacao/documentos/{id}/ - Detalhe do documento
  async getById(id: string): Promise<DocumentoResponse> {
    const response = await api.get(`${DOCUMENTO_URL}/${id}/`);
    return DocumentoResponseSchema.parse(response.data);
  }

  // POST /api/v1/faturacao/documentos/ - Criar documento
  async create(data: DocumentoCreate): Promise<DocumentoResponse> {
    console.log("service : ", data);
    const response = await api.post(`${DOCUMENTO_URL}/`, data);
    return DocumentoResponseSchema.parse(response.data);
  }

  // POST /api/v1/faturacao/documentos/{id}/emitir/ - Emitir documento
  async emitir(id: string): Promise<DocumentoResponse> {
    const response = await api.post(`${DOCUMENTO_URL}/${id}/emitir/`);
    return DocumentoResponseSchema.parse(response.data);
  }

  // POST /api/v1/faturacao/documentos/{id}/anular/ - Anular documento
  async anular(id: string): Promise<DocumentoResponse> {
    const response = await api.post(`${DOCUMENTO_URL}/${id}/anular/`);
    return DocumentoResponseSchema.parse(response.data);
  }

  // GET /api/v1/faturacao/documentos/{id}/pdf/ - Download PDF
  async downloadPdf(id: string): Promise<Blob> {
    const response = await api.get(`${DOCUMENTO_URL}/${id}/pdf/`, {
      responseType: "blob",
    });
    return response.data;
  }

  // POST /api/v1/faturacao/documentos/{id}/pagamentos/ - Registrar pagamento
  async registrarPagamento(
    id: string,
    data: PagamentoCreate,
  ): Promise<PagamentoResponse> {
    const response = await api.post(`${DOCUMENTO_URL}/${id}/pagamentos/`, data);
    return PagamentoResponseSchema.parse(response.data);
  }
}

export const documentoService = new DocumentoService();

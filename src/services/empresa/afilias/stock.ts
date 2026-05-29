import {
  MovimentacaoListResponseSchema,
  MovimentacaoPayload,
  MovimentacaoPayloadSchema,
  MovimentacaoResponse,
  MovimentacaoResponseSchema,
  Stock,
  StockFilters,
} from "@/src/schemas/empresa/afilias/stock-schema";
import { api } from "../../api";
import { PaginatedResponse } from "@/src/types";

export class StockService {
  readonly endpoint = "/faturacao/stocks/";

  async get(params?: StockFilters): Promise<PaginatedResponse<Stock>> {
    console.log("service : ", params);
    const response = await api.get<PaginatedResponse<Stock>>(this.endpoint, {
      params,
    });
    return response.data;
  }

  async getStock(id: string): Promise<Stock> {
    const response = await api.get<Stock>(`${this.endpoint}${id}`);
    return response.data;
  }

  async create(data: Stock): Promise<Stock> {
    const response = await api.post<Stock>(this.endpoint, data);

    return response.data;
  }

  async update(data: Stock): Promise<Stock> {
    const response = await api.put<Stock>(`${this.endpoint}${data.id}/`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await api.delete(`${this.endpoint}${id}/`);
  }

  async movimentar(
    stockId: string,
    payload: MovimentacaoPayload,
  ): Promise<MovimentacaoResponse> {
    // Valida o payload antes de enviar
    const validatedPayload = MovimentacaoPayloadSchema.parse(payload);
    const response = await api.post(
      `${this.endpoint}${stockId}/movimentar/`,
      validatedPayload,
    );
    return MovimentacaoResponseSchema.parse(response.data);
  }

  // GET /api/v1/faturacao/movimentacoes/?stock_filial={id}
  async getHistorico(
    stockId: string,
  ): Promise<PaginatedResponse<MovimentacaoResponse>> {
    const response = await api.get<PaginatedResponse<MovimentacaoResponse>>(
      `/faturacao/movimentacoes/?stock_filial=${stockId}`,
    );

    return response.data;
  }
}

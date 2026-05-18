import { Stock } from "@/src/schemas/empresa/afilias/stock-schema";
import { api } from "../../api";
import { PaginatedResponse } from "@/src/types";

export class StockService {
  readonly endpoint = "/faturacao/stocks/";

  async get(): Promise<PaginatedResponse<Stock>> {
    const response = await api.get<PaginatedResponse<Stock>>(this.endpoint);
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
}

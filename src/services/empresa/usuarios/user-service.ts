// src/services/empresa/user-service.ts
import { PaginatedResponse } from "@/src/types";
import { api } from "../../api";
import { User } from "@/src/schemas/empresa/usuarios/user-schema";

const USERS_URL = "/organizacao/usuarios";

class UserService {
  async list(params?: {
    search?: string;
    is_active?: boolean;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<User>> {
    const response = await api.get(USERS_URL, { params });
    return response.data;
  }
  async resetPassword(newPassword: string): Promise<void> {
    await api.post(`${USERS_URL}/change-password/`, {
      new_password: newPassword,
    });
  }
}

export const userService = new UserService();

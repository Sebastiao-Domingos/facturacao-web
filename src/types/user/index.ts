export interface Endereco {
  id: string;
  bairro: string;
  rua: string;
  ponto_referencia: string;
  longitude: string;
  latitude: string;
  municipio: string;
  municipio_nome: string;
  provincia_nome: string;
}

export interface User {
  id: string;
  nome_completo: string;
  user: string; // Este é o username/email
  filial_nome: string;
  endereco: Endereco;
  created_at: string;
  updated_at: string;
  bi: string;
  cargo: string;
  telemovel: string;
  papel: "SUPERADMIN" | "ADMIN" | "GESTOR" | "OPERADOR" | "CONTABILISTA"; // Adiciona os papéis que usas
  ativo: boolean;
  filial: string; // ID da filial
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface AuthContextType {
  user: User | null;
  login: (data: AuthResponse) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

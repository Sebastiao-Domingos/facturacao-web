// src/schemas/empresa/clientes/cliente-schema.ts
import { z } from "zod";

export const tipoOptions = [
  { value: "P", label: "Particular" },
  { value: "E", label: "Empresa" },
] as const;

// Schema do endereço - TODOS OS CAMPOS OBRIGATÓRIOS
export const enderecoSchema = z.object({
  bairro: z.string().min(1, "Bairro é obrigatório"),
  rua: z.string().min(1, "Rua é obrigatória"),
  ponto_referencia: z.string().optional(),
  longitude: z.string().nullable().optional(),
  latitude: z.string().nullable().optional(),
  municipio: z.string().min(1, "Município é obrigatório"),
});

// Schema principal - TODOS OS CAMPOS DEFINIDOS (sem opcionais confusos)
export const clienteFormSchema = z.object({
  tipo: z.enum(["P", "E"]),
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  nif: z.string().nullable(),
  email: z.string().nullable(),
  telefone: z.string().nullable(),
  razao_social: z.string().nullable(),
  website: z.string().nullable(),
  bilhete_identidade: z.string().nullable(),
  ativo: z.boolean(),
  endereco: enderecoSchema,
});

// Tipo inferido
export type ClienteFormData = z.infer<typeof clienteFormSchema>;

// Valores padrão para o formulário
export const defaultClienteValues: ClienteFormData = {
  tipo: "P",
  nome: "",
  nif: null,
  email: null,
  telefone: null,
  razao_social: null,
  website: null,
  bilhete_identidade: null,
  ativo: true,
  endereco: {
    bairro: "",
    rua: "",
    ponto_referencia: "",
    longitude: null,
    latitude: null,
    municipio: "",
  },
};

// Schema para resposta da API
export const clienteResponseSchema = z.object({
  id: z.string(),
  tipo: z.enum(["P", "E"]),
  tipo_display: z.string(),
  nome: z.string(),
  nif: z.string().nullable(),
  email: z.string().nullable(),
  telefone: z.string().nullable(),
  endereco: z
    .object({
      id: z.string(),
      bairro: z.string(),
      rua: z.string(),
      ponto_referencia: z.string().nullable(),
      longitude: z.string().nullable(),
      latitude: z.string().nullable(),
      municipio: z.string(),
      municipio_nome: z.string(),
      provincia_nome: z.string(),
      provincia_id: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
    })
    .nullable(),
  razao_social: z.string().nullable(),
  website: z.string().nullable(),
  bilhete_identidade: z.string().nullable(),
  ativo: z.boolean(),
  data_criacao: z.string(),
});

export type ClienteResponse = z.infer<typeof clienteResponseSchema>;

export type ClienteList = z.infer<typeof clienteResponseSchema>;

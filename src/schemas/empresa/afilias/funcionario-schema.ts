// src/schemas/empresa/afilias/funcionario-schema.ts
import z from "zod";
import { EnderecoSchema } from "../../localidade/municipio-schema";

// Definição dos papéis
export const papeis = [
  { value: "SUPERADMIN", label: "Administrador" },
  { value: "ADMIN", label: "Administrador de Filial" },
  { value: "GESTOR", label: "Gestor de Filial" },
  { value: "OPERADOR", label: "Operador de Caixa" },
  { value: "CONTABILISTA", label: "Contabilista" },
] as const;

export const papeisValues = papeis.map((p) => p.value) as string[];

//Schema do endereço

// Schema base (sem refine)
const FuncionarioBaseSchema = {
  first_name: z
    .string()
    .min(2, "Primeiro nome deve ter no mínimo 2 caracteres"),
  last_name: z.string().min(2, "Último nome deve ter no mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  bi: z
    .string()
    .regex(/^\d{9}[A-Z]{2}\d{3}$/, "Formato inválido. Exemplo: 009876543BG001"),
  cargo: z.string().min(2, "Cargo deve ter no mínimo 2 caracteres"),
  telemovel: z
    .string()
    .regex(/^9\d{8}$/, "Telefone deve começar com 9 e ter 9 dígitos"),
  papel: z.string().min(1, "Papel é obrigatório"),
  ativo: z.boolean(),
  filial: z.uuid({ error: "A filial é obrigatória" }).optional(),

  endereco: EnderecoSchema,
  password: z.string().optional(),
  confirm_password: z.string().optional(),
};

// Schema do formulário com refine
export const FuncionarioFormSchema = z.object(FuncionarioBaseSchema).refine(
  (data) => {
    if (data.password || data.confirm_password) {
      return data.password === data.confirm_password;
    }
    return true;
  },
  {
    message: "As palavras-passe não coincidem",
    path: ["confirm_password"],
  },
);

// Schema para criação (sem refine e sem confirm_password)
export const FuncionarioCreateSchema = z.object({
  first_name: FuncionarioBaseSchema.first_name,
  last_name: FuncionarioBaseSchema.last_name,
  email: FuncionarioBaseSchema.email,
  bi: FuncionarioBaseSchema.bi,
  cargo: FuncionarioBaseSchema.cargo,
  telemovel: FuncionarioBaseSchema.telemovel,
  papel: FuncionarioBaseSchema.papel,
  ativo: FuncionarioBaseSchema.ativo,
  filial: FuncionarioBaseSchema.filial,
  endereco: FuncionarioBaseSchema.endereco,
  password: FuncionarioBaseSchema.password,
});

// Schema para atualização (todos opcionais)
export const FuncionarioUpdateSchema = FuncionarioCreateSchema.partial();

// Schema para resposta da API
export const FuncionarioResponseSchema = z.object({
  id: z.string().uuid(),
  nome_completo: z.string(),
  email: z.string().email(),
  bi: z.string(),
  cargo: z.string(),
  papel: z.string(),
  ativo: z.boolean(),
  telemovel: z.string(),
  filial: z.string().uuid().optional(),
  filial_nome: z.string(),
  created_at: z.string().datetime(),
});

// Schema para listagem
export const FuncionarioListSchema = FuncionarioResponseSchema.pick({
  id: true,
  nome_completo: true,
  email: true,
  bi: true,
  cargo: true,
  papel: true,
  ativo: true,
  telemovel: true,
  filial_nome: true,
  created_at: true,
});

export type FuncionarioFormData = z.infer<typeof FuncionarioFormSchema>;
export type FuncionarioCreate = z.infer<typeof FuncionarioCreateSchema>;
export type FuncionarioUpdate = z.infer<typeof FuncionarioUpdateSchema>;
export type FuncionarioResponse = z.infer<typeof FuncionarioResponseSchema>;
export type FuncionarioList = z.infer<typeof FuncionarioListSchema>;

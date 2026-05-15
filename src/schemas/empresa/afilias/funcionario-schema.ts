import z from "zod";
import { EnderecoSchema } from "../../localidade/municipio-schema";

export const FuncionarioSchema = z.object({
  id: z.uuid().optional(),
  nome_complento: z.string().optional(),
  user: z.email().optional(),
  filial_nome: z.string(),
  filial: z.uuid(),
  bi: z.string(),
  cargo: z.string(),
  telemovel: z.string(),
  papel: z.string(),
  ativo: z.boolean(),
  endereco: EnderecoSchema,
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const FuncionarioCreateSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.email(),
  password: z.string(),
  endereco_data: EnderecoSchema,
  bi: z
    .string({
      error: "O número do BI é obrigatório",
    })
    .max(14, "O número do BI deve ter no máximo 14 caracteres")
    .min(14, "O número do BI deve ter no mínimo 14 caracteres")
    .regex(
      /^[A-Za-z]{2}[0-9]{12}$/,
      "O número do BI deve ter exatamente 14 dígitos, e duas letras. Exemplo: 123456789BG123",
    ),
  cargo: z.string(),
  telemovel: z
    .string()
    .max(9, "O telemovel deve ter no máximo 9 dígitos")
    .min(9, "O telemovel deve ter no mínimo 9 dígitos")
    .regex(/^[0-9]+$/, "O telemovel deve conter apenas números"),
  papel: z.string().optional(),
  ativo: z.boolean(),
  filial: z.uuid(),
});

export type Funcionario = z.infer<typeof FuncionarioSchema>;

export type FuncionarioCreate = z.infer<typeof FuncionarioCreateSchema>;

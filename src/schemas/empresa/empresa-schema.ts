import z from "zod";
import { EnderecoSchema } from "../localidade/municipio-schema";

export const EmpresaSchema = z.object({
  id: z.uuid(),
  nome_fantasia: z.string(),
  razao_social: z.string(),
  nif: z.string(),
  logotipo: z.instanceof(File).or(z.url()),
  endereco: EnderecoSchema,
  moeda_padrao: z.string(),
  regime_tributario: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  total_funcionarios: z.number().optional().nullable(),
  total_filiais: z.number().optional().nullable(),
  total_produtos_stock: z.number().optional().nullable(),
});

export type Empresa = z.infer<typeof EmpresaSchema>;

// Schema para atualização (todos os campos opcionais)
export const EmpresaUpdateSchema = EmpresaSchema.partial().extend({
  id: z.string().uuid(),
});
export type EmpresaUpdate = z.infer<typeof EmpresaUpdateSchema>;

// Schema para o formulário (sem campos de leitura)
export const EmpresaFormSchema = EmpresaSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  endereco: true,
}).extend({
  endereco: z.object({
    bairro: z.string().optional(),
    rua: z.string().optional(),
    ponto_referencia: z.string().optional(),
    municipio: z.string().optional(),
  }),
});
export type EmpresaFormData = z.infer<typeof EmpresaFormSchema>;

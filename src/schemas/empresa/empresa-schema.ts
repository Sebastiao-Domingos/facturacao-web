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
});

export type Empresa = z.infer<typeof EmpresaSchema>;

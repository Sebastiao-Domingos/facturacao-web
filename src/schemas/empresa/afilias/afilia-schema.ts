import z from "zod";
import { EnderecoSchema } from "../../localidade/municipio-schema";

export const AfiliasSchema = z.object({
  id: z.uuid().optional(),
  empresa_nome: z.string().optional(),
  endereco: EnderecoSchema,
  nome: z.string().min(3, "No mínimo 3 caracteres"),
  codigo_agt: z
    .string()
    .max(15, "No máximo 15 caracteres")
    .min(3, "No mínimo 3 caracteres"),
  e_sede: z.boolean(),
  serie_documentos: z
    .string()
    .min(1, "No mínimo 1 caracter")
    .max(5, "No máximo 5 caracteres"),
  empresa: z.uuid().optional(),
  created_at: z.date().or(z.string()).optional(),
  updated_at: z.date().or(z.string()).optional(),
});

export type Afilias = z.infer<typeof AfiliasSchema>;

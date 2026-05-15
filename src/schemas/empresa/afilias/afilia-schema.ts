import z from "zod";
import { EnderecoSchema } from "../../localidade/municipio-schema";

export const AfiliasSchema = z.object({
  id: z.uuid().optional(),
  empresa_nome: z.string(),
  endereco: EnderecoSchema,
  nome: z.string(),
  codigo_agt: z.string(),
  e_sede: z.boolean(),
  serie_documentos: z.string(),
  empresa: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type Afilias = z.infer<typeof AfiliasSchema>;

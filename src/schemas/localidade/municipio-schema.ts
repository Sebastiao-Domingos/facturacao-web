import { z } from "zod";

export const MunicipioSchema = z.object({
  id: z.uuid().optional(),
  nome: z.string({
    error: "O nome é obrigatório",
  }),
  provincia: z.uuid({
    error: "A província é obrigatório",
  }),
  provincia_nome: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const EnderecoSchema = z.object({
  id: z.uuid().optional(),
  bairro: z.string(),
  rua: z.string(),
  ponto_referencia: z.string(),
  longitude: z.string(),
  latitude: z.string(),
  municipio: z.uuid(),
  municipio_nome: z.string().optional(),
  provincia_nome: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type Municipio = z.infer<typeof MunicipioSchema>;

export type Endereco = z.infer<typeof EnderecoSchema>;

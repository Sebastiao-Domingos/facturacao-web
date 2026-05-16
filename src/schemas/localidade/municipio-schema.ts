import { z } from "zod";

export const MunicipioSchema = z.object({
  id: z.uuid().optional(),
  nome: z
    .string({
      error: "O nome é obrigatório",
    })
    .min(3, "No mínimo 3 caracteres"),
  provincia: z.uuid({
    error: "A província é obrigatório",
  }),
  provincia_nome: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const EnderecoSchema = z.object({
  id: z.uuid().optional(),
  bairro: z.string().min(3, "No mínimo 2 caracteres"),
  rua: z.string().min(1, "NO mínimo 1 caracter"),
  ponto_referencia: z.string().min(3, "no mínimo 3 caracteres"),
  longitude: z.string().or(z.number()).optional(),
  latitude: z.string().or(z.number()).optional(),
  municipio: z.uuid({ error: "O município é obrigatório!" }),
  municipio_nome: z.string().optional(),
  provincia_nome: z.string().optional(),
  provincia_id: z.string().optional(),
  created_at: z.date().or(z.string()).optional(),
  updated_at: z.date().or(z.string()).optional(),
});

export type Municipio = z.infer<typeof MunicipioSchema>;

export type Endereco = z.infer<typeof EnderecoSchema>;

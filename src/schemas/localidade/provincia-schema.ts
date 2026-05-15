// src/schemas/product-schema.ts
import { z } from "zod";
import { MunicipioSchema } from "./municipio-schema";

export const ProvinciaSchema = z.object({
  id: z.uuid().optional(),
  nome: z.string(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  municipios: z.array(MunicipioSchema).optional(),
});

export type Provincia = z.infer<typeof ProvinciaSchema>;

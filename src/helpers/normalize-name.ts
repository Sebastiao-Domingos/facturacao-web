import { useCallback } from "react";

export const normalizeName = (name: string) => {
  return name.trim().replace(/\s+/g, " ");
};

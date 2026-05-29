"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js"; // Importação da biblioteca
import { api } from "@/src/services/api";
import { User, AuthResponse, AuthContextType } from "@/src/types/user";
import { useQueryClient } from "@tanstack/react-query";

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Chave para criptografia (Em produção, usa process.env.NEXT_PUBLIC_CRYPTO_KEY)
const CRYPTO_KEY = process.env.NEXT_PUBLIC_CRYPTO_KEY!;

const cookieConfig = {
  expires: 7,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Função Auxiliar: Criptografar
  const encrypt = (data: any) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), CRYPTO_KEY).toString();
  };

  // Função Auxiliar: Descriptografar
  const decrypt = (ciphertext: string) => {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, CRYPTO_KEY);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const loadStorageData = () => {
      try {
        const token = Cookies.get("token");
        const storedUser = Cookies.get("user");

        if (token && storedUser && storedUser !== "undefined") {
          // Tentamos descriptografar os dados do cookie
          const decryptedUser = decrypt(storedUser);

          if (decryptedUser) {
            setUser(decryptedUser);
            api.defaults.headers.Authorization = `Bearer ${token}`;
          } else {
            // Se os dados estiverem corrompidos ou a chave mudar, faz logout
            logout();
          }
        }
      } catch (error) {
        console.error("Erro ao carregar sessão:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };
    loadStorageData();
  }, []);

  const login = async (data: AuthResponse) => {
    try {
      if (!data.access) {
        throw new Error("Token de acesso não recebido.");
      }

      api.defaults.headers.Authorization = `Bearer ${data.access}`;

      const { data: userData } = await api.get<User>(
        "organizacao/utilizador/logado/",
      );

      // Criptografamos o objeto do utilizador antes de salvar
      const encryptedUser = encrypt(userData);

      Cookies.set("token", data.access, cookieConfig);
      Cookies.set("refresh", data.refresh, cookieConfig);
      Cookies.set("user", encryptedUser, cookieConfig); // Salva o texto cifrado

      setUser(userData);
      router.replace("/");
    } catch (error) {
      console.error("Falha ao completar login:", error);
      logout();
      throw error;
    }
  };

  const logout = () => {
    // Remover todos os cookies com configuração explícita
    const cookies = ["token", "refresh", "user"];
    cookies.forEach((name) => {
      Cookies.remove(name, { path: "/" });
      Cookies.remove(name, { path: "/", domain: window.location.hostname });
    });

    // Limpar localStorage (caso exista algum dado)
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    // Limpar estado do React Query
    queryClient.clear();
    queryClient.resetQueries(); // força reset de todas as queries

    // Limpar headers do axios
    delete api.defaults.headers.Authorization;

    // Limpar estado local
    setUser(null);

    // Forçar redirecionamento com recarregamento da página
    window.location.href = "/login";
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

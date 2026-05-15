import TaxasPage from "@/src/views/configuracoes/taxas";

export default TaxasPage;

export const metadata = {
  title: "Configurações - Impostos",
  description: "Configuração de taxas e motivos de isenção.",
  openGraph: {
    title: "Configurações - Impostos",
    description: "Configuração de taxas e motivos de isenção.",
    url: "/dashboard/configuracoes/taxas",
    siteName: "Sergão Facturação",
    images: [
      {
        url: "/og-images/configuracoes-taxas.png",
        width: 1200,
        height: 630,
        alt: "Configurações - Impostos",
      },
    ],
    locale: "pt-PT",
    type: "website",
  },
};

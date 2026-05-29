const apiBaseUrlLocal =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888/api/v1";

export const handleImprimir = ({
  pdfUrl,
  apiBaseUrl,
}: {
  pdfUrl: string;
  apiBaseUrl?: string;
}) => {
  const url = apiBaseUrl
    ? `${apiBaseUrl}${pdfUrl}`
    : `${apiBaseUrlLocal}${pdfUrl}`;
  const printWindow = window.open(url, "_blank");
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  } else {
    // Fallback: abrir na mesma aba (o utilizador imprime manualmente)
    window.location.href = pdfUrl;
  }
};

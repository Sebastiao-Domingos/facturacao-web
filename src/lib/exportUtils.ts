import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToExcel = (data: any[], fileName: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Relatório");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const exportToPDF = (
  data: any[],
  fileName: string,
  headers?: string[],
) => {
  const doc = new jsPDF();
  doc.text(fileName, 14, 10);
  const columns = headers || Object.keys(data[0] || {});
  const body = data.map((row) => columns.map((col) => row[col]));
  autoTable(doc, {
    head: [columns],
    body,
    startY: 20,
  });
  doc.save(`${fileName}.pdf`);
};

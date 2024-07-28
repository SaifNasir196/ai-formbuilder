import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { ParsedFormResponse } from "@/lib/type"

export const exportToCSV = (data: ParsedFormResponse[]) => {
  const allKeys = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));
  const header = allKeys.join(',');
  const rows = data.map(obj => 
    allKeys.map(key => {
      let cell = obj[key as keyof ParsedFormResponse] || '';
      cell = cell.toString().replace(/"/g, '""');
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        cell = `"${cell}"`;
      }
      return cell;
    }).join(',')
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'form_responses.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToPDF = (data: ParsedFormResponse[]) => {
  const doc = new jsPDF()
  const tableColumn = Object.keys(data[0])
  const tableRows = data.map(item => Object.values(item))

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  })
  
  doc.text("Form Responses", 14, 15)
  doc.save('form_responses.pdf')
};


export const handleBulkDelete = (selectedRows: ParsedFormResponse[]) => {
  console.log('Bulk delete', selectedRows)
  // Implement actual delete logic here
  // This might involve calling an API, updating state, etc.
};

// Add any other utility functions you need...